import { COLS } from '../logic.js';

export default function Board({ board, ghost, ghostColor }) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
      {board.map((row, y) =>
        row.map((cell, x) => {
          const isGhost = !cell && ghost?.has(`${y}-${x}`);
          let style;
          if (cell) style = { backgroundColor: cell };
          else if (isGhost) style = { boxShadow: `inset 0 0 0 2px ${ghostColor}`, opacity: 0.45 };
          return (
            <div
              key={`${y}-${x}`}
              className={`cell ${cell ? 'filled' : ''} ${isGhost ? 'ghost' : ''}`}
              style={style}
            />
          );
        })
      )}
    </div>
  );
}
