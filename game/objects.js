import { gradient } from "./util.js";

let incrId = 0;
const m10 = 10 * 60 * 1000;

export const initShip = (rend) => {
  rend.group({ id: "ship" });
  rend.group({ id: "shipPivot", g: "ship", z: 0.3 });
  const stripe = gradient("#00FFFF", "#FFA500", 0, 0.081);
  rend.add("shipBody", {
    id: "body",
    g: "shipPivot",
    x: -0.305,
    z: 0,
    rx: -90,
    b: "#00FFFF",
    t: stripe,
  });
  rend.add("shipFin", {
    id: "fin1",
    g: "shipPivot",
    x: 0.3,
    z: -0.045,
    rx: 90,
    rz: 180,
    b: "#00FFFF",
    size: 0.5,
  });
  rend.add("shipFin", {
    id: "fin2",
    g: "shipPivot",
    x: -0.3,
    z: -0.045,
    rx: 90,
    rz: 180,
    b: "#00FFFF",
    w: -0.5,
    h: 0.5,
    d: 0.5,
  });
  rend.add("shipFin", {
    id: "fin3",
    g: "shipPivot",
    x: 0.3,
    z: -0.045,
    rx: 90,
    rz: 180,
    b: "#00FFFF",
    w: 0.5,
    h: -0.5,
    d: 0.5,
  });
  rend.add("shipFin", {
    id: "fin4",
    g: "shipPivot",
    x: -0.3,
    z: -0.045,
    rx: 90,
    rz: 180,
    b: "#00FFFF",
    w: -0.5,
    h: -0.5,
    d: 0.5,
  });
  rend.add("shipWing", {
    id: "wing1",
    g: "shipPivot",
    x: -0.55,
    z: -0.05,
    rx: -90,
    b: "#00FFFF",
    t: stripe,
    size: 0.5,
  });
  rend.add("shipWing", {
    id: "wing2",
    g: "shipPivot",
    x: 0.55,
    z: -0.05,
    rx: -90,
    b: "#00FFFF",
    t: stripe,
    w: -0.5,
    h: 0.5,
    d: 0.5,
  });
  rend.add("pyramid", {
    id: "canopy",
    g: "shipPivot",
    x: 0,
    y: 0.42,
    z: -0.038,
    rx: -4,
    b: "#191970",
    t: gradient("#191970", "#2F4F4F", 1),
    w: 0.12,
    h: 0.5,
    d: 0.075,
  });
};

export const initBoost = (rend, x, y) => {
  const id = "boost" + ++incrId;
  rend.group({ id, x, y });

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
  return id;
};

const spikeBg = gradient("#8A2BE2", "#E6E6FA");
export const initSpike = (rend, x, y) => {
  const id = "spike" + ++incrId;
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
  return id;
};
