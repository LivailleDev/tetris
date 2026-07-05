import { useEffect, useReducer } from 'react';
import { createInitialState, mergePiece, reducer } from './logic.js';

const MOVEMENT_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '];

export function useTetris() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  // Gravity: faster as the level increases.
  const speed = Math.max(120, 800 - (state.level - 1) * 60);

  useEffect(() => {
    if (state.status !== 'playing') return undefined;
    const id = setInterval(() => dispatch({ type: 'TICK' }), speed);
    return () => clearInterval(id);
  }, [state.status, speed]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' && (state.status === 'idle' || state.status === 'over')) {
        dispatch({ type: 'START' });
        return;
      }
      if (e.key === 'p' || e.key === 'P') {
        dispatch({ type: 'PAUSE' });
        return;
      }
      if (state.status !== 'playing') return;

      switch (e.key) {
        case 'ArrowLeft':
          dispatch({ type: 'MOVE', dir: -1 });
          break;
        case 'ArrowRight':
          dispatch({ type: 'MOVE', dir: 1 });
          break;
        case 'ArrowDown':
          dispatch({ type: 'SOFT_DROP' });
          break;
        case 'ArrowUp':
        case 'x':
        case 'X':
          dispatch({ type: 'ROTATE' });
          break;
        case ' ':
          dispatch({ type: 'HARD_DROP' });
          break;
        default:
          break;
      }
      if (MOVEMENT_KEYS.includes(e.key)) e.preventDefault();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.status]);

  const board = state.piece ? mergePiece(state.board, state.piece) : state.board;

  return {
    board,
    next: state.next,
    score: state.score,
    lines: state.lines,
    level: state.level,
    status: state.status,
    start: () => dispatch({ type: 'START' }),
    pause: () => dispatch({ type: 'PAUSE' }),
  };
}
