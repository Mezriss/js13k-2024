import W from './renderer/index.js';
import ship from './assets/ship.js'; // base: 4.5, added: 5.38
import { gradient } from './util.js';

//init canvas
const canvas = document.getElementById('c');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const rend = new W.Renderer({
    canvas: canvas,
    clearColor: "#002B36",
    debug: true,
    light: { x: 0.2, y: 0, z: -1 },
    camera: { z: 1.5, y: -2.5, rx: 80, fov: 30 }
});

rend.ambient(0.2);

rend.add('sphere', W.Sphere);
rend.add('plane', W.Plane);
rend.add('cube', W.Cube);
rend.add('pyramid', W.Pyramid);
rend.add("shipBody", ship.body);
rend.add("shipFin", ship.fin);
rend.add("shipWing", ship.wing);
// w.sphere({ x: 0, y: 0, z: 0, b: "#00ff00", t: createGradientCanvas('#ffffff', '#4B0082', 'vertical') });

rend.pyramid({ y: 8, rx: 90, x: 3, z: 1.5, b: "#ff00ff", g: 'test', w: 2, h: 3, d: 2, id: 'pyramid1', t: gradient('#8A2BE2', '#E6E6FA') });
rend.plane({ id: 'floor', x: 0, y: 0, z: 0, b: '#E6E6FA', w: 39, h: 1000/*, t: gradient('#E6E6FA', '#D3D3D3', 0, 0.9) */ });
rend.cube({ id: 'wall', x: 0, y: 1000, z: 0, b: "#ff0000", d: 200, w: 3, h: 3, });

rend.plane({ id: 'exit', x: 0, y: 1000, z: 13, b: '#FFFF00', rx: 90, w: 13 * 3, h: 13 * 2 })

for (let i = 0; i < 100; i++) {
    rend.pyramid({
        y: 8 + i * 5, rx: 90,
        x: 13 * 1.5 - Math.round(Math.random() * 13 * 3), z: 1.5,
        b: "#ff00ff", g: 'test', w: 2, h: 3, d: 2, id: 'pyramid' + i, t: gradient('#8A2BE2', '#E6E6FA')
    });


}

const loop = (t) => {

    rend.draw(t)
    requestAnimationFrame(loop);

}
requestAnimationFrame(loop)


rend.group({ id: 'ship', z: 0.3, rz: 0 });

rend.shipBody({ id: 'body', g: 'ship', x: -0.305, z: 0, rx: -90, b: "#00FFFF", t: gradient('#00FFFF', '#FFA500', 0, 0.081) });
rend.shipFin({ id: 'fin1', g: 'ship', x: 0.3, z: -0.045, rx: 90, rz: 180, b: "#00FFFF", size: 0.5 });
rend.shipFin({ id: 'fin2', g: 'ship', x: -0.3, z: -0.045, rx: 90, rz: 180, b: "#00FFFF", w: -0.5, h: 0.5, d: 0.5 });
rend.shipFin({ id: 'fin3', g: 'ship', x: 0.3, z: -0.045, rx: 90, rz: 180, b: "#00FFFF", w: 0.5, h: -0.5, d: 0.5 });
rend.shipFin({ id: 'fin4', g: 'ship', x: -0.3, z: -0.045, rx: 90, rz: 180, b: "#00FFFF", w: -0.5, h: -0.5, d: 0.5 });
rend.shipWing({ id: 'wing1', g: 'ship', x: -0.55, z: -0.05, rx: -90, b: "#00FFFF", t: gradient('#00FFFF', '#FFA500', 0, 0.081), size: 0.5 });
rend.shipWing({
    id: 'wing2', g: 'ship', x: 0.55, z: -0.05, rx: -90, b: "#00FFFF", t: gradient('#00FFFF', '#FFA500', 0, 0.081),
    w: -0.5, h: 0.5, d: 0.5
});
rend.pyramid({ id: 'canopy', g: 'ship', x: 0, y: 0.42, z: -0.038, rx: -4, b: "#191970", t: gradient('#191970', '#2F4F4F', 1), w: 0.12, h: 0.5, d: 0.075 });

//rend.move({ id: 'ship', rz: 360 * 10, a: 70000 });