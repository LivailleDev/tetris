// The seven tetrominoes. Shapes are square matrices so they can be rotated
// with a single generic transform.
// Neon / arcade palette — bright, saturated colors that glow against a dark board.
export const TETROMINOES = {
  I: { color: '#22e3ff', shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
  O: { color: '#ffe14d', shape: [[1, 1], [1, 1]] },
  T: { color: '#c86bff', shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
  S: { color: '#39ff9e', shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
  Z: { color: '#ff4d6d', shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
  J: { color: '#4d7cff', shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
  L: { color: '#ff9a3c', shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] },
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
