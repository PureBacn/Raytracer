cmake_minimum_required(VERSION 3.30)

# The toolchain file setup should ideally be in a CMakePresets.json file,
# but we'll keep it here for simplicity
set(CMAKE_TOOLCHAIN_FILE "${CMAKE_CURRENT_SOURCE_DIR}/vcpkg/scripts/buildsystems/vcpkg.cmake"
    CACHE STRING "Vcpkg toolchain file")

project(Raytracer VERSION 1.0)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add dependencies
find_package(Vulkan REQUIRED)
find_package(glm CONFIG REQUIRED)
find_package(glfw3 CONFIG REQUIRED)

# No C++20 modules
set(CMAKE_CXX_SCAN_FOR_MODULES OFF) 

# Raytracer executable
add_executable(Raytracer)

# Raytracer sources and headers
file(GLOB_RECURSE Raytracer_SOURCES CONFIGURE_DEPENDS 
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.h"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.hpp"
    "${CMAKE_CURRENT_SOURCE_DIR}/src/*.inl"
)

target_sources(Raytracer PRIVATE ${Raytracer_SOURCES})

# Raytracer include dirs
target_include_directories(Raytracer PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/src
	${VULKAN_SDK}/Include
)

# Preprocessor defines
target_compile_definitions(Raytracer PRIVATE
    MY_TEST_DEFINE
)

# Automatically links to these libs
target_link_libraries(Raytracer PRIVATE
	glm::glm
	Vulkan::Vulkan
	glfw
)

# Add directories with any random loose .dlls or .libs here
target_link_directories(Raytracer PRIVATE
  
)

# Set configuration properties for Raytracer
if(MSVC)
    target_compile_options(Raytracer PRIVATE
        /W3
        /MP # multithreaded build
        /WX # warnings as errors
        /ZI # program database for edit and continue
    )
else()
    target_compile_options(Raytracer PRIVATE 
        -Wall 
        -Wextra 
        -Wpedantic
    )
endif()

# Set Raytracer as the startup project
set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT Raytracer)

# Filters
source_group(TREE "${CMAKE_CURRENT_SOURCE_DIR}/src" PREFIX "Source Files" FILES ${Raytracer_SOURCES})

# Enable solution folders
set_property(GLOBAL PROPERTY USE_FOLDERS ON)

# Copy Shaders
add_custom_command(TARGET Raytracer POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${CMAKE_SOURCE_DIR}/shaders $<TARGET_FILE_DIR:Raytracer>/shaders
)

message(STATUS "Raytracer sources: ${Raytracer_SOURCES}")