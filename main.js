import { Renderer } from "./renderer/index.js";
import { generateLevel } from "./game/level";
import { handleInput } from "./game/controls.js";
import { initShip } from "./game/objects.js";
import { levelLength, playerR, rendererDefaults, scoreBoost, scoreM, stateDefaults } from "./game/const.js";
import { checkCollisions } from "./game/collision.js";
import { easeOutCirc, load, save, shuffle } from "./game/util.js";
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
  initGates(state);
  initAnimations(state, level, rend);

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
    animate(state, level, rend, dt);
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

/**
 * @param {State} state
 */
function initGates(state) {
  const gates = [];
  for (let i = 0; i < 13; i++) gates.push("gate" + i);
  shuffle(gates);
  gates.forEach((id, i) => {
    state.tweens.push({
      id,
      key: "z",
      from: 20 + i * 2,
      delta: -(20 + i * 2),
      duration: 5000,
      delay: 5000 * i,
      progress: 0,
    });
  });
}

/**
 * @param {State} state
 * @param {Entity[]}level
 * @param {W2} rend
 */
function initAnimations(state, level, rend) {
  state.tweens.forEach((tween) => {
    move(tween.id, tween.key, tween.from, rend, level);
  });
}

/**
 * @param {State} state
 * @param {Entity[]}level
 * @param {W2} rend
 * @param {number} dt
 */
function animate(state, level, rend, dt) {
  state.tweens.forEach((tween) => {
    if (tween.progress >= tween.duration) return;
    if (tween.delay > 0) {
      tween.delay -= dt;
      return;
    }
    tween.progress += dt;
    move(tween.id, tween.key, tween.from + tween.delta * easeOutCirc(tween.progress / tween.duration), rend, level);
  });
}

function move(id, key, value, rend, level) {
  rend.move({ id: id, [key]: value });
  if (["x", "y", "z"].includes(key)) {
    level.find((e) => e.id === id)[key] = value;
  }
}

/*
game0 checklist
+ collisions with pyramids
+ collision with boxes
+ win on level end
+ gates closing
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
