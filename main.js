import W from "./renderer/index.js";
import ship from "./assets/ship.js"; // base: 4.5, added: 5.38
import input from "./game/controls.js";
import { gradient } from "./game/util.js";
import { initShip, initBoost } from "./game/objects.js";
//init canvas
const canvas = document.getElementById("c");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rend = new W.Renderer({
  canvas: canvas,
  clearColor: "#002B36",
  debug: true,
  light: { x: -0.3, y: 0.9, z: -0.9 },
  camera: { z: 1.5, y: -0.5, rx: 80, fov: 30 },
  geometry: {
    sphere: W.Sphere,
    plane: W.Plane,
    cube: W.Cube,
    pyramid: W.Pyramid,
    shipBody: ship.body,
    shipFin: ship.fin,
    shipWing: ship.wing,
  },
});

//  rend.camera({ z: 30, y: 950, fov: 30 });

rend.ambient(0.1);

// rend.pyramid({ y: 8, rx: 90, x: 3, z: 1.5, b: "#ff00ff", g: 'test', w: 2, h: 3, d: 2, id: 'pyramid1', t: gradient('#8A2BE2', '#E6E6FA') });
rend.add("plane", {
  id: "floor",
  x: 0,
  y: 500,
  z: 0,
  b: "f00",
  w: 39,
  h: 1000,
  t: gradient("#D3D3D3", "#E6E6FA", 0, 0.85),
});

rend.add("cube", {
  id: "wall",
  x: 0,
  y: 1000,
  z: 13,
  b: "#FF6347",
  d: 26,
  w: 3,
  h: 3,
});
rend.add("cube", {
  id: "wall",
  x: -3 * 5,
  y: 1000,
  z: 13,
  b: "#FF6347",
  d: 26,
  w: 3,
  h: 3,
});
rend.add("cube", {
  id: "wall",
  x: 3 * 4,
  y: 1000,
  z: 13,
  b: "#FF6347",
  d: 26,
  w: 3,
  h: 3,
});

rend.add("plane", {
  id: "exit",
  x: 0,
  y: 1000,
  z: 13,
  b: "#FFFF00",
  rx: 90,
  w: 13 * 3,
  h: 13 * 2,
});

const spikeBg = gradient("#8A2BE2", "#E6E6FA");
for (let i = 0; i < 100; i++) {
  rend.add("pyramid", {
    y: 10 + i * 5,
    rx: 90,
    x: 13 * 1.5 - Math.round(Math.random() * 13 * 3),
    z: 1.4,
    b: "#ff00ff",
    g: "test",
    w: 2,
    h: 3,
    d: 2,
    id: "pyramid" + i,
    t: spikeBg,
  });
}

const loop = (t) => {
  rend.draw(t);
  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);

initShip(rend);

initBoost(rend, 2, 6);

for (let i = 0; i < 5; i++) {
  initBoost(rend, 13 * 1.5 - Math.round(Math.random() * 13 * 3), 16 + i * 30);
}
//rend.move({ id: 'ship', rz: 360 * 10, a: 70000 });
