export default function NextPiece({ piece }) {
  if (!piece) return null;
  return (
    <div
      className="next-grid"
      style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)` }}
    >
      {piece.shape.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className="next-cell"
            style={
              cell
                ? {
                    backgroundColor: piece.color,
                    boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.55), inset -2px -2px 0 rgba(0, 0, 0, 0.28)`,
                  }
                : undefined
            }
          />
        ))
      )}
    </div>
  );
}
