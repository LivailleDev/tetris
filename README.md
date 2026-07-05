# React Tetris

[![Live Demo](https://img.shields.io/badge/Live%20Demo-play%20now-brightgreen)](https://playful-paletas-67a55e.netlify.app)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5-646CFF)

A classic Tetris built with **React 18** and **vanilla JavaScript** — no game engine or
external game libraries. All the game logic (collision, rotation, line clears, scoring)
lives in a single `useReducer`, which keeps it predictable and easy to follow.

**🎮 Play it live:** https://playful-paletas-67a55e.netlify.app

![React Tetris](docs/screenshot.png)

## Features

- 10×20 board with all **7 tetrominoes**, each with rotation (+ simple wall kicks)
- **Ghost piece** showing where the current piece will land
- **Hold** a piece for later (once per drop)
- **Difficulty levels** (Easy / Normal / Hard) — different starting speed
- **Gravity** that speeds up as the level rises
- **Line-clear animation** (flash + collapse)
- **Combo** scoring with floating "+points" popups
- **Sound effects** synthesized with the Web Audio API (no assets) + mute toggle
- **High score** persisted in `localStorage`
- On-screen **touch controls** for mobile
- Pause, game over, and restart — fully client-side (no backend)

## Controls

| Key | Action |
|-----|--------|
| ← → | Move |
| ↑ / X | Rotate |
| ↓ | Soft drop |
| Space | Hard drop |
| C / Shift | Hold |
| P | Pause |
| Enter | Start / restart |

On touch devices, use the on-screen buttons below the board.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5174
```

Build for production:

```bash
npm run build
```

## Tech & structure

React 18 · Vite · plain CSS.

```
src/
├── App.jsx            # layout + overlay
├── tetrominoes.js     # the 7 pieces and their colors
├── logic.js           # useReducer game logic (pure functions)
├── useTetris.js       # gravity loop + keyboard handling
└── components/        # Board, NextPiece
```
