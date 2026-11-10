import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Html } from '@react-three/drei'
import { SonaOne } from '../models/SonaOne'
import { Glow } from '../effects/Glow'
import { scrollState } from '../../lib/scrollState'
import { useApp } from '../../store/app'
import { LOOKS } from '../../store/configurator'

/* Product bounds in scene units, and what they measure in the real (fictional) product. */
const BOTTOM = -1.176
const TOP = 1.158
const WIDTH = 2.294 // front view, cap to cap
const DEPTH = 1.03 // side view
const MM = { height: 188, width: 185, depth: 83 }

const lineMat = new THREE.MeshBasicMaterial({ color: '#f2efe9', transparent: true, opacity: 0.55, toneMapped: false })

/** Technical-drawing view: the product square-on with animated dimension lines. */
export function SpecsScene() {
  const view = useApp((s) => s.specsView)
  const reduced = useApp((s) => s.reducedMotion)
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const product = useRef<THREE.Group>(null)
  const dims = useRef<THREE.Group>(null)
  const vLine = useRef<THREE.Group>(null)
  const hLine = useRef<THREE.Group>(null)
  const hLabel = useRef<HTMLDivElement>(null)
  const state = useMemo(() => ({ w: WIDTH, rot: 0, show: 1 }), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])

  useLayoutEffect(() => {
    camera.position.set(0, 0.1, 8)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useFrame((clock, dt) => {
    const targetW = view === 'side' ? DEPTH : WIDTH
    const targetShow = view === 'spin' ? 0 : 1
    state.w = THREE.MathUtils.damp(state.w, targetW, 5, dt)
    state.show = THREE.MathUtils.damp(state.show, targetShow, 6, dt)
    if (view === 'spin') state.rot += dt * 0.4
    else {
      const target = view === 'side' ? -Math.PI / 2 : 0
      // take the short way round after spinning
      const wrapped = target + Math.round((state.rot - target) / (Math.PI * 2)) * Math.PI * 2
      state.rot = THREE.MathUtils.damp(state.rot, wrapped, 4, dt)
    }
    if (product.current) {
      product.current.rotation.y = state.rot
      product.current.position.y = (reduced ? 0 : Math.sin(clock.clock.elapsedTime * 0.8) * 0.02) - 0.5
    }

    const x = state.w / 2 + 0.45 // height line sits on the right, clear of the headline
    if (vLine.current) vLine.current.position.x = x
    if (hLine.current) hLine.current.scale.x = state.w
    if (dims.current) {
      dims.current.visible = state.show > 0.02
      lineMat.opacity = 0.55 * state.show
    }
    if (hLabel.current) {
      hLabel.current.textContent = view === 'side' ? `Depth ${MM.depth} mm` : `Width ${MM.width} mm`
      hLabel.current.parentElement!.style.opacity = String(state.show)
    }

    const aspect = size.width / size.height
    const dist = aspect < 1 ? 7.4 / aspect : 8
    tmp.set(scrollState.pointer.x * 0.25, 0.1 + scrollState.pointer.y * 0.15, dist)
    camera.position.lerp(tmp, 1 - Math.exp(-dt * 3))
    camera.lookAt(0, -0.1, 0)
  })

  const H = TOP - BOTTOM
  return (
    <>
      <color attach="background" args={['#0b0b0c']} />
      <Glow color="#ffb454" intensity={0.12} position={[0, 0.2, -5]} scale={13} />
      {/* faint blueprint grid behind the product */}
      <gridHelper args={[14, 28, '#2a2a2e', '#18181b']} rotation-x={Math.PI / 2} position-z={-2.5} />

      <group ref={product}>
        <SonaOne config={LOOKS.arctic.config} />
      </group>

      <group ref={dims}>
        {/* height, on the right */}
        <group ref={vLine}>
          <mesh material={lineMat} position-y={(TOP + BOTTOM) / 2} scale={[0.008, H, 0.008]}>
            <boxGeometry />
          </mesh>
          {[TOP, BOTTOM].map((y) => (
            <mesh key={y} material={lineMat} position-y={y} scale={[0.16, 0.008, 0.008]}>
              <boxGeometry />
            </mesh>
          ))}
          <Html position={[0.14, (TOP + BOTTOM) / 2, 0]} center style={{ pointerEvents: 'none' }}>
            <div className="eyebrow whitespace-nowrap text-paper/80" style={{ transform: 'rotate(90deg)' }}>
              Height {MM.height} mm
            </div>
          </Html>
        </group>
        {/* width / depth, underneath */}
        <group position-y={BOTTOM - 0.3}>
          <group ref={hLine}>
            <mesh material={lineMat} scale={[1, 0.008, 0.008]}>
              <boxGeometry />
            </mesh>
            {[-0.5, 0.5].map((x) => (
              <mesh key={x} material={lineMat} position-x={x} scale={[0.008 / 1, 0.16, 0.008]}>
                <boxGeometry />
              </mesh>
            ))}
          </group>
          <Html position={[0, -0.16, 0]} center style={{ pointerEvents: 'none' }}>
            <div className="eyebrow whitespace-nowrap text-paper/80">
              <span ref={hLabel}>Width {MM.width} mm</span>
            </div>
          </Html>
        </group>
      </group>

      <ContactShadows position-y={BOTTOM - 0.02} opacity={0.6} scale={6} blur={2.4} far={2} resolution={256} />
    </>
  )
}
