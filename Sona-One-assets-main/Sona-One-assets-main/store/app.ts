import { create } from 'zustand'
import type { LookId } from './configurator'
import type { AccessoryId } from '../lib/products'

export type Tier = 'high' | 'mid' | 'low'
export type SceneId =
  | 'home'
  | 'studio'
  | 'story'
  | 'lookbook'
  | 'preorder'
  | 'credits'
  | 'notfound'
  | 'listen'
  | 'specs'
  | 'shop'
  | 'about'
  | 'ambient'

export type SpecsView = 'front' | 'side' | 'spin'
export type ListenEnv = 'plane' | 'train' | 'cafe' | 'street'
export type ListenMode = 'off' | 'transparency' | 'anc'

/** Read the GPU name once so integrated graphics start on a lighter pipeline. */
export function gpuName() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    if (!gl) return ''
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const name = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER))
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return name
  } catch {
    return ''
  }
}

function initialTier(): Tier {
  if (typeof window === 'undefined') return 'high'
  const forced = new URLSearchParams(window.location.search).get('tier')
  if (forced === 'high' || forced === 'mid' || forced === 'low') return forced
  const gpu = gpuName()
  if (!gpu || /swiftshader|llvmpipe|software|basic render/i.test(gpu)) return 'low'
  const integrated = /intel|uhd|iris|mali|adreno|powervr|apple gpu|videocore/i.test(gpu) && !/apple m\d/i.test(gpu)
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = window.innerWidth < 900
  if (integrated || (coarse && small)) return 'mid'
  return 'high'
}

function initialReduced() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface AppState {
  tier: Tier
  reducedMotion: boolean
  soundOn: boolean
  loaded: boolean
  introDone: boolean
  scene: SceneId
  /** DOM element the 3D view is centred in (Studio, Shop). */
  studioStage: HTMLElement | null
  homeLook: LookId
  preorderDone: number
  menuOpen: boolean
  bagOpen: boolean
  specsView: SpecsView
  shopFocus: AccessoryId
  shopHex: string
  listenEnv: ListenEnv
  listenMode: ListenMode
  setMenuOpen: (v: boolean) => void
  setBagOpen: (v: boolean) => void
  setSpecsView: (v: SpecsView) => void
  setShopFocus: (id: AccessoryId, hex: string) => void
  setListenEnv: (v: ListenEnv) => void
  setListenMode: (v: ListenMode) => void
  setTier: (t: Tier | ((prev: Tier) => Tier)) => void
  setSoundOn: (v: boolean) => void
  setLoaded: () => void
  setIntroDone: () => void
  setScene: (s: SceneId) => void
  setStudioStage: (el: HTMLElement | null) => void
  setHomeLook: (l: LookId) => void
  celebrate: () => void
}

export const useApp = create<AppState>((set) => ({
  tier: initialTier(),
  reducedMotion: initialReduced(),
  soundOn: false,
  loaded: false,
  introDone: false,
  scene: 'home',
  studioStage: null,
  homeLook: 'graphite',
  preorderDone: 0,
  menuOpen: false,
  bagOpen: false,
  specsView: 'front',
  shopFocus: 'case',
  shopHex: '#3a3b3f',
  listenEnv: 'plane',
  listenMode: 'off',
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setBagOpen: (bagOpen) => set({ bagOpen }),
  setSpecsView: (specsView) => set({ specsView }),
  setShopFocus: (shopFocus, shopHex) => set({ shopFocus, shopHex }),
  setListenEnv: (listenEnv) => set({ listenEnv }),
  setListenMode: (listenMode) => set({ listenMode }),
  setTier: (t) => set((s) => ({ tier: typeof t === 'function' ? t(s.tier) : t })),
  setSoundOn: (soundOn) => set({ soundOn }),
  setLoaded: () => set({ loaded: true }),
  setIntroDone: () => set({ introDone: true }),
  setScene: (scene) => set({ scene }),
  setStudioStage: (studioStage) => set({ studioStage }),
  setHomeLook: (homeLook) => set({ homeLook }),
  celebrate: () => set((s) => ({ preorderDone: s.preorderDone + 1 })),
}))
