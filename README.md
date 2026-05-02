# Raytracer

A basic ray tracing engine written in C++. This project implements the core principles of ray-object intersection, light transport, and realistic shading to generate photorealistic 3D images from scratch.

---

## Features

### Rendering Core
* **Recursive Ray Tracing**: Support for multiple reflection and refraction bounces to simulate complex light paths.
* **Intersection Algorithms**: Mathematically accurate hit detection for primitive shapes, including spheres and planes.
* **Camera Model**: Configurable perspective camera with adjustable field of view and positioning.

### Shading and Materials
* **Phong Reflection Model**: Combines ambient, diffuse, and specular lighting for realistic surface shading.
* **Refraction and Transparency**: Implementation of Snell's Law to simulate light passing through dielectric materials like glass and water.
* **Soft Shadows**: Support for area light sources to produce realistic shadow penumbras.

---

## Technical Overview

The engine operates by casting rays from the camera through each pixel in the viewport. For every ray, the shader performs the following steps:

1. **Intersection Testing**: Determines the closest object hit by the ray.
2. **Shading**: Calculates the local color based on material properties and light source positions.
3. **Recursion**: If the material is reflective or refractive, new rays are spawned, and the process repeats up to a defined maximum depth.
4. **Sampling**: Multiple samples per pixel are averaged to achieve smooth transitions and depth-of-field effects.

---

## Getting Started

### Prerequisites
* A C++17 compatible compiler (GCC, Clang, or MSVC)
* CMake 3.10 or higher

### Building the Project
1. Clone the repository:
   ```bash
   git clone [https://github.com/PureBacn/Raytracer.git](https://github.com/PureBacn/Raytracer.git)
   cd Raytracer
   ```
2. Create a build directory and compile:
   ```bash
   cmake --preset default
   cmake --build . --config Release
   ```
### Running the Renderer

Execute the compiled binary to generate a live render.
  ```bash
  ./Raytracer
  ```
