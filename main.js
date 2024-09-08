import { Renderer } from "./renderer/index.js";
import { generateLevel } from "./game/level";
import { handleInput } from "./game/controls.js";
import { initShip } from "./game/objects.js";
import { playerR, rendererDefaults, scoreBoost, scoreM, stateDefaults } from "./game/const.js";
import { checkCollisions } from "./game/collision.js";
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("c");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function startLevel(seed = 1, challenge = 1) {
  const rend = new Renderer({
    canvas: canvas,
    ...rendererDefaults,
  });
  /**
   * @type {State}
   */
  const state = { ...stateDefaults, r: playerR[challenge] };
  /**
   * @type {Element[]}
   */
  const level = generateLevel(seed, rend);
  initShip(rend, state.r);
  rend.move({ id: "camera", g: "ship" });

  const loop = (t) => {
    state.lastFrame ||= t;
    const dt = Math.min(t - state.lastFrame, 100);
    state.lastFrame = t;
    handleInput(dt / 1000, state, rend);
    /**
     * @type {Element}
     */
    let collision = checkCollisions(state, level);
    if (collision?.t === "boost") {
      console.info(collision);
      state.boosts += 1;
      state.score += scoreBoost * scoreM[challenge];
      level.splice(
        level.findIndex((el) => el.id === collision.id),
        1,
      );
      //todo actually delete
      rend.move({ id: collision.id, z: 1000000 });
    }
    //TODO update moving elements in the world
    //todo hide objects too close to camera?
    rend.draw(dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

startLevel(1);
