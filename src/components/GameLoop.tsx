import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'
import { useEffect } from 'react'

export function GameLoop() {
  const increaseDistance = useGameStore((state) => state.increaseDistance)
  
  useEffect(() => {
    useGameStore.getState().startGame()
  }, [])

  useFrame((_, delta) => {
    // Cap delta to prevent huge jumps if tab is inactive
    const dt = Math.min(delta, 0.1)
    increaseDistance(dt)
  })

  return null
}
