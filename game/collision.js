import { maxR } from "./const.js";

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
        sphere: () => getDistance(state, level[i]) <= state.r + level[i].r,
        pyramid: () => checkPyramid(state, level[i]),
      }[level[i].s]()
    ) {
      collision = level[i];
      break;
    }

    i += 1;
  }
  //cleanup
  while (level.length && level[0].y + level[0].r < state.y - state.r) {
    level.shift();
  }
  return collision;
}

const getDistance = ({ x, y, z }, { x: x2, y: y2, z: z2 }) => Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2 + (z2 - z) ** 2);

const checkPyramid = ({ x, y, z, r }, { x: px, y: py, r: pw, h }) => {
  //dirty check
  if (getDistance({ x, y, z }, { x: px, y: py, z: 0 }) > Math.max(pw * 1.5, h) + r) {
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

  const d = Math.min(
    distancePointToTriangle([x, y, z], [A, B, C]),
    distancePointToTriangle([x, y, z], x > px ? [A, C, D] : [A, B, E]),
  );
  return d < r;
};

/**
 * Calculate the distance between a point in 3D space and the closest point on a triangle.
 * @param {number[]} point - The point in 3D space [x, y, z].
 * @param {Array} triangle - The triangle vertices as an array of three points, each a 3D array [x, y, z].
 * @returns {number} - The distance between the point and the closest point on the triangle.
 */
function distancePointToTriangle(point, triangle) {
  const [p, a, b, c] = [point, ...triangle];

  // Vector subtraction
  const subtract = (v1, v2) => v1.map((val, i) => val - v2[i]);

  // Dot product of two vectors
  const dot = (v1, v2) => v1.reduce((sum, val, i) => sum + val * v2[i], 0);

  // Cross product of two vectors
  const cross = (v1, v2) => [
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0],
  ];

  // Length of a vector
  const length = (v) => Math.sqrt(dot(v, v));

  // Normalize a vector
  const normalize = (v) => {
    const len = length(v);
    return v.map((val) => val / len);
  };

  // Project point onto plane defined by triangle
  const ab = subtract(b, a);
  const ac = subtract(c, a);
  const ap = subtract(p, a);
  const normal = normalize(cross(ab, ac));
  const distanceToPlane = dot(ap, normal);
  const projection = subtract(
    p,
    normal.map((val) => val * distanceToPlane),
  );

  // Check if projection is inside the triangle using barycentric coordinates
  const v0 = ab;
  const v1 = ac;
  const v2 = subtract(projection, a);
  const d00 = dot(v0, v0);
  const d01 = dot(v0, v1);
  const d11 = dot(v1, v1);
  const d20 = dot(v2, v0);
  const d21 = dot(v2, v1);
  const denom = d00 * d11 - d01 * d01;
  const v = (d11 * d20 - d01 * d21) / denom;
  const w = (d00 * d21 - d01 * d20) / denom;
  const u = 1.0 - v - w;

  // If projection is inside the triangle, return the distance to the plane
  if (u >= 0 && v >= 0 && w >= 0) {
    return Math.abs(distanceToPlane);
  }

  // Otherwise, find the closest point on the triangle's edges or vertices
  const edgeDistance = (p1, p2) => {
    const edge = subtract(p2, p1);
    const t = Math.max(0, Math.min(1, dot(subtract(p, p1), edge) / dot(edge, edge)));
    const closestPoint = p1.map((val, i) => val + t * edge[i]);
    return length(subtract(p, closestPoint));
  };

  const distances = [
    length(subtract(p, a)),
    length(subtract(p, b)),
    length(subtract(p, c)),
    edgeDistance(a, b),
    edgeDistance(b, c),
    edgeDistance(c, a),
  ];

  return Math.min(...distances);
}
