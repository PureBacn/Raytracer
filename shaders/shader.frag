#version 450

#define PI 3.1415926538
#define MAX_MATERIALS 64
#define MAX_OBJECTS 2

struct Material {
	vec3 color;
	float emission; // 0.0-1.0
	float reflectiveness; // 0.0-1.0
	float roughness; // 0.0-1.0
	float transparency; // 0.0-1.0
	float refrac; // 0.0-1.0
	float scatter; // 0.0-1.0
};

struct Camera {
	float fov;
	vec3 position;
	vec4 rotation;
};

struct Ball {
	uint materialIndex;
	vec3 origin;
	float radius;
};

struct Ray {
	vec3 dir;
	vec3 origin;
};

// Inputs
layout(set = 0, binding = 0) uniform Materials {
	Material materials[MAX_MATERIALS];
};

layout(set = 1, binding = 0) uniform World {
	Camera camera;
	Ball balls[MAX_OBJECTS];
};

layout(push_constant) uniform PushConstants {
    vec2 resolution;   // 2 floats
};

layout(origin_upper_left) in vec4 gl_FragCoord;

// Outputs
layout(location = 0) out vec4 outColor;

vec4 multQuat(vec4 q1, vec4 q2) {
	return vec4(
        q1.w*q2.x + q1.x*q2.w + q1.y*q2.z - q1.z*q2.y,
        q1.w*q2.y - q1.x*q2.z + q1.y*q2.w + q1.z*q2.x,
        q1.w*q2.z + q1.x*q2.y - q1.y*q2.x + q1.z*q2.w,
        q1.w*q2.w - q1.x*q2.x - q1.y*q2.y - q1.z*q2.z
    );
}

vec4 conjQuat(vec4 q) {
	return vec4( -vec3(q.x, q.y, q.z), q.w);
}

void rotateRay(inout Ray ray, vec4 q) {
	q = normalize(q);
	vec4 normRay = vec4(ray.dir,0);
	vec4 rotatedRay = multQuat(multQuat(q, normRay), conjQuat(q)); // q*v*q'
	ray.dir = normalize(vec3(rotatedRay.x, rotatedRay.y, rotatedRay.z));
}

vec2 toScreenSpace(vec2 xy) {
	vec2 ndc = vec2((xy.x+0.5)/resolution.x, (xy.y+0.5)/resolution.y); // To NDC Space
	vec2 screen = vec2(ndc.x*2-1,1-ndc.y*2); // To Screen Space
	return screen;
}

Ray toWorldPosition(vec2 screenxy) {
	float aspectRatio = resolution.x/resolution.y;
	vec2 screen = toScreenSpace(screenxy);
	vec3 dir = vec3(screen.x * tan(camera.fov/2*PI/180) * aspectRatio, screen.y * tan(camera.fov/2*PI/180), -1);
	Ray ray = Ray(normalize(dir), camera.position);
	//rotateRay(ray, cam.rotation);
	return ray;
}

bool intersects(Ray ray, Ball ball) {
	vec3 l = ball.origin - ray.origin; // Vector from ray org to ball org
	float tca = dot(l, ray.dir); // Projected Vector
	float d2 = dot(l, l) - tca * tca; // Dist from ball org

	if (d2 > ball.radius * ball.radius) return false; // Outside of ball
	
	float thc = sqrt(ball.radius * ball.radius - d2); // 1/2 of distance from edge to tangent of ray line
	float t0 = tca - thc; // First Intersection
	float t1 = tca + thc; // Second Intersection

	if (t0 < 0.0 && t1 < 0.0) return false; // Ball behind ray

	return true;
}
//Ball ball = Ball(0, vec3(0,0,0), 2.0);

void main() {
	Ray ray = toWorldPosition(gl_FragCoord.xy);

	vec3 color = vec3(0.0,0.0,0.0);

	for (uint i = 0; i < MAX_OBJECTS; i++) {
		Ball ball = balls[i];
		if (ball.radius <= 0.0f) break;
		if (intersects(ray, ball)) {
			Material material = materials[ball.materialIndex];
			color = material.color;
		}
	}

	if (camera.position.z == 20) {
		//color = vec3(0,1,0);
	}

	outColor = vec4(color, 1.0);
}