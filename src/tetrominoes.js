// The seven tetrominoes. Shapes are square matrices so they can be rotated
// with a single generic transform.
export const TETROMINOES = {
  I: { color: '#22d3ee', shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
  O: { color: '#facc15', shape: [[1, 1], [1, 1]] },
  T: { color: '#a855f7', shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
  S: { color: '#22c55e', shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
  Z: { color: '#ef4444', shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
  J: { color: '#3b82f6', shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
  L: { color: '#f97316', shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] },
};

const KEYS = Object.keys(TETROMINOES);

// Fresh, unrotated piece of a given type (deep-copied so rotations never mutate the template).
export function pieceFromType(type) {
  const { shape, color } = TETROMINOES[type];
  return { type, shape: shape.map((row) => row.slice()), color };
}

export function randomPiece() {
  return pieceFromType(KEYS[Math.floor(Math.random() * KEYS.length)]);
}
