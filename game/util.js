import { localStorageKey } from "./const.js";

export function gradient(colorA, colorB, vertical = 1, line = 0, debug = 0) {
  // Create a new canvas element
  const c = document.createElement("canvas");
  const n = 300;
  c.width = c.height = n;
  c.id = self.crypto.randomUUID();

  // Get the 2D rendering context
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, vertical ? 0 : n, vertical && n);

  if (line) {
    g.addColorStop(0, colorA);
    g.addColorStop(0.5 - line / 2, colorA);
    g.addColorStop(0.5 - line / 2, colorB);
    g.addColorStop(0.5 + line / 2, colorB);
    g.addColorStop(0.5 + line / 2, colorA);
    g.addColorStop(1, colorA);
  } else {
    g.addColorStop(0, colorA);
    g.addColorStop(1, colorB);
  }

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, n, n);
  if (debug) {
    document.body.appendChild(c);
    c.style.position = "fixed";
    c.style.top = "0";
    c.style.left = "0";
    c.style.zIndex = 100;
  }
  return c;
}

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

let incrId = 0;
export const iid = (str) => str[0] + incrId++;

export const load = () => JSON.parse(localStorage.getItem(localStorageKey) || `""`) || { score: [] };
export const save = (data) => {
  localStorage.setItem(localStorageKey, JSON.stringify(data));
};

export const dampen = (prev, next, factor) => (1 - factor) * prev + factor * next;

// https://stackoverflow.com/a/12646864
export function shuffle(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const easeOutCirc = (x) => {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
};
