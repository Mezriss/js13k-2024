import { maxR } from "./const.js";
/**
 * @returns {null}
 * @param {State} state
 * @param {Element[]} level
 */
export function checkCollisions(state, level) {
  let collision = null;
  let i = 0;
  while (i < level.length && state.y + 0.25 > level[i].y - maxR) {
    if (dirtyCheck(state.y, state.r, level[i].y, level[i].r)) {
      if (level[i].s === "sphere" && distanceCheck(state, level[i])) {
        collision = level[i];
        break;
      }
    }
    i += 1;
  }
  //cleanup
  while (level.length && level[0].y + level[0].r < state.y - state.r) {
    level.shift();
  }
  return collision;
}

export function dirtyCheck(y1, r1, y2, r2) {
  return y1 - r1 < y2 + r2 && y1 + r1 > y2 - r2;
}

function distanceCheck({ x: x1, y: y1, z: z1, r: r1 }, { x: x2, y: y2, z: z2, r: r2 }) {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
  return distance <= r1 + r2;
}

function spherePyramidCollision(sx, sy, sz, sr, px, py, pz, pr, ph) {
  // Check if sphere is below or above the pyramid
  if (sz < pz || sz > pz + ph) {
    return distanceCheck(sx, sy, sz, sr, px, py, pz, pr);
  }

  // Calculate the pyramid's radius at the sphere's z-level
  const pyramidRatioAtSphereZ = (pz + ph - sz) / ph;
  const pyramidRadiusAtSphereZ = pr * pyramidRatioAtSphereZ;

  // Check collision in XY plane
  const xyDistance = Math.sqrt((sx - px) ** 2 + (sy - py) ** 2);

  if (xyDistance > pyramidRadiusAtSphereZ + sr) {
    return false;
  }

  // If we've reached here, there's a collision
  return true;
}
