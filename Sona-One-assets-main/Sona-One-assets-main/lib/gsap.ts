import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { scrollState } from './scrollState'

gsap.registerPlugin(ScrollTrigger, SplitText)
gsap.defaults({ ease: 'power3.out', duration: 0.9 })

let lenis: Lenis | null = null

export function initLenis(reducedMotion: boolean) {
    if (lenis) return lenis;

    lenis = new Lenis({
        autoRaf: false,
        lerp: reducedMotion ? 1 : 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        smoothWheel: !reducedMotion,
        syncTouch: false,
        anchors: true,
        allowNestedScroll: true,
    })
    lenis.on('scroll', (l: Lenis) => {
        scrollState.velocity = l.velocity
        ScrollTrigger.update()
    })
    gsap.ticker.add((time) => lenis?.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return lenis
}

export function getLenis() {
    return lenis
}

export { gsap, ScrollTrigger, SplitText }