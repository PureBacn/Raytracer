#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>
#include <iostream>

#include <Engine.cpp>

using namespace std;

int main(int argc, char** argv) {
	Resolution res;
	res.width = 1920/2;
	res.height = 1080/2;

	try {
		string title = "Raycaster";
		string renderDeviceName = "NVIDIA GeForce RTX 4050 Laptop GPU";
		Engine engine(res, title, renderDeviceName);

		Material redMaterial;
		redMaterial.color = glm::vec3(1.0f, 0.0f, 0.0f);
		redMaterial.surfaceProp.y = 0;

		engine.addMaterial(redMaterial);

		Material greenMaterial;
		greenMaterial.color = glm::vec3(0.0f, 1.0f, 0.0f);
		greenMaterial.surfaceProp.y = 0;

		engine.addMaterial(greenMaterial);

		Material blueMaterial;
		blueMaterial.color = glm::vec3(0.0f, 0.0f, 1.0f);
		blueMaterial.surfaceProp.y = 0;

		engine.addMaterial(blueMaterial);

		Material lightMaterial;
		lightMaterial.color = glm::vec3(1.0f, 1.0f, 1.0f);
		lightMaterial.surfaceProp.x = 1.0; // Full Emission;

		engine.addMaterial(lightMaterial);

		Material groundMaterial;
		groundMaterial.color = glm::vec3(0.2f, 0.2f, 0.2f);
		groundMaterial.surfaceProp.y = 0;

		engine.addMaterial(groundMaterial);

		Ball* ball0 = new Ball();
		ball0->radius = 2.0f;
		ball0->origin = glm::vec3(0.0f,0.0f,-3.0f);
		
		Ball* ball1 = new Ball();
		ball1->materialIndex = 1;
		ball1->radius = 2.0f;
		ball1->origin = glm::vec3(6.0f, 0.0f, 0.0f);

		Ball* ball2 = new Ball();
		ball2->materialIndex = 2;
		ball2->radius = 2.0f;
		ball2->origin = glm::vec3(-6.0f, 0.0f, 0.0f);

		Ball* ball3 = new Ball();
		ball3->materialIndex = 3;
		ball3->radius = 3.0f;
		ball3->origin = glm::vec3(0.0f, 5.0f, 0.0f);

		engine.addBall(ball0);
		engine.addBall(ball1);
		engine.addBall(ball2);
		engine.addBall(ball3);

		Box* box0 = new Box();
		box0->materialIndex = 4;
		box0->boxMin = glm::vec3(-20,-5,-10);
		box0->boxMax = glm::vec3(20,-3,10);

		engine.addBox(box0);

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
