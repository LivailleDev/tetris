import { useTetris } from './useTetris.js';
import Board from './components/Board.jsx';
import NextPiece from './components/NextPiece.jsx';

// Fire on pointer-down and prevent the control from taking focus (so Space/Enter
// keep controlling the game instead of re-triggering a focused button).
const press = (fn) => (e) => {
  e.preventDefault();
  fn();
};

export default function App() {
  const { board, ghost, ghostColor, next, hold, score, best, lines, level, status, actions } =
    useTetris();
  const showOverlay = status === 'idle' || status === 'over' || status === 'paused';

  return (
    <div className="app">
      <h1>TETRIS</h1>
      <div className="game">
        <div className="board-col">
          <div className="board-wrap">
            <Board board={board} ghost={ghost} ghostColor={ghostColor} />
            {showOverlay && (
              <div className="overlay">
                {status === 'over' && <p className="over">Game Over</p>}
                {status === 'paused' && <p>Paused</p>}
                {status === 'idle' && <p>Ready?</p>}
                <button onClick={status === 'paused' ? actions.pause : actions.start}>
                  {status === 'over' ? 'Play again' : status === 'paused' ? 'Resume' : 'Start'}
                </button>
              </div>
            )}
          </div>

          <div className="touch">
            <button onPointerDown={press(actions.left)} aria-label="Move left">◀</button>
            <button onPointerDown={press(actions.rotate)} aria-label="Rotate">⟳</button>
            <button onPointerDown={press(actions.right)} aria-label="Move right">▶</button>
            <button onPointerDown={press(actions.hold)} aria-label="Hold">Hold</button>
            <button onPointerDown={press(actions.softDrop)} aria-label="Soft drop">▼</button>
            <button onPointerDown={press(actions.hardDrop)} aria-label="Hard drop">⤓</button>
          </div>
        </div>

        <aside className="panel">
          <div className="stat"><span>Score</span><strong>{score}</strong></div>
          <div className="stat"><span>Best</span><strong>{best}</strong></div>
          <div className="stat"><span>Lines</span><strong>{lines}</strong></div>
          <div className="stat"><span>Level</span><strong>{level}</strong></div>

          <div className="pieces">
            <div className="piece-box">
              <span>Hold</span>
              <NextPiece piece={hold} />
            </div>
            <div className="piece-box">
              <span>Next</span>
              <NextPiece piece={next} />
            </div>
          </div>

          <div className="controls">
            <p>← → &nbsp;move</p>
            <p>↑ / X &nbsp;rotate</p>
            <p>↓ &nbsp;soft drop</p>
            <p>Space &nbsp;hard drop</p>
            <p>C &nbsp;hold &nbsp;·&nbsp; P &nbsp;pause</p>
          </div>

          {status === 'playing' && <button onClick={actions.pause}>Pause</button>}
        </aside>
      </div>
    </div>
  );
}
