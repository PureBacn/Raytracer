#include <glm/glm.hpp>
#include <iostream>
#include <vector>
#include <list>

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
public:
	alignas(16) float fov;
	alignas(16) glm::vec3 position;
	alignas(16) glm::vec4 rotation;

	Camera() : fov(90.0f), position(0.0f,0.0f,20.0f), rotation(0.0f,0.0f,0.0f,1.0f) {}
	Camera(float fov, glm::vec3 pos, glm::vec4 rot) : fov(fov), position(pos), rotation(rot) {}
};

class World {
public:
	Camera camera;
	std::list<Material> materials;
	World() : materials({}) {}
	World(Camera camera, std::list<Material> materials = {}) : camera(camera), materials(materials) {}
};