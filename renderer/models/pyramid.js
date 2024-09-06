// Pyramid
//
//      ^
//     /\\
//    // \ \
//   /+-x-\-+
//  //     \/
//  +------+

export const Pyramid = {
    vertices: [
      -.5,-.5, .5,   .5,-.5, .5,    0, .5,  0,  // Front
       .5,-.5, .5,   .5,-.5,-.5,    0, .5,  0,  // Right
       .5,-.5,-.5,  -.5,-.5,-.5,    0, .5,  0,  // Back
      -.5,-.5,-.5,  -.5,-.5, .5,    0, .5,  0,  // Left
       .5,-.5, .5,  -.5,-.5, .5,  -.5,-.5,-.5, // down
       .5,-.5, .5,  -.5,-.5,-.5,   .5,-.5,-.5
    ],
    uv: [
      0, 0,   1, 0,  .5, 1,  // Front
      0, 0,   1, 0,  .5, 1,  // Right
      0, 0,   1, 0,  .5, 1,  // Back
      0, 0,   1, 0,  .5, 1,  // Left
      1, 1,   0, 1,   0, 0,  // down
      1, 1,   0, 0,   1, 0
    ]
};