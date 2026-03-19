import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Box3, Object3D } from 'three'
import { LANE_WIDTH } from './TrackChunk'
import { useGameStore } from '../store/gameStore'

const JUMP_VELOCITY = 15
const GRAVITY = -40

export function Player() {
  const groupRef = useRef<Group>(null)
  const cartRef = useRef<Group>(null)
  
  const targetX = useRef(0)
  const currentLane = useRef(0) // -1, 0, 1
  
  const velocityY = useRef(0)
  const isJumping = useRef(false)
  const isDucking = useRef(false)
  const duckTimer = useRef(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        currentLane.current = Math.max(-1, currentLane.current - 1)
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        currentLane.current = Math.min(1, currentLane.current + 1)
      } else if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && !isJumping.current) {
        velocityY.current = JUMP_VELOCITY
        isJumping.current = true
        isDucking.current = false
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        if (isJumping.current) {
          velocityY.current = -JUMP_VELOCITY // fast fall
        } else {
          isDucking.current = true
          duckTimer.current = 0.8 // 0.8 seconds duck
        }
      }
      targetX.current = currentLane.current * LANE_WIDTH
    }
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current && cartRef.current) {
      // Smooth lane switching
      groupRef.current.position.x += (targetX.current - groupRef.current.position.x) * 15 * delta
      
      // Jump physics
      if (isJumping.current) {
        velocityY.current += GRAVITY * delta
        groupRef.current.position.y += velocityY.current * delta
        
        if (groupRef.current.position.y <= 0) {
          groupRef.current.position.y = 0
          velocityY.current = 0
          isJumping.current = false
        }
      }

      // Ducking logic
      if (isDucking.current) {
        duckTimer.current -= delta
        cartRef.current.scale.y = 0.5 // flatten
        cartRef.current.position.y = -0.25 // move down so bottom stays on track
        if (duckTimer.current <= 0) {
          isDucking.current = false
        }
      } else {
        cartRef.current.scale.y = 1
        cartRef.current.position.y = 0
      }

      // Collision detection
      const playerBox = new Box3().setFromObject(cartRef.current)
      const obsBox = new Box3()
      
      const { scene } = state
      let collided = false
      scene.traverse((child: Object3D) => {
        if (child.userData?.type === 'obstacle') {
          obsBox.setFromObject(child)
          // Make hitboxes slightly smaller to be forgiving
          obsBox.expandByScalar(-0.1)
          if (playerBox.intersectsBox(obsBox)) {
            collided = true
          }
        } else if (child.userData?.type === 'coal') {
          obsBox.setFromObject(child)
          if (playerBox.intersectsBox(obsBox)) {
            // Collect
            child.userData.type = 'collected'
            child.visible = false
            useGameStore.getState().collectCoal()
          }
        }
      })
      
      if (collided) {
        useGameStore.getState().endGame()
      }
    }
  })

  // To limit rendering cost, max 15 visual coals
  const coalCount = useGameStore((state) => state.coal)
  const visualCoals = Math.min(coalCount, 15)

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group ref={cartRef}>
        {/* Mine Cart Body */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 1, 2]} />
          <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.4} />
        </mesh>
        
        {/* Render collected coal inside cart */}
        {Array.from({ length: visualCoals }).map((_, i) => (
          <mesh key={i} position={[(i % 3 - 1) * 0.4, 1.15 + Math.floor(i / 3) * 0.3, (i % 2 - 0.5)]} castShadow rotation={[i, i, i]}>
             <dodecahedronGeometry args={[0.25]} />
             <meshStandardMaterial color="#111" roughness={0.9} metalness={0.2} />
          </mesh>
        ))}

        {/* Wheels */}
        {[-0.8, 0.8].map((z, i) => (
          <group key={i}>
            <mesh position={[-0.4, 0.2, z]} castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[0.4, 0.2, z]} castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          </group>
        ))}
      </group>
      {/* Headlamp */}
      <pointLight position={[0, 1.5, -1.5]} intensity={20} distance={40} color="#ffffee" castShadow />
    </group>
  )
}
