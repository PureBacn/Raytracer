#version 450

layout(set = 0, binding = 0) uniform CameraData {
    mat4 viewProj;
} cam;

layout(push_constant) uniform PushConstants {
    vec2 resolution;   // 2 floats
} pc;

layout(location = 0) out vec4 outColor;

layout(origin_upper_left) in vec4 gl_FragCoord;

struct Camera {
	vec3 position;
	vec3 direction;
};

vec3 toWorldPosition() {
	return vec3(0,0,0);
}

void main() {
	vec2 pixel = gl_FragCoord.xy;
	float color = pixel.y/pc.resolution.y;
    outColor = vec4(vec3(color, color, color), 1.0);
}