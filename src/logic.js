import { randomPiece, pieceFromType, TETROMINOES } from './tetrominoes.js';

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

// Cells (as [x, y]) where the current piece would land if hard-dropped.
export function ghostFor(board, piece) {
  if (!piece) return [];
  let y = piece.y;
  while (!collides(board, piece.shape, piece.x, y + 1)) y++;
  const cells = [];
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) cells.push([piece.x + c, y + r]);
    }
  }
  return cells;
}

function fullRows(board) {
  const rows = [];
  board.forEach((row, y) => {
    if (row.every(Boolean)) rows.push(y);
  });
  return rows;
}

function spawn(piece) {
  return {
    type: piece.type,
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
    hold: null,
    canHold: true,
    clearing: null,
    combo: 0,
    lastClear: null,
    startLevel: 1,
    score: 0,
    lines: 0,
    level: 1,
    status: 'idle',
  };
}

function startGame(startLevel = 1) {
  return {
    board: emptyBoard(),
    piece: spawn(randomPiece()),
    next: randomPiece(),
    hold: null,
    canHold: true,
    clearing: null,
    combo: 0,
    lastClear: null,
    startLevel,
    score: 0,
    lines: 0,
    level: startLevel,
    status: 'playing',
  };
}

function lockPiece(state) {
  const merged = mergePiece(state.board, state.piece);
  const rows = fullRows(merged);
  if (rows.length > 0) {
    // Keep the full rows visible and pause while the clear animation plays;
    // finishClear() actually removes them and spawns the next piece.
    return { ...state, board: merged, piece: null, clearing: rows, status: 'clearing' };
  }
  const piece = spawn(state.next);
  const next = randomPiece();
  const status = collides(merged, piece.shape, piece.x, piece.y) ? 'over' : 'playing';
  // A lock that clears nothing breaks the combo chain.
  return { ...state, board: merged, piece, next, status, canHold: true, combo: 0 };
}

function finishClear(state) {
  const rows = new Set(state.clearing);
  const cleared = rows.size;
  const kept = state.board.filter((_, y) => !rows.has(y));
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(null));

  const lines = state.lines + cleared;
  const level = state.startLevel + Math.floor(lines / 10);
  const combo = state.combo + 1;
  const base = LINE_SCORES[cleared] * state.level;
  const comboBonus = (combo - 1) * 50 * state.level;
  const points = base + comboBonus;
  const score = state.score + points;
  const lastClear = { id: (state.lastClear?.id || 0) + 1, lines: cleared, points, combo };

  const piece = spawn(state.next);
  const next = randomPiece();
  const status = collides(kept, piece.shape, piece.x, piece.y) ? 'over' : 'playing';
  return {
    ...state,
    board: kept,
    piece,
    next,
    score,
    lines,
    level,
    combo,
    lastClear,
    clearing: null,
    status,
    canHold: true,
  };
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

// Store or swap the held piece (once per drop).
function hold(state) {
  if (!state.canHold) return state;
  const stored = { type: state.piece.type, color: state.piece.color, shape: pieceFromType(state.piece.type).shape };
  const incoming = state.hold ? pieceFromType(state.hold.type) : state.next;
  const piece = spawn(incoming);
  const next = state.hold ? state.next : randomPiece();
  const status = collides(state.board, piece.shape, piece.x, piece.y) ? 'over' : 'playing';
  return { ...state, piece, next, hold: stored, canHold: false, status };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'START':
    case 'RESET':
      return startGame(action.level || 1);
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
    case 'FINISH_CLEAR':
      return state.status === 'clearing' ? finishClear(state) : state;
    case 'HOLD':
      return state.status === 'playing' ? hold(state) : state;
    case 'PAUSE':
      if (state.status === 'playing') return { ...state, status: 'paused' };
      if (state.status === 'paused') return { ...state, status: 'playing' };
      return state;
    default:
      return state;
  }
}
