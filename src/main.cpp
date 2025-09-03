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
