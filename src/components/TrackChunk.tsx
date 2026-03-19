import { Obstacle } from './Obstacle'
import { Coal } from './Coal'

export const CHUNK_LENGTH = 50
export const LANE_WIDTH = 2.5

interface TrackChunkProps {
  positionZ: number
  index: number
}

// Pseudo-random generator based on seed (index)
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function TrackChunk({ positionZ, index }: TrackChunkProps) {
  const random = mulberry32(index * 1234)
  
  // Decide obstacles
  // Increased obstacle density: 2 to 4 per chunk
  const numObstacles = index <= 2 ? 0 : Math.floor(random() * 3) + 2 
  const obstacles = []
  
  for (let i=0; i<numObstacles; i++) {
    const isBeam = random() > 0.6 // Slightly more beams
    const lane = Math.floor(random() * 3) - 1 // -1, 0, 1
    const zOffset = (random() - 0.5) * (CHUNK_LENGTH - 10) 
    
    obstacles.push(
      <Obstacle key={`obs-${i}`} type={isBeam ? 'beam' : 'dynamite'} lane={lane} positionZ={zOffset} />
    )
  }

  // Generate Coal
  const numCoal = index <= 1 ? 0 : Math.floor(random() * 6) + 3 // 3-8 coals
  const coals = []
  for (let i=0; i<numCoal; i++) {
    const lane = Math.floor(random() * 3) - 1
    const zOffset = (random() - 0.5) * (CHUNK_LENGTH - 5)
    coals.push(
      <Coal key={`coal-${i}`} lane={lane} positionZ={zOffset} />
    )
  }

  return (
    <group position={[0, 0, positionZ]}>
      {/* Ground/Floor */}
      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, CHUNK_LENGTH]} />
        <meshStandardMaterial color="#2d1b11" roughness={1.0} />
      </mesh>
      
      {/* 3 Rails */}
      {[-1, 0, 1].map((lane, i) => (
        <group key={`rail-${i}`} position={[lane * LANE_WIDTH, 0.05, 0]}>
          <mesh position={[-0.4, 0, 0]} receiveShadow>
            <boxGeometry args={[0.1, 0.1, CHUNK_LENGTH]} />
            <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.4, 0, 0]} receiveShadow>
            <boxGeometry args={[0.1, 0.1, CHUNK_LENGTH]} />
            <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Wooden ties */}
          {Array.from({ length: 25 }).map((_, j) => (
            <mesh key={`tie-${i}-${j}`} position={[0, -0.02, -CHUNK_LENGTH/2 + j * 2 + 1]} receiveShadow>
              <boxGeometry args={[1.2, 0.05, 0.4]} />
              <meshStandardMaterial color="#3a2008" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Side Walls (Mine Cave) */}
      <mesh position={[-7.5, 5, 0]} receiveShadow>
        <boxGeometry args={[1, 10, CHUNK_LENGTH]} />
        <meshStandardMaterial color="#1f1a17" roughness={0.9} />
      </mesh>
      <mesh position={[7.5, 5, 0]} receiveShadow>
        <boxGeometry args={[1, 10, CHUNK_LENGTH]} />
        <meshStandardMaterial color="#1f1a17" roughness={0.9} />
      </mesh>
      
      {/* Wall Torches */}
      {index % 2 === 0 && (
        <group position={[-6.5, 4, 0]}>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.15, 0.1, 1.5]} />
            <meshStandardMaterial color="#4a2e15" />
          </mesh>
          <mesh position={[0.5, 0.5, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshBasicMaterial color="#ff5500" />
          </mesh>
          <pointLight position={[0.5, 0.5, 0]} intensity={6} distance={25} color="#ffaa55" castShadow />
        </group>
      )}
      {index % 2 === 1 && (
        <group position={[6.5, 4, 0]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.15, 0.1, 1.5]} />
            <meshStandardMaterial color="#4a2e15" />
          </mesh>
          <mesh position={[-0.5, 0.5, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshBasicMaterial color="#ff5500" />
          </mesh>
          <pointLight position={[-0.5, 0.5, 0]} intensity={6} distance={25} color="#ffaa55" castShadow />
        </group>
      )}
      
      {obstacles}
      {coals}
    </group>
  )
}
