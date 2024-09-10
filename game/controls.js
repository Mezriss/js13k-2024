import { baseSpeed, baseZ, jumpStrength, tiltFactor, maxTurn, speedIncrease, turnVelocity } from "./const.js";
import { clamp, dampen } from "./util.js";

const input = {
  direction: 0,
  jump: false,
};

const keys = {
  ArrowLeft: 0,
  KeyA: 0,
  KeyD: 0,
  ArrowRight: 0,
  Space: 0,
};

const update = () => {
  input.jump = !!keys.Space;
  input.direction = Math.sign(Math.max(keys.ArrowRight, keys.KeyD) - Math.max(keys.ArrowLeft, keys.KeyA));
};

document.addEventListener("keydown", (e) => {
  keys[e.code] = Date.now();
  update();
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = 0;
  update();
});

document.addEventListener("blur", () => {
  for (let k in keys) keys[k] = 0;
});

export function handleInput(dt, state, rend) {
  state.y += (baseSpeed + state.boosts * speedIncrease) * dt;

  // turning
  const dtv = turnVelocity * dt;
  if (input.direction) {
    state.turn = clamp(state.turn + dtv * input.direction, -maxTurn, maxTurn);
  } else if (state.turn) {
    if (Math.abs(state.turn) < dtv) state.turn = 0;
    else state.turn -= dtv * Math.sign(state.turn);
  }
  const ax = Math.abs(state.x);
  if (ax > 18 && state.turn * state.x > 0) {
    state.turn *= ax > 19 ? 0 : 1 - (ax % 18) / 3;
  }
  state.x += state.turn * dt;

  // jumping
  if (input.jump && state.z <= baseZ && state.boosts) {
    state.vz = jumpStrength;
    state.boosts -= 1;
  }
  state.vz = Math.max(-50, state.vz - 10 * dt);
  state.z = Math.max(baseZ, state.z + state.vz * dt);

  rend.move({
    id: "shipPivot",
    ry: state.turn * tiltFactor,
    rx: dampen(rend.current["shipPivot"].rx, state.z > baseZ ? (state.vz / jumpStrength) * 15 : 0, 0.2),
  });

  rend.move({ id: "ship", x: state.x, y: state.y, z: state.z });
}
