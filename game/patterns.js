const diamond = ([cx, cy], groupAmount, prng) => {
  const w = prng.r(2, 3);
  const h = prng.r(3, 5);
  return [
    [cx, cy - 3, w, h],
    [cx - 3, cy, w, h],
    [cx + 3, cy, w, h],
    [cx, cy + 3, w, h],
  ].slice(0, groupAmount);
};

const cluster = ([cx, cy], groupAmount, prng) => {
  return Array.from({ length: groupAmount }, (_, i) => {
    return [cx + prng.r(-1, 1), cy + prng.r(-1, 1), prng.r(3, 4), prng.r(4, 5)];
  });
};

const diagonal = ([cx, cy], groupAmount, prng) => {
  const direction = prng.n(1);
  return Array.from({ length: groupAmount }, (_, i) => {
    const w = prng.r(2, 3);
    return [cx + i * (direction ? 2 : -2), cy + i * w, w, 3 + i * 0.5];
  });
};

export const patterns = [cluster, diagonal, diamond];
