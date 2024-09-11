// Sound https://xem.github.io/MiniSoundEditor/

export const tracks = {
  explosion: (i) => {
    //cannonfire
    const n = 4e4;
    if (i > n) return null;
    return (
      Math.sin(i / 200 - Math.sin(i / 331) * Math.sin(i / 61) + Math.sin(Math.sin(i / 59) / 39) * 33) * t(i, n) * 9
    );
  },
  // crystal 8
  boost: (i) => Math.sin(i / 20) * Math.cos(Math.sqrt(i) / 5) * Math.exp(-i / 20000),
  //laser2
  // jump: (i) => Math.sin(i * (i / 5e5)) * Math.exp(-i / 2e4),
  //splash1
  jump: (i) => Math.sin(i / 100 + Math.random() * 50) * Math.exp(-i / 8000),

  //sword
  // fall: (i) => {
  //   const n = 15e3;
  //   if (i > n) return null;
  //   const q = t(i, n);
  //   return Math.sin(i * 0.001 * Math.sin(0.009 * i + Math.sin(i / 200)) + Math.sin(i / 100)) * q * q;
  // },
  fall: (i) => Math.sin((i * i) / 1e6) * Math.exp(-i / 2000) * 9,
};

// Sound player
const t = (i, n) => (n - i) / n;

export const play = (track) => {
  const audioCtx = new AudioContext();
  const gainNode = audioCtx.createGain();

  gainNode.gain.value = 0.2;

  const audioBuffer = audioCtx.createBuffer(1, 96e3, 48e3);
  const channelData = audioBuffer.getChannelData(0);
  for (let i = 96e3; i--; ) channelData[i] = track(i);
  const bufferSource = audioCtx.createBufferSource();
  bufferSource.buffer = audioBuffer;

  bufferSource.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  bufferSource.start();
  return bufferSource;
};
