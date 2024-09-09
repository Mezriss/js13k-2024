import { m10 } from "../const.js";
import { iid } from "../util.js";

/**
 * @param {W2} rend
 * @param {number} x
 * @param {number} y
 * @return {Entity}
 */
export const initBoost = (rend, x, y) => {
  const id = iid`boost`;
  rend.group({ id, x, y });

  // rend.add("sphere", {
  //   //collision shape
  //   g: id,
  //   mode: 2,
  //   size: 0.75,
  //   z: 0.25,
  // });

  // rend.cube({ g: id, z: 5.5, b: '#FFFF0011', w:0.3, h: 0.3, d: 10 })
  rend.group({ id: id + "p", g: id });
  rend.add("pyramid", {
    g: id + "p",
    z: 0.4,
    b: "#FFFF00AA",
    rx: 90,
    rz: 45,
    w: 0.5,
    d: 0.5,
    h: 0.4,
  });
  rend.add("pyramid", {
    g: id + "p",
    z: 0,
    b: "#FFFF00AA",
    rx: 90,
    rz: 45,
    w: 0.5,
    d: 0.5,
    h: -0.4,
  });
  rend.move({ id: id + "p", rz: 0.2 * m10, a: m10 });
  rend.add("pyramid", {
    g: id,
    z: 5.7,
    b: "#FFFF0011",
    rx: 90,
    rz: 45,
    w: 0.3,
    d: 0.3,
    h: -10,
  });
  return {
    id,
    x,
    y,
    t: "boost",
    s: "sphere",
    r: 0.375,
    z: 0.25,
  };
};
