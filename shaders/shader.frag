#version 450

layout(push_constant) uniform MyPush {
    vec2 resolution;   // 2 floats
} pc;

//layout(location = 0) in vec3 fragColor;
layout(location = 0) out vec4 outColor;

void main() {
	vec2 pixel = gl_FragCoord.xy;
	float color = (pixel.x/pc.resolution.x+1.0)/2.0;
    outColor = vec4(color, color, color, 1.0);
}