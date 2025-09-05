#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>
#include <iostream>

#include <Engine.cpp>

using namespace std;

int main(int argc, char** argv) {
	Resolution res;
	res.width = 640;
	res.height = 380;

	try {
		string title = "Raycaster";
		string renderDeviceName = "NVIDIA GeForce RTX 4050 Laptop GPU";
		Engine engine(res, title, renderDeviceName);

		Material defaultMaterial;
		defaultMaterial.color = glm::vec3(0.0f, 0.5f, 0.0f);

		engine.addMaterial(defaultMaterial);

		Material redMaterial;
		redMaterial.color = glm::vec3(0.5f, 0.0f, 0.0f);

		engine.addMaterial(redMaterial);

		Ball* ball0 = new Ball();
		ball0->radius = 2.0f;
		ball0->origin = glm::vec3(0.0f,0.0f,0.0f);
		
		Ball* ball1 = new Ball();
		ball1->materialIndex = 1;
		ball1->radius = 3.0f;
		ball1->origin = glm::vec3(6.0f, 0.0f, 0.0f);

		engine.addBall(ball0);
		engine.addBall(ball1);

		engine.createWindow();
		engine.initVulkan();
		engine.run();
	}
	catch (const exception& e) {
		cerr << "Error: " << e.what() << endl;
		return -1;
	}

	return 0;
}
