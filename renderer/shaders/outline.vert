attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
uniform mat4 uPMatrix;
uniform mat4 uVMatrix;
uniform mat4 uMMatrix;
uniform float uOffset;
void main(void)
{
    gl_Position = uPMatrix * uVMatrix  * uMMatrix *  vec4(aVertexPosition + aVertexNormal * uOffset, 1.0);
}