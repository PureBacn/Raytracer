#version 450

layout(push_constant) uniform MyPush {
    vec2 resolution;   // 2 floats
} pc;

//layout(location = 0) in vec3 fragColor;
layout(location = 0) out vec4 outColor;

layout(origin_upper_left) in vec4 gl_FragCoord;

void main() {
	vec2 pixel = gl_FragCoord.xy;
	float color = pixel.x/pc.resolution.x;
    outColor = vec4(vec3(color, color, color), 1.0);
}