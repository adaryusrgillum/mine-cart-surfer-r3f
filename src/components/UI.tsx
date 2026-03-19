import { useGameStore } from '../store/gameStore'

export function UI() {
  const score = useGameStore((state) => state.score)
  const isGameOver = useGameStore((state) => state.isGameOver)
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }}>
      <div style={{ padding: '20px', fontSize: '24px', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        Score: {score}<br/>
        Coal: {useGameStore((state) => state.coal)}
      </div>
      
      {isGameOver && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '40px',
          borderRadius: '10px',
          textAlign: 'center',
          pointerEvents: 'auto'
        }}>
          <h1 style={{ color: '#ff4444', margin: '0 0 20px 0' }}>GAME OVER</h1>
          <button 
            style={{ padding: '10px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '5px' }}
            onClick={() => useGameStore.getState().startGame()}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  )
}
