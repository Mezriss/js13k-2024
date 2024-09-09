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
  // window.drend = rend;
  /**
   * @type {State}
   */
  const state = { ...stateDefaults, r: playerR[challenge] };
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
      console.info(collision);
      state.boosts += 1;
      state.score += scoreBoost * scoreM[challenge];
      level.splice(
        level.findIndex((el) => el.id === collision.id),
        1,
      );
      //todo actually delete
      rend.move({ id: collision.id, z: 0.5, size: 0.5, a: 50 });
      rend.delete(collision.id, 50);
    }
    if (collision?.t === "wall") {
      state.alive = false;
    }
    //TODO update moving elements in the world
    //todo hide objects too close to camera?
    rend.draw(dt);
    if (state.alive) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

startLevel(1);

/*
game0 checklist
+ collisions with pyramids
+ collision with boxes
- win on level end
- gates closing
- main menu with level/challenge selection
- transitions from level to menu and back
- score in local storage

game1 checklist
- 1-2 moving enemies
- different levels
- jumping
- sound effects

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
