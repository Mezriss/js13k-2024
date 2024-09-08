import { baseSpeed, maxTilt, maxTurn, speedIncrease, turnVelocity } from "./const.js";
import { clamp } from "./util.js";

const input = {
  direction: 0,
  jump: false,
};

const keys = {
  ArrowLeft: 0,
  ArrowRight: 0,
  Space: 0,
};

const update = () => {
  input.jump = !!keys.Space;
  input.direction = Math.sign(keys.ArrowRight - keys.ArrowLeft);
};

document.addEventListener("keydown", (e) => {
  keys[e.code] = Date.now();
  update();
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = 0;
  update();
});

export function handleInput(dt, state, rend) {
  state.y += (baseSpeed + state.boosts * speedIncrease) * dt;

  const dtv = turnVelocity * dt;
  if (input.direction) {
    state.turn += dtv * input.direction;
    state.turn = clamp(state.turn, -maxTurn, maxTurn);
  } else if (state.turn) {
    if (Math.abs(state.turn) < dtv) state.turn = 0;
    else state.turn -= dtv * Math.sign(state.turn);
  }
  state.x += state.turn * dt;
  rend.move({ id: "shipPivot", ry: (maxTilt * state.turn) / maxTurn });

  rend.move({ id: "ship", x: state.x, y: state.y, z: state.z });
  //todo jumps
}
