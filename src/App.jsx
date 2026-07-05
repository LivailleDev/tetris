import { useTetris } from './useTetris.js';
import Board from './components/Board.jsx';
import NextPiece from './components/NextPiece.jsx';

// Fire on pointer-down and prevent the control from taking focus (so Space/Enter
// keep controlling the game instead of re-triggering a focused button).
const press = (fn) => (e) => {
  e.preventDefault();
  fn();
};

const CLEAR_LABEL = ['', 'Single', 'Double', 'Triple', 'Tetris!'];

export default function App() {
  const {
    board, ghost, ghostColor, clearing, next, hold,
    score, best, lines, level, combo, lastClear,
    status, muted, toggleMute, actions,
  } = useTetris();

  const showOverlay = status === 'idle' || status === 'over' || status === 'paused';

  return (
    <div className="app">
      <h1>TETRIS</h1>
      <div className="game">
        <div className="board-col">
          <div className="board-wrap">
            <Board board={board} ghost={ghost} ghostColor={ghostColor} clearing={clearing} />

            {lastClear && status !== 'idle' && (
              <div key={lastClear.id} className="toast">
                <span className="toast-label">{CLEAR_LABEL[lastClear.lines]}</span>
                <span className="toast-points">+{lastClear.points}</span>
                {lastClear.combo > 1 && <span className="toast-combo">Combo ×{lastClear.combo}</span>}
              </div>
            )}

            {showOverlay && (
              <div className="overlay">
                {status === 'over' && <p className="over">Game Over</p>}
                {status === 'paused' && <p>Paused</p>}
                {status === 'idle' && <p>Ready?</p>}

                {status === 'paused' ? (
                  <button onClick={actions.pause}>Resume</button>
                ) : (
                  <div className="difficulty">
                    <span className="hint">{status === 'over' ? 'Play again' : 'Choose difficulty'}</span>
                    <button onClick={() => actions.start(1)}>Easy</button>
                    <button onClick={() => actions.start(5)}>Normal</button>
                    <button onClick={() => actions.start(9)}>Hard</button>
                  </div>
                )}
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
          <div className="stat">
            <span>Level</span>
            <strong>{level}{combo > 1 ? <em className="combo"> ×{combo}</em> : null}</strong>
          </div>

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

          <button className="mute" onClick={toggleMute}>
            {muted ? '🔇 Sound off' : '🔊 Sound on'}
          </button>
          {status === 'playing' && <button onClick={actions.pause}>Pause</button>}
        </aside>
      </div>
    </div>
  );
}
