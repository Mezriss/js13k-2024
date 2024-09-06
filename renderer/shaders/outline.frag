precision highp float;
uniform vec3 uOutLineColor;
void main(void)
{
    gl_FragColor = vec4(uOutLineColor,1.0);
}