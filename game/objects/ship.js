import { gradient } from "../util.js";

export const initShip = (rend, r) => {
  rend.group({ id: "ship" });
  rend.group({ id: "shipPivot", g: "ship", y: -0.25, z: 0.05 });
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
  // rend.add("sphere", {
  //   //collision shape
  //   g: "ship",
  //   size: r * 2,
  //   mode: 2,
  // });
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
