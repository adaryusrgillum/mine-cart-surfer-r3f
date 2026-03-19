import { create } from 'zustand'

interface GameState {
  speed: number
  distance: number
  score: number
  coal: number
  isGameOver: boolean
  isStarted: boolean
  startGame: () => void
  endGame: () => void
  increaseDistance: (dt: number) => void
  collectCoal: () => void
  reset: () => void
}

const INITIAL_SPEED = 20

export const useGameStore = create<GameState>((set) => ({
  speed: INITIAL_SPEED,
  distance: 0,
  score: 0,
  coal: 0,
  isGameOver: false,
  isStarted: false,
  startGame: () => set({ isStarted: true, isGameOver: false, distance: 0, score: 0, coal: 0, speed: INITIAL_SPEED }),
  endGame: () => set({ isGameOver: true }),
  collectCoal: () => set((state) => ({ coal: state.coal + 1 })),
  increaseDistance: (dt) => set((state) => {
    if (state.isGameOver || !state.isStarted) return state
    const move = state.speed * dt
    const newDistance = state.distance + move
    // Increase speed slightly over time
    const newSpeed = INITIAL_SPEED + Math.floor(newDistance / 1000) * 2
    return { 
      distance: newDistance, 
      score: Math.floor(newDistance),
      speed: Math.min(newSpeed, 100)
    }
  }),
  reset: () => set({ isGameOver: false, isStarted: false, distance: 0, score: 0, coal: 0, speed: INITIAL_SPEED })
}))
