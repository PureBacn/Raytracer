#include <glm/glm.hpp>
#include <iostream>
#include <vector>

#define MAXOBJECTS 32

struct alignas(16) Material {
	glm::vec3 color = glm::vec3(1.0f, 1.0f, 1.0f);
	glm::vec3 surfaceProp = glm::vec3(0.0f, 0.0f, 0.0f); // emission, reflectiveness, smoothness
	glm::vec3 internalProp = glm::vec3(0.0f, 0.0f, 0.0f); // transparency, refrac, scatter
};

// Custom Objects

class alignas(16) Ball {
public:
	uint32_t materialIndex = 0;
	alignas(16) glm::vec3 origin = glm::vec3(0.0f,0.0f,0.0f); // x, y, z
	float radius = 0.0;

	Ball() {}
};

class alignas(16) Box {
public:
	uint32_t materialIndex = 0;
	alignas(16) glm::vec3 boxMin = glm::vec3(0.0f,0.0f,0.0f); // x, y, z
	alignas(16) glm::vec3 boxMax = glm::vec3(0.0f,0.0f,0.0f); // x, y, z

	Box() {}
};

class alignas(16) Camera {
public:
	float fov = 90.0;
	alignas(16) glm::vec3 position = glm::vec3(0,0,10);
	glm::vec4 rotation = glm::vec4(0,0,0,1);

	Camera() {}
	Camera(float fov, glm::vec3 pos, glm::vec4 rot) : fov(fov), position(pos), rotation(rot) {}
};

class alignas(16) World {
public:
	Camera camera;
	alignas(16) std::vector<Ball> balls;
	alignas(16) std::vector<Box> boxes;

	World() {}
	World(Camera camera) : camera(camera) {}

	void addBall(Ball* ball) {
		balls.push_back(*ball);
	}

	void addBox(Box* box) {
		boxes.push_back(*box);
	}
};