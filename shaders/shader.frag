#version 450

#define PI 3.1415926538
#define MAXMATERIALS 32
#define MAXOBJECTS 64
#define RAYSPERPIXEL 50
#define BOUNCEDEPTH 200 // How many times can rays bounce

struct Material {
	vec3 color;
	float emission; // 0.0-1.0
	float reflectiveness; // 0.0-1.0
	float smoothness; // 0.0-1.0
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

struct Box {
	uint materialIndex;
	vec3 boxMin;
	vec3 boxMax;
};

// Inputs
layout(set = 0, binding = 0) uniform Materials {
	Material materials[MAXMATERIALS];
};

layout(set = 1, binding = 0) uniform World {
	Camera camera;
};

layout(set = 2, binding = 0) uniform Balls {
	Ball balls[MAXOBJECTS];
};

layout(set = 3, binding = 0) uniform Boxes {
	Box boxes[MAXOBJECTS];
};

layout(push_constant) uniform PushConstants {
	vec2 resolution;   // 2 floats
	uint frame;
};

layout(origin_upper_left) in vec4 gl_FragCoord;

// Outputs
layout(location = 0) out vec4 outColor;

struct Ray {
	vec3 dir;
	vec3 origin;
};

struct RaycastResult {
	bool hit;
	Ray incoming;
	Ray normal;
	uint materialIndex;
	float t;
};

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
	// Ray generation from:
	// https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-overview/light-transport-ray-tracing-whitted.html
	
	float aspectRatio = resolution.x/resolution.y;
	vec2 screen = toScreenSpace(screenxy);
	vec3 dir = vec3(screen.x * tan(camera.fov/2*PI/180) * aspectRatio, screen.y * tan(camera.fov/2*PI/180), -1);
	Ray ray = Ray(normalize(dir), camera.position);
	//rotateRay(ray, cam.rotation);
	return ray;
}

float fresnelSchlick(float cosTheta, float r) {
	return r + (1.0 - r) * pow(1.0 - cosTheta, 5.0);
}

// PCG www.pcg-random.org
float rand(inout uint state) {
	state = state * 747796405 + 2891336453;
	uint result = ((state >> ((state >> 28) + 4)) ^ state) * 277803737;
	result = (result >> 22) ^ result;
   	float randOut = float(result) / 4294967295.0;
	return clamp(randOut, 1e-6, 1.0 - 1e-6);
}

float boxMuller(inout uint seed) {
	// Box muller
	// https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform

	float theta = 2 * PI * rand(seed);
	float rho = sqrt(-2 * log(rand(seed)));
	return rho * cos(theta);
}

vec3 getRandomPoint(inout uint seed, Ray normal) {
	vec3 dir = normalize(vec3(boxMuller(seed), boxMuller(seed), boxMuller(seed)));
	if (dir == vec3(0,0,0)) dir = vec3(1,1,1);

	return normalize(normal.dir + dir);
}

vec3 getRandomHemisphere(inout uint seed, Ray normal) {
	vec3 point = getRandomPoint(seed, normal);
	return dot(point, normal.dir) > 0 ? point : -point;
}

Ray nextRayPath(inout uint seed, RaycastResult result) {
	Material material = materials[result.materialIndex];
	float fs = fresnelSchlick(dot(-result.incoming.dir, result.normal.dir), material.reflectiveness);

	Ray ray;
	ray.origin = result.normal.origin + 0.001 * result.normal.dir;

	if (rand(seed) < fs) {
		// Specular reflection (glossy)
		vec3 perfect = reflect(-result.incoming.dir, result.normal.dir);
		ray.dir = normalize(perfect + (1 - material.smoothness) * getRandomPoint(seed, result.normal));
	} else {
		// Diffuse bounce
		ray.dir = getRandomHemisphere(seed, result.normal);
	}
	return ray;
}

RaycastResult raycast(Ray ray, Box box)
{	
	RaycastResult result;
	result.hit = false;
	
	vec3 invDir = 1 / ray.dir;
	vec3 tMin = (box.boxMin - ray.origin) * invDir;
	vec3 tMax = (box.boxMax - ray.origin) * invDir;
	vec3 t1 = min(tMin, tMax);
	vec3 t2 = max(tMin, tMax);
	float tNear = max(max(t1.x, t1.y), t1.z);
	float tFar = min(min(t2.x, t2.y), t2.z);

	if (tNear <= tFar && tNear >= 0.0) {
		vec3 hit = ray.origin + tNear * ray.dir;
		vec3 normal = vec3(0.0);

		if (tNear == t1.x) normal.x = (invDir.x < 0.0) ? 1.0 : -1.0;
		else if (tNear == t1.y) normal.y = (invDir.y < 0.0) ? 1.0 : -1.0;
		else if (tNear == t1.z) normal.z = (invDir.z < 0.0) ? 1.0 : -1.0;

		result.hit = true;
		result.materialIndex = box.materialIndex;
		result.incoming = ray;
		result.normal = Ray(normal, hit);
		result.t = tNear;
	}

	return result;
}

RaycastResult raycast(Ray ray, Ball ball) {
	// Mathematical formulas from:
	// https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection.html

	RaycastResult result;
	result.hit = false;
	vec3 l = ball.origin - ray.origin; // Vector from ray org to ball org
	
	float tca = dot(l, ray.dir); // Projected Vector
	float d2 = dot(l, l) - tca * tca; // Dist from ball org

	if (d2 > ball.radius * ball.radius) return result; // Outside of ball
	
	float thc = sqrt(ball.radius * ball.radius - d2); // 1/2 of distance from edge to tangent of ray line
	float t0 = tca - thc; // First Intersection
	float t1 = tca + thc; // Second Intersection

	if (t0 < 0.0 && t1 < 0.0) return result; // Ball behind ray

	float t = t0 < 0 ? t1 : t0;

	vec3 hit = ray.origin + t * ray.dir;
	vec3 normal = normalize(hit - ball.origin);

	result.hit = true;
	result.incoming = ray;
	result.materialIndex = ball.materialIndex;
	result.normal = Ray(normal, hit);
	result.t = t;

	return result;
}

RaycastResult intersectScene(Ray ray) {
	RaycastResult result;
	result.hit = false;
	for (uint i = 0; i < MAXOBJECTS; i++) { // Find closest ball hit (no culling)
		Ball ball = balls[i];
		if (ball.radius <= 0.0f) break;

		RaycastResult contend = raycast(ray, ball);
		if (!contend.hit) continue;
		if (!result.hit || contend.t < result.t) {
			result = contend;
		}
	}

	for (uint i = 0; i < MAXOBJECTS; i++) { // Find closest box hit (no culling)
		Box box = boxes[i];
		if (box.boxMin == box.boxMax) break;

		RaycastResult contend = raycast(ray, box);
		if (!contend.hit) continue;
		if (!result.hit || contend.t < result.t) {
			result = contend;
		}
	}

	return result;
}

vec3 findColor(inout uint seed, Ray ray) {
	vec3 throughput = vec3(1.0);
	vec3 color = vec3(0.0);

	for (uint i = 0; i < BOUNCEDEPTH; i++) {
		RaycastResult result = intersectScene(ray);

		if (result.hit) {
			Material material = materials[result.materialIndex];
			//return material.color;

			color += material.color * throughput * material.emission;
			throughput *= material.color;
			ray = nextRayPath(seed, result);
		} else {
			vec3 environment = vec3(0,0,0); // mix(vec3(0.05, 0.1, 0.25), vec3(0.1), ray.dir.y * 0.5 + 0.5); // Environment gradient
			color += throughput * environment; // Pass atmosphere color
			break;
		}
	}
	return color;
}


void main() {
	vec3 color = vec3(0.0,0.0,0.0);
	
	uint seed = uint(gl_FragCoord.x + gl_FragCoord.y * resolution.x) + frame * 719393;; // + frame * 719393;
	for (uint i = 0; i < RAYSPERPIXEL; i++) {
		vec2 jitter;
		jitter.x = rand(seed);
		jitter.y = rand(seed);
		Ray ray = toWorldPosition(gl_FragCoord.xy + jitter);
		color += findColor(seed, ray);
	}

	color /= RAYSPERPIXEL;

	Ball ball = balls[0];
	if (ball.origin.z == -3.0) {
		//color = vec3(1);
	}

	outColor = vec4(color, 1.0);
}