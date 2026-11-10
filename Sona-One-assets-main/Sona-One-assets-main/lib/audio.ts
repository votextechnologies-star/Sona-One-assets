/**
 * A tiny generative soundtrack built entirely with the Web Audio API
 * (no audio files to license or download). 96 BPM: kick, sub, hats and a
 * slow evolving pad. Exposes an AnalyserNode so visuals can react to it.
 */

const BPM = 96
const BEAT = 60 / BPM
const CHORDS = [
  [57, 60, 64, 67, 71], // Am9
  [53, 57, 60, 64, 67], // Fmaj9
  [48, 52, 55, 59, 62], // Cmaj9
  [55, 59, 62, 66, 69], // G(add9)
]

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12)

class AudioEngine {
  ctx: AudioContext | null = null
  master: GainNode | null = null
  analyser: AnalyserNode | null = null
  private data: Uint8Array<ArrayBuffer> = new Uint8Array(512)
  private padVoices: { osc: OscillatorNode[]; gain: GainNode }[] = []
  private sub: OscillatorNode | null = null
  private subGain: GainNode | null = null
  private noise: AudioBuffer | null = null
  private timer: number | null = null
  private nextBeat = 0
  private beatIndex = 0
  playing = false

  private ensure() {
    if (this.ctx) return this.ctx
    const ctx = new AudioContext()
    this.ctx = ctx

    const master = ctx.createGain()
    master.gain.value = 0
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.ratio.value = 3
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.72
    master.connect(comp).connect(analyser).connect(ctx.destination)
    this.master = master
    this.analyser = analyser
    this.data = new Uint8Array(analyser.frequencyBinCount)

    // Pad: 5 voices x 2 detuned saws through a slowly breathing low-pass
    const padFilter = ctx.createBiquadFilter()
    padFilter.type = 'lowpass'
    padFilter.frequency.value = 900
    padFilter.Q.value = 0.6
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.05
    lfoGain.gain.value = 500
    lfo.connect(lfoGain).connect(padFilter.frequency)
    lfo.start()
    const padBus = ctx.createGain()
    padBus.gain.value = 0.05
    padFilter.connect(padBus).connect(master)

    for (let i = 0; i < 5; i++) {
      const gain = ctx.createGain()
      gain.gain.value = 0.2
      gain.connect(padFilter)
      const osc = [-7, 7].map((detune) => {
        const o = ctx.createOscillator()
        o.type = 'sawtooth'
        o.detune.value = detune
        o.frequency.value = midi(CHORDS[0][i])
        o.connect(gain)
        o.start()
        return o
      })
      this.padVoices.push({ osc, gain })
    }

    // Sub bass follows chord root
    const sub = ctx.createOscillator()
    sub.type = 'sine'
    sub.frequency.value = midi(CHORDS[0][0] - 24)
    const subGain = ctx.createGain()
    subGain.gain.value = 0
    sub.connect(subGain).connect(master)
    sub.start()
    this.sub = sub
    this.subGain = subGain

    // White noise buffer for hats
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
    const ch = buffer.getChannelData(0)
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1
    this.noise = buffer

    return ctx
  }

  private kick(t: number) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.setValueAtTime(140, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.9, t + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42)
    o.connect(g).connect(this.master!)
    o.start(t)
    o.stop(t + 0.45)
  }

  private hat(t: number, level: number) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 7500
    const g = ctx.createGain()
    g.gain.setValueAtTime(level, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
    src.connect(hp).connect(g).connect(this.master!)
    src.start(t)
    src.stop(t + 0.08)
  }

  private schedule = () => {
    const ctx = this.ctx!
    while (this.nextBeat < ctx.currentTime + 0.12) {
      const t = this.nextBeat
      const i = this.beatIndex
      const bar = Math.floor(i / 4)
      if (i % 8 === 0) {
        const chord = CHORDS[Math.floor(bar / 2) % CHORDS.length]
        this.padVoices.forEach((v, n) => v.osc.forEach((o) => o.frequency.setTargetAtTime(midi(chord[n]), t, 0.6)))
        this.sub!.frequency.setTargetAtTime(midi(chord[0] - 24), t, 0.02)
      }
      this.kick(t)
      this.subGain!.gain.cancelScheduledValues(t)
      this.subGain!.gain.setValueAtTime(0.0001, t)
      this.subGain!.gain.linearRampToValueAtTime(0.28, t + 0.02)
      this.subGain!.gain.exponentialRampToValueAtTime(0.02, t + BEAT * 0.9)
      this.hat(t + BEAT / 2, 0.08)
      if (i % 2 === 1) this.hat(t + BEAT * 0.75, 0.035)
      this.nextBeat += BEAT
      this.beatIndex++
    }
  }

  async start() {
    const ctx = this.ensure()
    if (ctx.state !== 'running') await ctx.resume()
    if (this.playing) return
    this.playing = true
    this.nextBeat = ctx.currentTime + 0.1
    this.timer = window.setInterval(this.schedule, 25)
    this.master!.gain.cancelScheduledValues(ctx.currentTime)
    this.master!.gain.setTargetAtTime(0.55, ctx.currentTime, 0.6)
  }

  stop() {
    this.stopLab()
    if (!this.ctx || !this.playing) return
    this.playing = false
    const ctx = this.ctx
    this.master!.gain.cancelScheduledValues(ctx.currentTime)
    this.master!.gain.setTargetAtTime(0, ctx.currentTime, 0.25)
    if (this.timer) window.clearInterval(this.timer)
    this.timer = null
    window.setTimeout(() => {
      if (!this.playing) ctx.suspend()
    }, 1200)
  }

  /* ───────────── Listening lab: synthesised environments + ANC modes ───────────── */

  private lab: {
    bus: GainNode
    hp: BiquadFilterNode
    stoppers: (() => void)[]
    timers: number[]
  } | null = null
  private brown: AudioBuffer | null = null
  private labMode: 'off' | 'transparency' | 'anc' = 'off'

  private brownNoise(ctx: AudioContext) {
    if (this.brown) return this.brown
    const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
    const d = buf.getChannelData(0)
    let last = 0
    for (let i = 0; i < d.length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      d[i] = last * 3.5
    }
    this.brown = buf
    return buf
  }

  private loop(ctx: AudioContext, buffer: AudioBuffer, dest: AudioNode) {
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    src.loopStart = Math.random()
    src.connect(dest)
    src.start()
    return () => {
      try {
        src.stop()
      } catch {
        /* already stopped */
      }
      src.disconnect()
    }
  }

  private burst(dest: AudioNode, t: number, freq: number, q: number, level: number, length: number) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = freq
    bp.Q.value = q
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(level, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + length)
    src.connect(bp).connect(g).connect(dest)
    src.start(t)
    src.stop(t + length + 0.05)
  }

  private ping(dest: AudioNode, t: number, freq: number, level: number) {
    const ctx = this.ctx!
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = freq
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(level, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
    o.connect(g).connect(dest)
    o.start(t)
    o.stop(t + 0.55)
  }

  /** Start (or switch) the environment noise. Also starts the soundtrack. */
  async startLab(env: 'plane' | 'train' | 'cafe' | 'street') {
    await this.start()
    const ctx = this.ctx!
    this.stopLab()
    const bus = ctx.createGain()
    bus.gain.value = 0
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 20
    bus.connect(hp).connect(this.master!)
    const stoppers: (() => void)[] = []
    const timers: number[] = []
    const brown = this.brownNoise(ctx)
    const lp = (freq: number, gain: number) => {
      const f = ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.value = freq
      const g = ctx.createGain()
      g.gain.value = gain
      f.connect(g).connect(bus)
      return f
    }

    if (env === 'plane') {
      stoppers.push(this.loop(ctx, brown, lp(420, 1.1)))
      stoppers.push(this.loop(ctx, this.noise!, lp(2400, 0.035)))
    } else if (env === 'train') {
      stoppers.push(this.loop(ctx, brown, lp(650, 0.8)))
      // wheels over rail joints: a double clack every ~1.2 s
      timers.push(
        window.setInterval(() => {
          const t = ctx.currentTime + 0.05
          this.burst(bus, t, 1400, 1.2, 0.35, 0.09)
          this.burst(bus, t + 0.16, 1250, 1.2, 0.3, 0.09)
        }, 1200),
      )
    } else if (env === 'cafe') {
      // murmur: band-limited noise with a slow, uneven swell
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 850
      bp.Q.value = 0.7
      const murmur = ctx.createGain()
      murmur.gain.value = 0.28
      bp.connect(murmur).connect(bus)
      stoppers.push(this.loop(ctx, this.noise!, bp))
      stoppers.push(this.loop(ctx, brown, lp(300, 0.25)))
      timers.push(
        window.setInterval(() => {
          murmur.gain.setTargetAtTime(0.18 + Math.random() * 0.2, ctx.currentTime, 0.4)
          if (Math.random() < 0.35) this.ping(bus, ctx.currentTime + Math.random() * 0.3, 2600 + Math.random() * 1400, 0.05)
        }, 700),
      )
    } else {
      stoppers.push(this.loop(ctx, brown, lp(900, 0.55)))
      // a car passing every few seconds
      const pass = () => {
        const t = ctx.currentTime + 0.05
        const src = ctx.createBufferSource()
        src.buffer = brown
        const f = ctx.createBiquadFilter()
        f.type = 'lowpass'
        f.frequency.setValueAtTime(300, t)
        f.frequency.linearRampToValueAtTime(1600, t + 1.4)
        f.frequency.linearRampToValueAtTime(350, t + 3)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(1.4, t + 1.4)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2)
        src.connect(f).connect(g).connect(bus)
        src.start(t)
        src.stop(t + 3.3)
      }
      pass()
      timers.push(window.setInterval(pass, 5200))
    }

    this.lab = { bus, hp, stoppers, timers }
    this.setLabMode(this.labMode)
  }

  setLabMode(mode: 'off' | 'transparency' | 'anc') {
    this.labMode = mode
    if (!this.lab || !this.ctx) return
    const t = this.ctx.currentTime
    // "off" still has the cushions' passive seal; ANC removes the lows and most of the rest.
    const level = mode === 'off' ? 0.9 : mode === 'transparency' ? 1.1 : 0.06
    const cut = mode === 'anc' ? 1100 : 20
    this.lab.bus.gain.setTargetAtTime(level, t, 0.18)
    this.lab.hp.frequency.setTargetAtTime(cut, t, 0.18)
  }

  stopLab() {
    if (!this.lab || !this.ctx) return
    const lab = this.lab
    this.lab = null
    lab.timers.forEach((id) => window.clearInterval(id))
    lab.bus.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1)
    window.setTimeout(() => {
      lab.stoppers.forEach((stop) => stop())
      lab.bus.disconnect()
    }, 500)
  }

  get labRunning() {
    return !!this.lab
  }

  /** Short UI blip. Only audible while the soundtrack is on. */
  blip(freq = 1320) {
    if (!this.ctx || !this.playing) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(freq, t)
    o.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.08)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
    o.connect(g).connect(this.master!)
    o.start(t)
    o.stop(t + 0.12)
  }

  /**
   * Frequency bands normalised to 0..1. When silent, returns a synthetic
   * 96 BPM pulse so audio-reactive visuals never look dead.
   */
  bands(time: number, out: { bass: number; mid: number; high: number; live: boolean }) {
    if (this.analyser && this.playing) {
      this.analyser.getByteFrequencyData(this.data)
      const avg = (a: number, b: number) => {
        let s = 0
        for (let i = a; i < b; i++) s += this.data[i]
        return s / ((b - a) * 255)
      }
      out.bass = avg(1, 5)
      out.mid = avg(5, 40)
      out.high = avg(40, 180)
      out.live = true
    } else {
      const phase = (time / BEAT) % 1
      out.bass = Math.pow(1 - phase, 6) * 0.85
      out.mid = 0.25 + 0.1 * Math.sin(time * 0.7)
      out.high = Math.pow(1 - ((phase + 0.5) % 1), 10) * 0.4
      out.live = false
    }
    return out
  }
}

export const audio = new AudioEngine()