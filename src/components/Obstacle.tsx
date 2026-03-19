import { LANE_WIDTH } from './TrackChunk'

interface ObstacleProps {
  type: 'dynamite' | 'beam'
  lane?: number // -1, 0, 1
  positionZ: number
}

export function Obstacle({ type, lane = 0, positionZ }: ObstacleProps) {
  const laneX = lane * LANE_WIDTH

  if (type === 'dynamite') {
    return (
      <group position={[laneX, 0, positionZ]} userData={{ type: 'obstacle', subtype: 'dynamite' }}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
          <meshStandardMaterial color="#b22222" />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* Fire spark */}
        <pointLight position={[0, 1.2, 0]} intensity={2} color="#ffaa00" distance={2} />
      </group>
    )
  }

  if (type === 'beam') {
    return (
      <group position={[0, 0, positionZ]} userData={{ type: 'obstacle' }}>
        {/* Support pillars */}
        <mesh position={[-3.5, 1, 0]} castShadow>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial color="#3a2008" />
        </mesh>
        <mesh position={[3.5, 1, 0]} castShadow>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial color="#3a2008" />
        </mesh>
        {/* Top beam for ducking */}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[8, 0.5, 0.5]} />
          <meshStandardMaterial color="#3a2008" />
        </mesh>
      </group>
    )
  }

  return null
}
