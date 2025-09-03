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
	Material material;

	Object() {

	}
};

class World {



};