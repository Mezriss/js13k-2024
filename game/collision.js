import { baseZ, maxR } from "./const.js";

/**
 * @returns {null}
 * @param {State} state
 * @param {Entity[]} level
 */
export function checkCollisions(state, level) {
  let collision = null;
  let i = 0;
  while (i < level.length && state.y + 0.25 > level[i].y - maxR) {
    if (
      {
        sphere: () => checkDistance(state, level[i]) <= state.r + level[i].r,
        pyramid: () => checkPyramid(state, level[i]),
        box: () => checkBox(state, level[i]),
      }[level[i].s]()
    ) {
      collision = level[i];
      break;
    }

    i += 1;
  }
  //cleanup
  while (level.length && level[0].y + (level[0].r || level[0].d / 2) < state.y - state.r) {
    level.shift();
  }
  return collision;
}

const checkDistance = ({ x, y, z }, { x: x2, y: y2, z: z2 }) => distance([x, y, z], [x2, y2, z2]);

const checkPyramid = ({ x, y, z, r }, { x: px, y: py, r: pw, h }) => {
  //dirty check
  if (checkDistance({ x, y, z }, { x: px, y: py, z: 0 }) > Math.max((pw / 2) * 1.5, z > baseZ ? h : 0) + r) {
    return false;
  }
  const hw = pw / 2;
  /*       A
          /=\\
         /===\ \
        /=====\' \
       /=======\'' \ D
      /=========\ '/
   B /===========\/ C       */
  const A = [px, py, h];
  const B = [px - hw, py - hw, 0];
  const C = [px + hw, py - hw, 0];
  const D = [px + hw, py + hw, 0];
  const E = [px - hw, py + hw, 0];

  return (
    Math.min(
      distancePointToTriangle([x, y, z], [A, B, C]),
      distancePointToTriangle([x, y, z], x > px ? [A, C, D] : [A, B, E]),
    ) < r
  );
};

const checkBox = ({ x, y, z, r }, { x: bx, y: by, z: bz, w, h, d }) => {
  return distancePointToAABB([x, y, z], [bx - w / 2, by - d / 2, bz, bx + w / 2, by + d / 2, bz + h]) < r;
};

/**
 * Calculate the distance between a point in 3D space and the closest point on a triangle.
 * @param {number[]} point - The point in 3D space [x, y, z].
 * @param {Array} triangle - The triangle vertices as an array of three points, each a 3D array [x, y, z].
 * @returns {number} - The distance between the point and the closest point on the triangle.
 */
function distancePointToTriangle(point, triangle) {
  const [p, a, b, c] = [point, ...triangle];
  // Calculate vectors
  const ab = subtract(b, a);
  const ac = subtract(c, a);
  const ap = subtract(p, a);

  // Calculate dot products
  const d1 = dot(ab, ap);
  const d2 = dot(ac, ap);

  // Check if point is outside the triangle
  if (d1 <= 0 && d2 <= 0) {
    return distance(p, a);
  }

  const bp = subtract(p, b);
  const d3 = dot(ab, bp);
  const d4 = dot(ac, bp);

  if (d3 >= 0 && d4 <= d3) {
    return distance(p, b);
  }

  const vc = d1 * d4 - d3 * d2;
  if (vc <= 0 && d1 >= 0 && d3 <= 0) {
    const v = d1 / (d1 - d3);
    return distance(p, add(a, scale(ab, v)));
  }

  const cp = subtract(p, c);
  const d5 = dot(ab, cp);
  const d6 = dot(ac, cp);

  if (d6 >= 0 && d5 <= d6) {
    return distance(p, c);
  }

  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) {
    const w = d2 / (d2 - d6);
    return distance(p, add(a, scale(ac, w)));
  }

  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) {
    const w = (d4 - d3) / (d4 - d3 + (d5 - d6));
    return distance(p, add(b, scale(subtract(c, b), w)));
  }

  // Point is inside the triangle, calculate distance to plane
  const denom = 1 / (va + vb + vc);
  const v = vb * denom;
  const w = vc * denom;
  const closestPoint = add(a, add(scale(ab, v), scale(ac, w)));
  return distance(p, closestPoint);
}

/**
 * Calculate the distance between a point in 3D space and the closest point on an AABB.
 * @param {number[]} point - The point in 3D space [x, y, z].
 * @param {Array} box - The AABB as an array of six numbers [x1, y1, z1, x2, y2, z2].
 * @returns {number} - The distance between the point and the closest point on the AABB.
 */
function distancePointToAABB(point, box) {
  const [x, y, z] = point;
  const [x1, y1, z1, x2, y2, z2] = box;
  const dx = Math.max(x1 - x, 0, x - x2);
  const dy = Math.max(y1 - y, 0, y - y2);
  const dz = Math.max(z1 - z, 0, z - z2);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Helper functions
const distance = (v1, v2) => Math.sqrt((v2[0] - v1[0]) ** 2 + (v2[1] - v1[1]) ** 2 + (v2[2] - v1[2]) ** 2);
const subtract = (v1, v2) => v1.map((val, i) => val - v2[i]);
const add = (v1, v2) => v1.map((val, i) => val + v2[i]);
const scale = (v, scale) => v.map((val) => val * scale);
const dot = (v1, v2) => v1.reduce((sum, val, i) => sum + val * v2[i], 0);
