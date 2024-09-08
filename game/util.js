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
