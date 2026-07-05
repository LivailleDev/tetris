import { COLS } from '../logic.js';

export default function Board({ board, ghost, ghostColor }) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
      {board.map((row, y) =>
        row.map((cell, x) => {
          const isGhost = !cell && ghost?.has(`${y}-${x}`);
          let style;
          if (cell) {
            style = {
              backgroundColor: cell,
              boxShadow: `0 0 8px ${cell}, 0 0 2px ${cell}, inset 0 0 5px rgba(255, 255, 255, 0.45)`,
            };
          } else if (isGhost) {
            style = { boxShadow: `inset 0 0 0 2px ${ghostColor}, 0 0 6px ${ghostColor}`, opacity: 0.5 };
          }
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
