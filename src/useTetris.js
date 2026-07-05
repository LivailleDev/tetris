import { useEffect, useMemo, useReducer, useState } from 'react';
import { createInitialState, ghostFor, mergePiece, reducer } from './logic.js';

const MOVEMENT_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '];
const BEST_KEY = 'tetris-best';

function loadBest() {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(BEST_KEY) : null;
  return Number(raw) || 0;
}

export function useTetris() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [best, setBest] = useState(loadBest);

  // Gravity: faster as the level increases.
  const speed = Math.max(120, 800 - (state.level - 1) * 60);

  useEffect(() => {
    if (state.status !== 'playing') return undefined;
    const id = setInterval(() => dispatch({ type: 'TICK' }), speed);
    return () => clearInterval(id);
  }, [state.status, speed]);

  // Persist a new personal best when a game ends.
  useEffect(() => {
    if (state.status !== 'over') return;
    setBest((prev) => {
      const next = Math.max(prev, state.score);
      try {
        localStorage.setItem(BEST_KEY, String(next));
      } catch {
        /* ignore storage errors */
      }
      return next;
    });
  }, [state.status, state.score]);

  const actions = useMemo(
    () => ({
      left: () => dispatch({ type: 'MOVE', dir: -1 }),
      right: () => dispatch({ type: 'MOVE', dir: 1 }),
      rotate: () => dispatch({ type: 'ROTATE' }),
      softDrop: () => dispatch({ type: 'SOFT_DROP' }),
      hardDrop: () => dispatch({ type: 'HARD_DROP' }),
      hold: () => dispatch({ type: 'HOLD' }),
      start: () => dispatch({ type: 'START' }),
      pause: () => dispatch({ type: 'PAUSE' }),
    }),
    []
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' && (state.status === 'idle' || state.status === 'over')) {
        actions.start();
        return;
      }
      if (e.key === 'p' || e.key === 'P') {
        actions.pause();
        return;
      }
      if (state.status !== 'playing') return;

      switch (e.key) {
        case 'ArrowLeft': actions.left(); break;
        case 'ArrowRight': actions.right(); break;
        case 'ArrowDown': actions.softDrop(); break;
        case 'ArrowUp':
        case 'x':
        case 'X': actions.rotate(); break;
        case ' ': actions.hardDrop(); break;
        case 'c':
        case 'C':
        case 'Shift': actions.hold(); break;
        default: break;
      }
      if (MOVEMENT_KEYS.includes(e.key)) e.preventDefault();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.status, actions]);

  const board = state.piece ? mergePiece(state.board, state.piece) : state.board;
  const ghost = useMemo(() => {
    const cells = state.piece ? ghostFor(state.board, state.piece) : [];
    return new Set(cells.map(([x, y]) => `${y}-${x}`));
  }, [state.board, state.piece]);

  return {
    board,
    ghost,
    ghostColor: state.piece?.color,
    next: state.next,
    hold: state.hold,
    score: state.score,
    best,
    lines: state.lines,
    level: state.level,
    status: state.status,
    actions,
  };
}
