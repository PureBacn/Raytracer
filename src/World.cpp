#include <glm/glm.hpp>
#include <iostream>
#include <vector>
#include <array>

#define MAX_OBJECTS 2

struct alignas(16) Material {
	glm::vec3 color = glm::vec3(1.0, 1.0, 1.0);
	glm::vec3 surfaceProp = glm::vec3(0.0, 0.0, 0.0); //emission, reflectiveness, roughness
	glm::vec3 internalProp = glm::vec3(0.0, 0.0, 0.0); // transparency, refrac, scatter
};

// Custom Objects

class alignas(16) Ball {
public:
	uint32_t materialIndex = 0;
	alignas(16) glm::vec3 origin = glm::vec3(0,0,0); // x, y, z
	float radius = 0.0;

	Ball() {}
};

class alignas(16) Camera {
public:
	float fov = 120.0;
	alignas(16) glm::vec3 position = glm::vec3(0,0,20);
	glm::vec4 rotation = glm::vec4(0,0,0,1);

	Camera() {}
	Camera(float fov, glm::vec3 pos, glm::vec4 rot) : fov(fov), position(pos), rotation(rot) {}
};

class alignas(16) World {
public:
	Camera camera;
	alignas(16) std::array<Ball, MAX_OBJECTS> balls;

	World() {}
	World(Camera camera) : camera(camera) {}

	uint32_t getNewBallIndex() {
		uint32_t index = 0;
		for (Ball& ball : balls) {
			if (ball.radius <= 0) return index;
			index += 1;
		}
		return -1;
	}

	void addBall(Ball* ball) {
		balls[getNewBallIndex()] = *ball;
	}
};