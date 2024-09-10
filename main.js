import { Renderer } from "./renderer/index.js";
import { generateLevel } from "./game/level";
import { handleInput } from "./game/controls.js";
import { initShip } from "./game/objects.js";
import { levelLength, playerR, rendererDefaults, scoreBoost, scoreM, stateDefaults } from "./game/const.js";
import { checkCollisions } from "./game/collision.js";
import { load, save } from "./game/util.js";
/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("c");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function startLevel(n, seed = 1, difficulty = 1) {
  const rend = new Renderer({
    canvas: canvas,
    ...rendererDefaults,
  });
  // window.drend = rend;
  /**
   * @type {State}
   */
  const state = { ...stateDefaults, r: playerR[difficulty] };
  /**
   * @type {Entity[]}
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
     * @type {Entity}
     */
    let collision = checkCollisions(state, level);
    if (collision?.t === "boost") {
      state.boosts += 1;
      state.score += scoreBoost * scoreM[difficulty];
      level.splice(
        level.findIndex((el) => el.id === collision.id),
        1,
      );
      rend.move({ id: collision.id, z: 0.5, size: 0.5, a: 50 });
      rend.delete(collision.id, 50);
    }
    if (collision?.t === "wall") {
      defeat();
      return;
    }
    if (state.y >= levelLength) {
      victory(n, state.score);
      return;
    }
    //TODO update moving elements in the world
    //todo hide objects too close to camera?
    rend.draw(dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

startLevel(1, 1, 1);

function victory(level, score) {
  const data = load();
  data.score[level] = score;
  save(data);
  //todo some kind of victory animation
  //todo return to main menu
}

function defeat() {
  //todo launch loop that only has death animation
  //todo eject to main menu
}

/*
game0 checklist
+ collisions with pyramids
+ collision with boxes
+ win on level end
- gates closing
- main menu with level/challenge selection
- transitions from level to menu and back
+ score in local storage
+ slow down on edges

game1 checklist
- 1-2 moving enemies
- different levels
+ jumping
- sound effects
- ramps

game1.5 checklist
- level intro animation
- death animation
- exhaust animation (and geometry?)
- music
- extra collectibles

game2 checklist
- animated exit
- clouds
- more hazards types
- box art and trailer
*/
