import { TrackChunk, CHUNK_LENGTH } from './TrackChunk'
import { useGameStore } from '../store/gameStore'
import { useRef } from 'react'
import { Group } from 'three'
import { useFrame } from '@react-three/fiber'

const VISIBLE_CHUNKS = 12

export function TrackManager() {
  const groupRef = useRef<Group>(null)
  const pitchRef = useRef<Group>(null)
  
  // We don't read distance from store reactively to avoid re-renders on every frame.
  // We just access it in useFrame. However, to spawn chunks, we need a coarse value.
  // A better approach is to keep chunk spawning inside useFrame or just rely on a local coarse distance state if we strictly want React to manage the array.
  // Actually, R3F's useFrame allows us to move the track smoothly.
  
  useFrame(() => {
    if (groupRef.current) {
      const dist = useGameStore.getState().distance
      groupRef.current.position.z = dist
    }
    if (pitchRef.current) {
      const dist = useGameStore.getState().distance
      // Create a smooth rolling hill effect (downhill and uphill)
      pitchRef.current.rotation.x = Math.sin(dist / 150) * 0.15
    }
  })

  // To avoid re-rendering the chunks array every frame, we will render a fixed number of chunks
  // and in TrackManager we can use object pooling, or just keep it simple and update which chunks 
  // are rendered when distance passes CHUNK_LENGTH.
  // For simplicity, let's use a dynamic array driven by coarse state.
  // Actually, since React re-rendering per chunk crossing is okay (once every ~2 seconds).
  
  const distance = useGameStore((state) => state.distance)
  const currentChunkIndex = Math.floor(distance / CHUNK_LENGTH)
  
  const chunks = []
  for (let i = currentChunkIndex - 2; i < currentChunkIndex + VISIBLE_CHUNKS; i++) {
    chunks.push(<TrackChunk key={i} positionZ={-i * CHUNK_LENGTH} index={i} />)
  }

  return (
    <group ref={pitchRef} position={[0, 0, 0]}>
      <group ref={groupRef}>
        {chunks}
      </group>
    </group>
  )
}
