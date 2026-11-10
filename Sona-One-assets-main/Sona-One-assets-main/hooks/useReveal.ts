import { useLayoutEffect, useRef } from 'react'
import { gsap, SplitText } from '../lib/gsap'
import { useApp } from '../store/app'

/**
 * Masked line reveal with GSAP SplitText. `on: 'scroll'` reveals when the element
 * enters the viewport; `on: 'load'` waits for the preloader to finish.
 */
export function useSplitReveal<T extends HTMLElement>({ on = 'scroll', delay = 0 }: { on?: 'scroll' | 'load'; delay?: number } = {}) {
  const ref = useRef<T>(null)
  const loaded = useApp((s) => s.loaded)
  const reduced = useApp((s) => s.reducedMotion)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (on === 'load' && !loaded) {
      gsap.set(el, { autoAlpha: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 1 })
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 115,
            rotate: 2,
            duration: 1.25,
            ease: 'expo.out',
            stagger: 0.09,
            delay,
            scrollTrigger:
              on === 'scroll' ? { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } : undefined,
          })
        },
      })
    })
    return () => ctx.revert()
  }, [on, loaded, reduced, delay])
  return ref
}

/** Simple fade-up for paragraphs, buttons and groups. */
export function useFadeUp<T extends HTMLElement>({ on = 'scroll', delay = 0, stagger = 0.08 }: { on?: 'scroll' | 'load'; delay?: number; stagger?: number } = {}) {
  const ref = useRef<T>(null)
  const loaded = useApp((s) => s.loaded)
  const reduced = useApp((s) => s.reducedMotion)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const targets = el.dataset.stagger !== undefined ? Array.from(el.children) : [el]
    if (on === 'load' && !loaded) {
      gsap.set(targets, { autoAlpha: 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger,
          delay,
          scrollTrigger: on === 'scroll' ? { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } : undefined,
        },
      )
    })
    return () => ctx.revert()
  }, [on, loaded, reduced, delay, stagger])
  return ref
}