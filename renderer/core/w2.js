// WebGL framework
// ===============
import baseVertex from '../shaders/base.vert'
import baseFragment from '../shaders/base.frag'

export default class W2 {
    debug = false;
    current = {};
    next = {};
    textures = {};
    objs = 0;
    clearColor = "#000000";
    // List of 3D models that can be rendered by the framework
    // (See the end of the file for built-in models: plane, billboard, cube, pyramid...)
    models = {};
    lastFrame = 0;

    constructor(options) {
        this.debug = options.debug;
        this.canvas = options.canvas;
        this.clearColor = options.clearColor || this.clearColor;
        this.gl = this.canvas.getContext('webgl2');

        this.gl.blendFunc(770 /* SRC_ALPHA */, 771 /* ONE_MINUS_SRC_ALPHA */);

        // Enable texture 0
        this.gl.activeTexture(33984 /* TEXTURE0 */);

        // Hide polygons back-faces (optional)
        this.gl.enable(2884 /* CULL_FACE */);

        this.#prepageBaseShader();
        
        this.gl.useProgram(this.program);
        if (this.debug) console.log('program:', this.gl.getProgramInfoLog(this.program) || 'OK');

        // Set the scene's background color (RGBA)
        this.gl.clearColor(...this.col(this.clearColor));

        // Enable fragments depth sorting
        // (the fragments of close objects will automatically overlap the fragments of further objects)
        this.gl.enable(2929 /* DEPTH_TEST */);

        // When everything is loaded: set default light / camera
        this.light(options.light || { y: -1 });
        this.camera(options.camera || { fov: 30 });
    }

    #createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (this.debug) console.log('shader:', this.gl.getShaderInfoLog(shader) || 'OK');
        return shader;
    }

    #prepageBaseShader() {
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.#createShader(35633 /* VERTEX_SHADER */, baseVertex));
        this.gl.attachShader(this.program, this.#createShader(35632 /* FRAGMENT_SHADER */, baseFragment));
        this.gl.linkProgram(this.program);
    }

    // Set a state to an object
    setState(state, type, texture) {

        // Custom name or default name ('o' + auto-increment)
        state.id ||= 'o' + this.objs++;

        // Size sets w, h and d at once (optional)
        if (state.size) state.w = state.h = state.d = state.size;

        // If a new texture is provided, build it and save it in this.textures
        if (state.t && state.t.width && !this.textures[state.t.id]) {
            texture = this.gl.createTexture();
            this.gl.pixelStorei(37441 /* UNPACK_PREMULTIPLY_ALPHA_WEBGL */, true);
            this.gl.bindTexture(3553 /* TEXTURE_2D */, texture);
            this.gl.pixelStorei(37440 /* UNPACK_FLIP_Y_WEBGL */, 1);
            this.gl.texImage2D(3553 /* TEXTURE_2D */, 0, 6408 /* RGBA */, 6408 /* RGBA */, 5121 /* UNSIGNED_BYTE */, state.t);
            this.gl.generateMipmap(3553 /* TEXTURE_2D */);
            this.textures[state.t.id] = texture;
        }

        // Recompute the projection matrix if fov is set (near: 1, far: 1000, ratio: canvas ratio)
        if (state.fov) {
            this.projection =
                new DOMMatrix([
                    (1 / Math.tan(state.fov * Math.PI / 180)) / (this.canvas.width / this.canvas.height), 0, 0, 0,
                    0, (1 / Math.tan(state.fov * Math.PI / 180)), 0, 0,
                    0, 0, -1001 / 999, -1,
                    0, 0, -2002 / 999, 0
                ]);
        }

        // Save object's type,
        // merge previous state (or default state) with the new state passed in parameter,
        // and reset f (the animation timer)
        state = { type, ...(this.current[state.id] = this.next[state.id] || { w: 1, h: 1, d: 1, x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, b: '888', mode: 4, mix: 0 }), ...state, f: 0 };

        // Build the model's vertices buffer if it doesn't exist yet
        const m = this.models[state.type];
        if (m) {
            if (m.vertices && !m.verticesBuffer) {
                this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, m.verticesBuffer = this.gl.createBuffer());
                this.gl.bufferData(34962 /* ARRAY_BUFFER */, new Float32Array(m.vertices), 35044 /*STATIC_DRAW*/);

                // Compute smooth normals if they don't exist yet (optional)
                if (!m.normals && this.smooth) this.smooth(state);

                // Make a buffer from the smooth/custom normals (if any)
                if (m.normals) {
                    this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, m.normalsBuffer = this.gl.createBuffer());
                    this.gl.bufferData(34962 /* ARRAY_BUFFER */, new Float32Array(m.normals.flat()), 35044 /*STATIC_DRAW*/);
                }
            }

            // Build the model's uv buffer (if any) if it doesn't exist yet
            if (m.uv && !m.uvBuffer) {
                this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, m.uvBuffer = this.gl.createBuffer());
                this.gl.bufferData(34962 /* ARRAY_BUFFER */, new Float32Array(m.uv), 35044 /*STATIC_DRAW*/);
            }

            // Build the model's index buffer (if any) and smooth normals if they don't exist yet
            if (m.indices && !m.indicesBuffer) {
                this.gl.bindBuffer(34963 /* ELEMENT_ARRAY_BUFFER */, m.indicesBuffer = this.gl.createBuffer());
                this.gl.bufferData(34963 /* ELEMENT_ARRAY_BUFFER */, new Uint16Array(m.indices), 35044 /* STATIC_DRAW */);
            }
        }


        // Set mix to 1 if no texture is set
        if (!state.t) {
            state.mix = 1;
        }

        // set mix to 0 by default if a texture is set
        else if (state.t && !state.mix) {
            state.mix = 0;
        }

        // Save new state
        this.next[state.id] = state;
    }

    // Draw the scene
    draw(now, dt) {
        // Loop and measure time delta between frames
        dt ||= now - this.lastFrame;

        this.lastFrame = now;

        if (this.next.camera?.g) {
            this.render(this.next[this.next.camera.g], dt, 1);
        }

        // Create a matrix called v containing the current camera transformation
        const v = this.animation('camera');

        // If the camera is in a group
        if (this.next?.camera?.g) {

            // premultiply the camera matrix by the group's model matrix.
            v.preMultiplySelf(this.next[this.next.camera.g].M || this.next[this.next.camera.g].m);
        }

        // Send it to the shaders as the Eye matrix
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.program, 'eye'),
            false,
            v.toFloat32Array()
        );

        // Invert it to obtain the View matrix
        v.invertSelf();

        // Premultiply it with the Perspective matrix to obtain a Projection-View matrix
        v.preMultiplySelf(this.projection);

        // send it to the shaders as the pv matrix
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.program, 'pv'),
            false,
            v.toFloat32Array()
        );

        // Clear canvas
        this.gl.clear(16640 /* this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT */);


        const transparent = [];
        // Render all the objects in the scene
        for (let i in this.next) {

            // Render the shapes with no texture and no transparency (RGB1 color)
            if (!this.next[i].t && this.col(this.next[i].b)[3] == 1) {
                this.render(this.next[i], dt);
            }

            // Add the objects with transparency (RGBA or texture) in an array
            else {
                transparent.push(this.next[i]);
            }
        }

        // Order transparent objects from back to front
        transparent.sort((a, b) => {
            // Return a value > 0 if b is closer to the camera than a
            // Return a value < 0 if a is closer to the camera than b
            return this.dist(b) - this.dist(a);
        });

        // Enable alpha blending
        this.gl.enable(3042 /* BLEND */);

        // Render all transparent objects
        for (let i of transparent) {

            // Disable depth buffer write if it's a plane or a billboard to allow transparent objects to intersect planes more easily
            if (["plane", "billboard"].includes(i.type)) this.gl.depthMask(0);

            this.render(i, dt);

            this.gl.depthMask(1);
        }

        // Disable alpha blending for the next frame
        this.gl.disable(3042 /* BLEND */);

        // Transition the light's direction and send it to the shaders
        this.gl.uniform3f(
            this.gl.getUniformLocation(this.program, 'light'),
            this.lerp('light', 'x'), this.lerp('light', 'y'), this.lerp('light', 'z')
        );
    }

    // Render an object
    render(object, dt) {

        // If the object has a texture
        if (object.t) {

            // Set the texture's target (2D or cubemap)
            this.gl.bindTexture(3553 /* TEXTURE_2D */, this.textures[object.t.id]);

            // Pass texture 0 to the sampler
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, 'sampler'), 0);
        }

        // If the object has an animation, increment its timer...
        if (object.f < object.a) object.f += dt;

        // ...but don't let it go over the animation duration.
        if (object.f > object.a) object.f = object.a;

        // Compose the model matrix from lerped transformations
        this.next[object.id].m = this.animation(object.id);

        // If the object is in a group:
        if (this.next[object.g]) {

            // premultiply the model matrix by the group's model matrix.
            this.next[object.id].m.preMultiplySelf(this.next[object.g].M || this.next[object.g].m);
        }

        // send the model matrix to the vertex shader
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.program, 'm'),
            false,
            (this.next[object.id].M || this.next[object.id].m).toFloat32Array()
        );

        // send the inverse of the model matrix to the vertex shader
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.program, 'im'),
            false,
            (new DOMMatrix(this.next[object.id].M || this.next[object.id].m)).invertSelf().toFloat32Array()
        );

        // Don't render invisible items (camera, light, groups, camera's parent)
        if (['camera', 'light', 'group'].includes(object.type)) return;

        let buffer;

        // Set up the position buffer
        this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.models[object.type].verticesBuffer);
        this.gl.vertexAttribPointer(buffer = this.gl.getAttribLocation(this.program, 'pos'), 3, 5126 /* FLOAT */, false, 0, 0)
        this.gl.enableVertexAttribArray(buffer);

        // Set up the texture coordinatess buffer (if any)
        if (this.models[object.type].uvBuffer) {
            this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.models[object.type].uvBuffer);
            this.gl.vertexAttribPointer(buffer = this.gl.getAttribLocation(this.program, 'uv'), 2, 5126 /* FLOAT */, false, 0, 0);
            this.gl.enableVertexAttribArray(buffer);
        }

        // Set the normals buffer
        if ((object.s || this.models[object.type].customNormals) && this.models[object.type].normalsBuffer) {
            this.gl.bindBuffer(34962 /* ARRAY_BUFFER */, this.models[object.type].normalsBuffer);
            this.gl.vertexAttribPointer(buffer = this.gl.getAttribLocation(this.program, 'normal'), 3, 5126 /* FLOAT */, false, 0, 0);
            this.gl.enableVertexAttribArray(buffer);
        }

        // Other options: [smooth, shading enabled, ambient light, texture/color mix]
        this.gl.uniform4f(
            this.gl.getUniformLocation(this.program, 'o'),
            // Enable smooth shading if "s" is true
            object.s,
            // Enable shading if in TRIANGLE* mode and object.ns disabled
            ((object.mode > 3) || (this.gl[object.mode] > 3)) && !object.ns ? 1 : 0,
            // Ambient light
            this.ambientLight || 0.2,
            // Texture/color mix (if a texture is present. 0: fully textured, 1: fully colored)
            object.mix
        );

        // If the object is a billboard: send a specific uniform to the shaders:
        // [width, height, isBillboard = 1, 0]
        this.gl.uniform4f(
            this.gl.getUniformLocation(this.program, 'bb'),
            // Size
            object.w,
            object.h,
            // is a billboard
            object.type == 'billboard',
            // Reserved
            0
        );

        // Set up the indices (if any)
        if (this.models[object.type].indicesBuffer) {
            this.gl.bindBuffer(34963 /* ELEMENT_ARRAY_BUFFER */, this.models[object.type].indicesBuffer);
        }

        // Set the object's color
        this.gl.vertexAttrib4fv(
            this.gl.getAttribLocation(this.program, 'col'),
            this.col(object.b)
        );

        // Draw
        // Both indexed and unindexed models are supported.
        // You can keep the "drawElements" only if all your models are indexed.
        if (this.models[object.type].indicesBuffer) {
            this.gl.drawElements(+object.mode || this.gl[object.mode], this.models[object.type].indices.length, 5123 /* UNSIGNED_SHORT */, 0);
        }
        else {
            this.gl.drawArrays(+object.mode || this.gl[object.mode], 0, this.models[object.type].vertices.length / 3);
        }

    }

    // Helpers
    // -------

    // Interpolate a property between two values
    lerp = (item, property) =>
        this.next[item]?.a
            ? this.current[item][property] + (this.next[item][property] - this.current[item][property]) * (this.next[item].f / this.next[item].a)
            : this.next[item][property];

    // Transition an item
    animation = (item, m = new DOMMatrix) =>
        this.next[item]
            ? m
                .translateSelf(this.lerp(item, 'x'), this.lerp(item, 'y'), this.lerp(item, 'z'))
                .rotateSelf(this.lerp(item, 'rx'), this.lerp(item, 'ry'), this.lerp(item, 'rz'))
                .scaleSelf(this.lerp(item, 'w'), this.lerp(item, 'h'), this.lerp(item, 'd'))
            : m;

    // Compute the distance squared between two objects (useful for sorting transparent items)
    dist = (a, b = this.next.camera) => a?.m && b?.m ? (b.m.m41 - a.m.m41) ** 2 + (b.m.m42 - a.m.m42) ** 2 + (b.m.m43 - a.m.m43) ** 2 : 0;

    // Set the ambient light level (0 to 1)
    ambient = a => this.ambientLight = a;

    // Convert an rgb/rgba hex string into a vec4
    col = c => [...c.replace("#", "").match(c.length < 5 ? /./g : /../g).map(a => ('0x' + a) / (c.length < 5 ? 15 : 255)), 1]; // rgb / rgba / rrggbb / rrggbbaa

    // Add a new 3D model
    add(name, objects) {
        this.models[name] = objects;
        if (objects.normals) {
            this.models[name].customNormals = 1;
        }
        this[name] = settings => this.setState(settings, name);
    };

    // Built-in objects
    // ----------------

    group(t) { this.setState(t, 'group') }

    move(t, delay) {setTimeout(() => { this.setState(t) }, delay || 1) };

    delete(t, delay) { setTimeout(() => { delete this.next[t] }, delay || 1) };

    camera(t, delay) { setTimeout(() => { this.setState(t, t.id = 'camera') }, delay || 1) };

    light(t, delay) { delay ? setTimeout(() => { this.setState(t, t.id = 'light') }, delay) : this.setState(t, t.id = 'light') };

    // Smooth normals computation plug-in (optional)
    // =============================================


    smooth(state, dict = {}, vertices = [], iterate, iterateSwitch, i, j, A, B, C, Ai, Bi, Ci, normal) {

        const m = this.models[state.type];
        // Prepare smooth normals array
        m.normals = [];

        // Fill vertices array: [[x,y,z],[x,y,z]...]
        for (i = 0; i < m.vertices.length; i += 3) {
            vertices.push(m.vertices.slice(i, i + 3));
        }

        // Iterator
        if (iterate = m.indices) iterateSwitch = 1;
        else iterate = vertices, iterateSwitch = 0;

        // Iterate twice on the vertices
        // - 1st pass: compute normals of each triangle and accumulate them for each vertex
        // - 2nd pass: save the final smooth normals values
        for (let i = 0; i < iterate.length * 2; i += 3) {
            let j, A, B, C, Ai, Bi, Ci, normal, AB, BC;
            j = i % iterate.length;
            A = vertices[Ai = iterateSwitch ? m.indices[j] : j];
            B = vertices[Bi = iterateSwitch ? m.indices[j + 1] : j + 1];
            C = vertices[Ci = iterateSwitch ? m.indices[j + 2] : j + 2];
            AB = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
            BC = [C[0] - B[0], C[1] - B[1], C[2] - B[2]];
            normal = i > j ? [0, 0, 0] : [AB[1] * BC[2] - AB[2] * BC[1], AB[2] * BC[0] - AB[0] * BC[2], AB[0] * BC[1] - AB[1] * BC[0]];
            dict[A[0] + "_" + A[1] + "_" + A[2]] ||= [0, 0, 0];
            dict[B[0] + "_" + B[1] + "_" + B[2]] ||= [0, 0, 0];
            dict[C[0] + "_" + C[1] + "_" + C[2]] ||= [0, 0, 0];
            m.normals[Ai] = dict[A[0] + "_" + A[1] + "_" + A[2]] = dict[A[0] + "_" + A[1] + "_" + A[2]].map((a, i) => a + normal[i]);
            m.normals[Bi] = dict[B[0] + "_" + B[1] + "_" + B[2]] = dict[B[0] + "_" + B[1] + "_" + B[2]].map((a, i) => a + normal[i]);
            m.normals[Ci] = dict[C[0] + "_" + C[1] + "_" + C[2]] = dict[C[0] + "_" + C[1] + "_" + C[2]].map((a, i) => a + normal[i]);
        }
    }

};
