import { Renderer } from "./renderer/index.js";
import { generateLevel } from "./game/level";
import { handleInput } from "./game/controls.js";
import { initShip } from "./game/objects.js";
import { rendererDefaults, stateDefaults } from "./game/const.js";
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("c");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function startLevel(seed = 1) {
  const rend = new Renderer({
    canvas: canvas,
    ...rendererDefaults,
  });
  const state = { ...stateDefaults };
  const level = generateLevel(seed, rend);
  initShip(rend);
  rend.move({ id: "camera", g: "ship" });

  const loop = (t) => {
    state.lastFrame ||= t;
    const dt = Math.min(t - state.lastFrame, 100);
    state.lastFrame = t;
    handleInput(dt / 1000, state, rend);
    //TODO update moving elements in the world
    //TODO run collision check
    //todo hide objects too close to camera
    rend.draw(dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

startLevel(1);
