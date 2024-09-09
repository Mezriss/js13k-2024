import { gradient, iid } from "../util.js";

const spikeBg = gradient("#8A2BE2", "#E6E6FA");
/**
 * @param {W2} rend
 * @param {number} x
 * @param {number} y
 * @return Entity
 */
export const initSpike = (rend, x, y) => {
  const id = iid`spike`;
  rend.add("pyramid", {
    id,
    x,
    y,
    z: 1.4,
    rx: 90,
    b: "#ff00ff",
    w: 2,
    h: 3,
    d: 2,
    t: spikeBg,
  });

  return {
    id,
    x,
    y,
    z: 0,
    t: "wall",
    s: "pyramid",
    r: 2,
    h: 3,
  };
};
