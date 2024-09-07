import W from './renderer/index.js';
import ship from './assets/ship.js';
const canvas = document.getElementById('c');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const rend = new W.Renderer({
    canvas: canvas,
    clearColor: "#002B36",
    debug: true,
    light: { x: 0.2, y: 0, z: -1 },
    camera: { z: 1, y: -2.5, rx: 80, fov: 30 }
});

rend.ambient(0.3);

rend.add('sphere', W.Sphere);
rend.add('plane', W.Plane);
rend.add('cube', W.Cube);
rend.add('pyramid', W.Pyramid);
rend.add("ship", ship.body);
// w.sphere({ x: 0, y: 0, z: 0, b: "#00ff00", t: createGradientCanvas('#ffffff', '#4B0082', 'vertical') });

rend.pyramid({ y: 8, rx: 90, x: 3, z: 1.5, b: "#ff00ff", g: 'test', w: 2, h: 3, d: 2, id: 'pyramid1', t: gradient('silver', 'red') });
rend.plane({ id: 'floor', x: 0, y: 0, z: 0, b: '#E6E6FA', w: 39, h: 1000});
rend.cube({ id: 'wall', x: 0, y: 1000, z: 0, b: "#ff0000", d: 200, w: 3, h: 3, });


// for (let i = 0; i < 1000; i++) {
//     // w.add('pyramid' + i, W.Pyramid, {size:1,y: 5 + i * 2, rx:90, x:1 + i,b:"#ff0000", g: 'test', size: 2});
//     // w.add('pyramidA' + i, W.Pyramid, {size:1,y: 5 + i * 2, rx:90, x:1 - i,b:"#ff0000", g: 'test', size: 2});

// }

const loop = (t) => {

    rend.draw(t)
    requestAnimationFrame(loop);

}
requestAnimationFrame(loop)


setInterval(() => {
    rend.move({ id: 'pyramid1', x: 3 });
}, 1000);



rend.group({ id: 'ship', z: 0.2 });

rend.ship({ id: 'ship_body', g: 'ship', x: -0.305, y: 0, z: 0, rx: -90, b: "#00ff00", t: gradient('#00FFFF', '#FFA500', 0, 0.081) });

function gradient(colorA, colorB, vertical = 1, line = 0) {
    // Create a new canvas element
    const c = document.createElement('canvas');
    const n = 300;
    c.width = c.height = n;
    c.id = self.crypto.randomUUID();

    // Get the 2D rendering context
    const ctx = c.getContext('2d');
    console.info(0, 0, vertical ? 0 : n, vertical && n)
    const g = ctx.createLinearGradient(0, 0, vertical ? 0 : n, vertical && n);

    if (line) { 
        g.addColorStop(0, colorA);
        g.addColorStop(0.5 - line/2, colorA);
        g.addColorStop(0.5 - line/2, colorB);
        g.addColorStop(0.5 + line/2, colorB);
        g.addColorStop(0.5 + line/2, colorA);
        g.addColorStop(1, colorA);
    } else {
        g.addColorStop(0, colorA);
        g.addColorStop(1, colorB);
    }

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, n, n);
    // document.body.appendChild(c);
    // c.style.position = 'fixed';
    // c.style.top = '0';
    // c.style.left = '0';
    // c.style.zIndex = 100;

    return c;
}
