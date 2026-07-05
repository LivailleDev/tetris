// Tiny retro sound effects synthesized with the Web Audio API — no audio files.
let ctx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

function audio() {
  if (muted) return null;
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// A single short tone.
function tone(ac, freq, start, dur, type = 'square', gain = 0.05) {
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(g);
  g.connect(ac.destination);
  const t = ac.currentTime + start;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.start(t);
  osc.stop(t + dur);
}

export const sound = {
  move() {
    const ac = audio();
    if (ac) tone(ac, 160, 0, 0.03, 'square', 0.02);
  },
  rotate() {
    const ac = audio();
    if (ac) tone(ac, 330, 0, 0.05, 'square', 0.03);
  },
  drop() {
    const ac = audio();
    if (ac) tone(ac, 110, 0, 0.08, 'square', 0.045);
  },
  hold() {
    const ac = audio();
    if (ac) tone(ac, 420, 0, 0.05, 'triangle', 0.03);
  },
  clear(lines) {
    const ac = audio();
    if (!ac) return;
    const base = [0, 440, 554, 659, 880][lines] || 440;
    [0, 1, 2].forEach((i) => tone(ac, base * (1 + i * 0.25), i * 0.06, 0.12, 'square', 0.05));
  },
  gameOver() {
    const ac = audio();
    if (!ac) return;
    [440, 330, 220].forEach((f, i) => tone(ac, f, i * 0.13, 0.16, 'sawtooth', 0.05));
  },
};
