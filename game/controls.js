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

document.addEventListener("keydown", ({ code }) => {
  if (keys[code] !== undefined) {
    keys[code] = Date.now();
  }
  update();
});

document.addEventListener("keyup", (e) => {
  keys[e.code] &&= 0;
  update();
});

export default input;
