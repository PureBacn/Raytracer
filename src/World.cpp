#include <glm/glm.hpp>
#include <iostream>
#include <vector>
#include <array>

#define MAXOBJECTS 32

struct alignas(16) Material {
	glm::vec3 color = glm::vec3(1.0, 1.0, 1.0);
	glm::vec3 surfaceProp = glm::vec3(0.0, 0.0, 0.0); //emission, reflectiveness, smoothness
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

class alignas(16) Box {
public:
	uint32_t materialIndex = 0;
	alignas(16) glm::vec3 boxMin = glm::vec3(0,0,0); // x, y, z
	glm::vec3 boxMax = glm::vec3(0,0,0); // x, y, z

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
	alignas(16) std::array<Ball, MAXOBJECTS> balls;
	//alignas(16) std::array<Box, MAXOBJECTS> boxes;

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

	uint32_t getNewBoxIndex() {
		/*uint32_t index = 0;
		for (Box& box : boxes) {
			std::cout << "(" 
				<< box.boxMin.x << ", " << box.boxMin.y << ", " << box.boxMin.z << ") "
				<< "(" << box.boxMax.x << ", " << box.boxMax.y << ", " << box.boxMax.z << ") "
				<< (box.boxMin == box.boxMax)  // prints 0 or 1
				<< std::endl;
			return 0;
			if (box.boxMin == box.boxMax) return index;
			index += 1;
		}*/
		return 0;
	}

	void addBall(Ball* ball) {
		balls[getNewBallIndex()] = *ball;
	}

	void addBox(Box* box) {
		//boxes[getNewBoxIndex()] = *box;
	}
};