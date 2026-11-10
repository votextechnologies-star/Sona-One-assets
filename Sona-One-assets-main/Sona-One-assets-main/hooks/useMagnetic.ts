import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
const MAX_SHIFT = 6

export function useMagnetic<T extends HTMLElement>(strength = 0.12) {
    const ref = useRef<T>(null)
    useEffect(() => {
        const el = ref.current
        if (!el || !window.matchMedia('(pointer: fine)').matches) return
        const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })
        const clamp = gsap.utils.clamp(-MAX_SHIFT, MAX_SHIFT)
        const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect()
            xTo(clamp((e.clientX - (r.left + r.width / 2)) * strength))
            yTo(clamp((e.clientY - (r.top + r.height / 2)) * strength))
        }
        const leave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' })
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        return () => {
            el.removeEventListener('pointermove', move)
            el.removeEventListener('pointerleave', leave)
        }
    }, [strength])
    return ref
}