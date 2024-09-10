export const initGate = (rend, n, x, y, z) => {
  const id = "gate" + n;
  rend.group({ id, x, y, z });
  rend.add("cube", {
    id: id + "c",
    g: id,
    z: 13,
    b: "#FF6347",
    o: 0,
    d: 26,
    w: 3,
    h: 3,
  });

  return {
    id,
    x,
    y,
    z,
    s: "box",
    w: 3,
    h: 26,
    d: 3,
    t: "wall",
  };
};
