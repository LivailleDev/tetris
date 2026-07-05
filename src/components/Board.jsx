import { COLS } from '../logic.js';

export default function Board({ board, ghost, ghostColor }) {
  return (
    <div className="board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
      {board.map((row, y) =>
        row.map((cell, x) => {
          const isGhost = !cell && ghost?.has(`${y}-${x}`);
          let style;
          if (cell) {
            // Crisp block: solid fill, sharp bright inner edge and a dark bevel,
            // plus a subtle outer neon halo (no blurry inner glow).
            style = {
              backgroundColor: cell,
              boxShadow: `inset 0 0 0 1.5px rgba(255, 255, 255, 0.6), inset -3px -3px 0 rgba(0, 0, 0, 0.28), 0 0 5px ${cell}`,
            };
          } else if (isGhost) {
            style = { boxShadow: `inset 0 0 0 2px ${ghostColor}`, opacity: 0.5 };
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
