import { Renderer } from "./renderer/index.js";
import { generateLevel } from "./game/level";
import { handleInput } from "./game/controls.js";
import { initFloor, initShip } from "./game/objects.js";
import {
  levelLength,
  logo,
  playerR,
  rendererDefaults,
  scoreBoost,
  scoreM,
  seededRng,
  stateDefaults,
} from "./game/const.js";
import { checkCollisions } from "./game/collision.js";
import { easeOutCirc, load, save } from "./game/util.js";
import { play, tracks } from "./game/sound.js";

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.querySelector("#c");

function startLevel(levelN) {
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
  const [level, tweens] = generateLevel(levelN, rend, seededRng[levelN - 1]());
  const levelEnd = levelLength * (1 + 0.2 * (levelN - 1));
  let gameIntroTime = 8000;
  let levelIntroTime = (levelEnd / 10) * 1000;
  let last = 0;

  const gameIntroLoop = (t) => {
    last ||= t;
    const dt = Math.min(t - last, 100);
    last = t;
    gameIntroTime -= dt;
    if (gameIntroTime < 0) {
      startLevelIntro();
    } else {
      requestAnimationFrame(gameIntroLoop);
    }
  };

  const startLevelIntro = () => {
    go("hud");
    rend.move({ id: "camera", g: "ship", y: levelEnd - 1, z: 10 });
    rend.draw(1);
    rend.move({ id: "camera", y: rendererDefaults.camera.y, z: rendererDefaults.camera.z, a: levelIntroTime });

    requestAnimationFrame(levelIntroLoop);
  };

  const levelIntroLoop = (t) => {
    last ||= t;
    const dt = Math.min(t - state.lastFrame, 100);
    last = t;
    levelIntroTime -= dt;
    if (levelIntroTime < 0) {
      requestAnimationFrame(loop);
    } else {
      rend.draw(dt);
      requestAnimationFrame(levelIntroLoop);
    }
  };

  initShip(rend, state.r);

  const loop = (t) => {
    state.lastFrame ||= t;
    const dt = Math.min(t - state.lastFrame, 100);
    state.lastFrame = t;
    handleInput(dt / 1000, state, rend, difficulty);
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
    if (state.y >= levelEnd) {
      victory(levelN, state.score);
      return;
    }
    animate(tweens, level, rend, dt);
    rend.draw(dt);
    requestAnimationFrame(loop);
  };

  const data = load();
  if (!data.seenIntro) {
    data.seenIntro = true;
    save(data);
    go("intro");
    requestAnimationFrame(gameIntroLoop);
  } else {
    startLevelIntro();
  }
}
document.querySelector("#ls").addEventListener("click", (e) => {
  const l = e.target.dataset?.level;
  if (l) startLevel(parseInt(l, 10), 1);
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
  canvas.style.opacity = view === "hud" ? "1" : "0";
  from.classList.toggle("active");
  to.classList.toggle("active");
  document.querySelectorAll("button").forEach((el) => el.blur());
};

function renderLevelSelector() {
  const ls = document.querySelector("#ls");
  const data = load();
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += `<div><button data-level="${i + 1}"${
      i > 0 && !data.score[i - 1] ? "disabled" : ""
    }>${i === 5 ? "?" : i + 1}</button>${data.score[i] || "Not Passed"}</div>`;
  }

  ls.innerHTML = out;
}
renderLevelSelector();

function updateHUD(score, boosts) {
  const [sel, bel] = document.querySelectorAll("#hscore,#hboosts");
  sel.innerHTML = score;
  bel.innerHTML = boosts + "  &#9671;";
}

function renderIntro() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ratio = window.innerWidth / window.innerHeight;
  let [x, y, z, rx, ry, rz, fov] = [2.5, -2, 2, 68, -19, 28, 27];
  fov *= 1 + Math.max(0, 1.5 - ratio);

  const camera = {
    x,
    y,
    z,
    rx,
    fov,
    ry,
    rz,
  };
  const rend = new Renderer({
    canvas: canvas,
    ...rendererDefaults,
    camera,
  });
  initShip(rend, 1);
  initFloor(rend, 1000);
  rend.move({ id: "floor", w: 22, y: -10 });
  rend.group({ id: "logo", y: 50, z: logo.length, x: -logo[0].length / 2 + 1 });
  for (let i = 0; i < logo.length; i += 1) {
    for (let j = 0; j < logo[0].length; j += 1) {
      if (logo[i][j]) {
        rend.add("cube", {
          g: "logo",
          x: j,
          z: -i,
          b: [, "f00", "fff"][logo[i][j]],
        });
      }
    }
  }
  rend.draw(1); //there is something wrong with light setup
  rend.draw(1);
  //
  // const loop = (dt) => {
  //   rend.draw(dt);
  //   requestAnimationFrame(loop);
  // };
  // loop();
  //
  // const d = document.querySelector("#debug");
  // d.innerHTML = ["x", "y", "z", "rx", "ry", "rz", "fov"]
  //   .map((v) => `${v} <input id="c${v}" type="number" value="${camera[v]}" step="1" />`)
  //   .join("");
  //
  // d.addEventListener("change", () => {
  //   const [x, y, z, rx, ry, rz, fov] = [...document.querySelectorAll("#cx,#cy,#cz,#crx,#cry,#crz,#cfov")].map((inp) =>
  //     parseFloat(inp.value),
  //   );
  //   console.info([x, y, z, rx, ry, rz, fov]);
  //   rend.move({ id: "camera", x, y, z, rx, ry, rz, fov });
  // });
}
renderIntro();
