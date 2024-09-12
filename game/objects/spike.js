import { gradient, iid } from "../util.js";

const spikeBg = gradient("#8A2BE2", "#E6E6FA");
/**
 * @param {W2} rend
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @return Entity
 */
export const initSpike = (rend, x, y, w = 2, h = 3) => {
  const id = iid`spike`;
  rend.add("pyramid", {
    id,
    x,
    y,
    z: h / 2 - 0.01,
    rx: 90,
    b: "#ff00ff",
    w: w,
    h: h,
    d: w,
    t: spikeBg,
  });

  return {
    id,
    x,
    y,
    z: 0,
    t: "wall",
    s: "pyramid",
    r: w,
    h: h,
  };
};
