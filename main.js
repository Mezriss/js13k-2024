import W from './renderer/index.js';

const canvas = document.getElementById('c');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const w = new W.Renderer({
    canvas: canvas,
    clearColor: "#1E3A5F",
    debug: true
});

w.ambient(0.3);
w.light({ x: 0.2, y: 0, z: -1 });

w.camera({ z: 1, y: -3, rx: 80 })

w.group({ id: 'test' });


w.add('sphere', W.Sphere);
w.add('plane', W.Plane);
w.add('cube', W.Cube);
w.add('pyramid', W.Pyramid);

w.sphere({ x: 0, y: 1, z: 0, b: "#00ff00", s: 0, h: 2 });

w.pyramid({ y: 5, rx: 90, x: 1, b: "#ff000050", g: 'test', w: 2, h: 3, d: 2, id: 'pyramid1' });
w.plane({ id: 'floor', x: 0, y: 0, z: 0, b: "#0f00f0", w: 39, h: 1000 });
w.cube({ id: 'wall', x: 0, y: 1000, z: 0, b: "#ff0000", d: 200, w: 3, h: 3, });


// for (let i = 0; i < 1000; i++) {
//     // w.add('pyramid' + i, W.Pyramid, {size:1,y: 5 + i * 2, rx:90, x:1 + i,b:"#ff0000", g: 'test', size: 2});
//     // w.add('pyramidA' + i, W.Pyramid, {size:1,y: 5 + i * 2, rx:90, x:1 - i,b:"#ff0000", g: 'test', size: 2});

// }

const loop = (t) => {

    w.draw(t)
    requestAnimationFrame(loop);

}
requestAnimationFrame(loop)


setInterval(() => {
    w.move({ id: 'pyramid1', x: 3 });
}, 1000);