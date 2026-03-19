import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { TrackManager } from './components/TrackManager'
import { Player } from './components/Player'
import { GameLoop } from './components/GameLoop'
import { UI } from './components/UI'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 5, 8], fov: 60, rotation: [-0.2, 0, 0] }}>
        {/* Lighter mine atmosphere */}
        <color attach="background" args={['#1a1a1a']} />
        <fog attach="fog" args={['#1a1a1a', 15, 60]} />
        
        <ambientLight intensity={1.5} />
        <directionalLight 
          position={[5, 15, -10]} 
          intensity={0.8} 
        />
        <Suspense fallback={null}>
          <GameLoop />
          <TrackManager />
          <Player />
        </Suspense>
      </Canvas>
      <UI />
    </div>
  )
}
