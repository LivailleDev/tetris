import { COLS } from '../logic.js';

export default function Board({ board }) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
      {board.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`cell ${cell ? 'filled' : ''}`}
            style={cell ? { backgroundColor: cell } : undefined}
          />
        ))
      )}
    </div>
  );
}
