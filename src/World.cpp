#include <glm/glm.hpp>
#include <iostream>
#include <vector>

struct Material {
	glm::vec3 color;
	float emission; // 0.0-1.0
	float reflectiveness; // 0.0-1.0
	float roughness; // 0.0-1.0
	float transparency; // 0.0-1.0
	float refrac; // 0.0-1.0
	float scatter; // 0.0-1.0
};

// Custom Objects

class Object {
public:
	uint32_t materialIndex;

	Object() {

	}
};

class Camera {
	float fov;
	glm::vec3 position;
	glm::vec3 direction;
};

class World {
public:
	Camera camera;
	std::vector<Material> materials;

	World() {

	}
};