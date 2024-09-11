import { Renderer } from "./renderer/index.js";
import { generateLevel } from "./game/level";
import { handleInput } from "./game/controls.js";
import { initShip } from "./game/objects.js";
import { levelLength, playerR, rendererDefaults, scoreBoost, scoreM, stateDefaults } from "./game/const.js";
import { checkCollisions } from "./game/collision.js";
import { easeOutCirc, load, save } from "./game/util.js";
import { play, tracks } from "./game/sound.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("#c");

function startLevel(levelN, seed = 1) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const difficulty = parseInt(document.querySelector("input:checked").value);
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
  const [level, tweens] = generateLevel(seed, rend);
  initShip(rend, state.r);
  rend.move({ id: "camera", g: "ship" });

  go("hud");

  const loop = (t) => {
    state.lastFrame ||= t;
    const dt = Math.min(t - state.lastFrame, 100);
    state.lastFrame = t;
    handleInput(dt / 1000, state, rend);
    updateHUD(state.score, state.boosts);
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
      updateHUD(state.score, state.boosts);
      play(tracks.boost);
    }
    if (collision?.t === "wall") {
      defeat();
      return;
    }
    if (state.y >= levelLength) {
      victory(levelN, state.score);
      return;
    }
    animate(tweens, level, rend, dt);
    rend.draw(dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
document.querySelector("#ls").addEventListener("click", (e) => {
  const l = e.target.dataset?.level;
  if (l) startLevel(l, 1);
});

function victory(level, score) {
  const data = load();
  data.score[level - 1] = score;
  save(data);
  document.querySelector("#score").innerHTML = score;
  renderLevelSelector();
  go("win");
  //todo some kind of victory animation
}

function defeat() {
  play(tracks.explosion);
  go("defeat");
  //todo launch loop that only has death animation
}

/**
 * @param {Tween[]} tweens
 * @param {Entity[]}level
 * @param {W2} rend
 * @param {number} dt
 */
function animate(tweens, level, rend, dt) {
  tweens.forEach((tween) => {
    if (tween.progress >= tween.duration) return;
    if (tween.delay > 0) {
      tween.delay -= dt;
      return;
    }
    tween.progress += dt;
    rend.move({ id: tween.id, [tween.key]: tween.from + tween.delta * easeOutCirc(tween.progress / tween.duration) });
    if (["x", "y", "z"].includes(tween.key)) {
      level.find((e) => e.id === tween.id)[tween.key] =
        tween.from + tween.delta * easeOutCirc(tween.progress / tween.duration);
    }
  });
}

//UI
window.go = function go(view) {
  const [from, to] = document.querySelectorAll(`.active,#${view}`);
  from.classList.toggle("active");
  to.classList.toggle("active");
  document.querySelectorAll("button").forEach((el) => el.blur());
};

function renderLevelSelector() {
  const ls = document.querySelector("#ls");
  const data = load();
  let out = "";
  for (let i = 0; i < 5; i++) {
    out += `<div><button data-level="${i + 1}"${
      i > 0 && !data.score[i - 1] ? "disabled" : ""
    }>${i + 1}</button>${data.score[i] || "Not Passed"}</div>`;
  }

  ls.innerHTML = out;
}
renderLevelSelector();

function updateHUD(score, boosts) {
  const [sel, bel] = document.querySelectorAll("#hscore,#hboosts");
  sel.innerHTML = score;
  bel.innerHTML = boosts + "  &#9671;";
}
