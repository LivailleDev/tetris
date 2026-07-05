import { useTetris } from './useTetris.js';
import Board from './components/Board.jsx';
import NextPiece from './components/NextPiece.jsx';

export default function App() {
  const { board, next, score, lines, level, status, start, pause } = useTetris();
  const showOverlay = status === 'idle' || status === 'over' || status === 'paused';

  return (
    <div className="app">
      <h1>TETRIS</h1>
      <div className="game">
        <div className="board-wrap">
          <Board board={board} />
          {showOverlay && (
            <div className="overlay">
              {status === 'over' && <p className="over">Game Over</p>}
              {status === 'paused' && <p>Paused</p>}
              {status === 'idle' && <p>Ready?</p>}
              <button onClick={status === 'paused' ? pause : start}>
                {status === 'over' ? 'Play again' : status === 'paused' ? 'Resume' : 'Start'}
              </button>
            </div>
          )}
        </div>

        <aside className="panel">
          <div className="stat"><span>Score</span><strong>{score}</strong></div>
          <div className="stat"><span>Lines</span><strong>{lines}</strong></div>
          <div className="stat"><span>Level</span><strong>{level}</strong></div>

          <div className="next">
            <span>Next</span>
            <NextPiece piece={next} />
          </div>

          <div className="controls">
            <p>← → &nbsp;move</p>
            <p>↑ / X &nbsp;rotate</p>
            <p>↓ &nbsp;soft drop</p>
            <p>Space &nbsp;hard drop</p>
            <p>P &nbsp;pause</p>
          </div>

          {status === 'playing' && <button onClick={pause}>Pause</button>}
        </aside>
      </div>
    </div>
  );
}
