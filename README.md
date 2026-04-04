# Raytracer

A simple raytracer that renders 3D scenes into images by simulating how rays of light interact with objects.

---

## Overview
This project implements a basic **ray tracing renderer**, a technique used to generate realistic images by simulating the physical behavior of light.

The renderer works by casting rays from a virtual camera into a scene and computing how those rays interact with objects and light sources.

---

## Features
- Ray-object intersection
- Diffuse shading
- Shadows using secondary rays
- Real time image output

---

## How It Works

### 1. Ray Generation
For each pixel, rays are generated from the camera through the image plane.

### 2. Intersection
Each ray is tested against all objects in the scene to find the closest intersection.

### 3. Shading
The color at the intersection point is computed based on the properties of the object it hit.

### 4. Display
Calculated colors are displayed on the screen using a shader.
