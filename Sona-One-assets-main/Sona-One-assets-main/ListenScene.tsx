import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { SonaOne } from '../models/SonaOne'
import { AudioRing, type RingDriver } from '../effects/AudioRing'
import { Glow } from '../effects/Glow'
import { scrollState } from '../../lib/scrollState'
import { useApp } from '../../store/app'
import { LOOKS } from '../../store/configurator'

/** How ordered the particle field looks in each mode: noise is chaos, ANC is a clean ring. */
const CALM = { off: 0.08, transparency: 0.45, anc: 1 } as const

export function ListenScene() {
  const mode = useApp((s) => s.listenMode)
  const tier = useApp((s) => s.tier)
  const reduced = useApp((s) => s.reducedMotion)
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const product = useRef<THREE.Group>(null)
  const driver = useMemo<RingDriver>(() => ({ calm: CALM.off, opacity: 1 }), [])
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), t: new THREE.Vector3(), look: new THREE.Vector3() }), [])

  useLayoutEffect(() => {
    camera.position.set(-1.6, 0.2, 10)
  }, [camera])

  useFrame((state, dt) => {
    driver.calm = THREE.MathUtils.damp(driver.calm, CALM[mode], 2.5, dt)
    const aspect = size.width / size.height
    const side = aspect > 1.1 ? -1.6 : 0
    const dist = aspect < 1 ? 8.4 / aspect : 9.4
    tmp.t.set(side, aspect < 1 ? -0.9 : 0, 0)
    tmp.p.set(side + scrollState.pointer.x * 0.3, 0.2 + scrollState.pointer.y * 0.2, dist)
    const k = 1 - Math.exp(-dt * 3)
    camera.position.lerp(tmp.p, k)
    tmp.look.lerp(tmp.t, k)
    camera.lookAt(tmp.look)
    if (product.current && !reduced) {
      product.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.25
      product.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.03
    }
  })

  return (
    <>
      <color attach="background" args={['#070708']} />
      <Glow color="#ff9a3c" intensity={0.18} position={[0, 0, -5]} scale={14} />
      <Glow color="#5b7bd6" intensity={0.1} position={[4, 2, -6]} scale={12} />
      <SonaOne ref={product} config={LOOKS.midnight.config} shadows={false} />
      <group position-z={-0.6}>
        <AudioRing count={tier === 'high' ? 22000 : tier === 'mid' ? 12000 : 6000} driver={driver} />
      </group>
    </>
  )
}
