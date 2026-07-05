import { randomPiece } from './tetrominoes.js';

export const COLS = 10;
export const ROWS = 20;

export const emptyBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));

// Rotate a square matrix 90° clockwise.
function rotateMatrix(m) {
  const n = m.length;
  const r = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      r[i][j] = m[n - 1 - j][i];
    }
  }
  return r;
}

// Does the shape at (px, py) hit a wall, the floor or a locked cell?
function collides(board, shape, px, py) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const x = px + c;
      const y = py + r;
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y >= 0 && board[y][x]) return true;
    }
  }
  return false;
}

export function mergePiece(board, piece) {
  const next = board.map((row) => row.slice());
  const { shape, x, y, color } = piece;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] && y + r >= 0) next[y + r][x + c] = color;
    }
  }
  return next;
}

function clearLines(board) {
  let cleared = 0;
  const kept = board.filter((row) => {
    const full = row.every(Boolean);
    if (full) cleared++;
    return !full;
  });
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(null));
  return { board: kept, cleared };
}

function spawn(piece) {
  return {
    shape: piece.shape,
    color: piece.color,
    x: Math.floor((COLS - piece.shape[0].length) / 2),
    y: 0,
  };
}

const LINE_SCORES = [0, 100, 300, 500, 800];

export function createInitialState() {
  return {
    board: emptyBoard(),
    piece: null,
    next: randomPiece(),
    score: 0,
    lines: 0,
    level: 1,
    status: 'idle',
  };
}

function startGame() {
  return {
    board: emptyBoard(),
    piece: spawn(randomPiece()),
    next: randomPiece(),
    score: 0,
    lines: 0,
    level: 1,
    status: 'playing',
  };
}

function lockPiece(state) {
  const merged = mergePiece(state.board, state.piece);
  const { board, cleared } = clearLines(merged);
  const lines = state.lines + cleared;
  const level = Math.floor(lines / 10) + 1;
  const score = state.score + LINE_SCORES[cleared] * state.level;
  const piece = spawn(state.next);
  const next = randomPiece();
  const status = collides(board, piece.shape, piece.x, piece.y) ? 'over' : 'playing';
  return { ...state, board, piece, next, score, lines, level, status };
}

// One downward step (gravity or soft drop). Locks the piece if it can't fall.
function step(state, soft) {
  const { board, piece } = state;
  if (!collides(board, piece.shape, piece.x, piece.y + 1)) {
    return { ...state, piece: { ...piece, y: piece.y + 1 }, score: soft ? state.score + 1 : state.score };
  }
  return lockPiece(state);
}

function move(state, dir) {
  const { board, piece } = state;
  if (collides(board, piece.shape, piece.x + dir, piece.y)) return state;
  return { ...state, piece: { ...piece, x: piece.x + dir } };
}

function rotate(state) {
  const rotated = rotateMatrix(state.piece.shape);
  // Simple wall kicks: try in place, then nudged left/right.
  for (const dx of [0, -1, 1, -2, 2]) {
    if (!collides(state.board, rotated, state.piece.x + dx, state.piece.y)) {
      return { ...state, piece: { ...state.piece, shape: rotated, x: state.piece.x + dx } };
    }
  }
  return state;
}

function hardDrop(state) {
  const { board, piece } = state;
  let y = piece.y;
  while (!collides(board, piece.shape, piece.x, y + 1)) y++;
  return lockPiece({ ...state, piece: { ...piece, y }, score: state.score + (y - piece.y) * 2 });
}

export function reducer(state, action) {
  switch (action.type) {
    case 'START':
    case 'RESET':
      return startGame();
    case 'TICK':
      return state.status === 'playing' ? step(state) : state;
    case 'SOFT_DROP':
      return state.status === 'playing' ? step(state, true) : state;
    case 'MOVE':
      return state.status === 'playing' ? move(state, action.dir) : state;
    case 'ROTATE':
      return state.status === 'playing' ? rotate(state) : state;
    case 'HARD_DROP':
      return state.status === 'playing' ? hardDrop(state) : state;
    case 'PAUSE':
      if (state.status === 'playing') return { ...state, status: 'paused' };
      if (state.status === 'paused') return { ...state, status: 'playing' };
      return state;
    default:
      return state;
  }
}
