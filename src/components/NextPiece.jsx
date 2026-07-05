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
            style={cell ? { backgroundColor: piece.color } : undefined}
          />
        ))
      )}
    </div>
  );
}
