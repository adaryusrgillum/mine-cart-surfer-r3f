import { LANE_WIDTH } from './TrackChunk'

export function Coal({ lane, positionZ }: { lane: number, positionZ: number }) {
  const laneX = lane * LANE_WIDTH
  return (
    <group position={[laneX, 0.4, positionZ]} userData={{ type: 'coal' }}>
      <mesh castShadow rotation={[Math.random(), Math.random(), Math.random()]}>
        <dodecahedronGeometry args={[0.3]} />
        <meshStandardMaterial color="#111" roughness={0.9} metalness={0.2} />
      </mesh>
    </group>
  )
}
