# ThreejsAssessment

### To run:
1. `npm install`
2. `npx tsc`
3. `npx vite` (Default port is 5173)
4. Open `localhost:5173`

### To debug (in VSCode):
1. `npm install`
2. `npx tsc`
3. `npx vite` (Default port is 5173)
4. Use provided launch.json "Launch Chrome against Localhost" option

Example:

https://github.com/Bamboozletron/ThreejsAssessment/assets/163564902/d1a262b3-652e-41d2-9e9d-fcfc9caee7cf


## Basic Scene Setup
Bulk of the work is done in [LabScene.ts](https://github.com/Bamboozletron/ThreejsAssessment/blob/main/src/Scenes/LabScene.ts) which sets up the scene lights / camera / controls.

## Geometry and Materials:
[LabScene.ts](https://github.com/Bamboozletron/ThreejsAssessment/blob/main/src/Scenes/LabScene.ts) Makes use of a basic entity-component framework to handle creating the Lab Scale / Cube / Sphere.  Table was done pre framework setup, but could be moved over (As could the light/camera/controls).  Desk and Scale are loaded in from models, mostly using [MeshPhongMaterial](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial).  The screen for the scale is built from a texture created from a canvas, which is then set for a [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial).

Cube uses a [MeshPhysicalMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial) (Though doesn't seem to have turned out too well), and the Sphere uses a custom [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial) (More explained in Bonus section)

## Interaction
Scale can weigh the objects (Sphere/Cube) on a mouse click.  Clicking an object will either place or remove it from the scale (Cannot add multiple to the scale at once).  On hover, the cube will cycle through hues by changing the color on it's material, the sphere will be given at outline by a custom shader

Mouse wheel will zoom in/out through the orbit controls (Panning/Rotation disabled). Mouse wheel can also be pressed for a smoother zoom.

## Animation
When something is placed on the scale, it will take the current scale value and then lerp to the next target weight over 1 second.  Could use an additional easing on the lerp though so it sort of goes very quick at the beginning then sort of slows down as it "settles"

## Bonus
Custom shader for basic phong reflection shading with an additional outline based on fresnel at [fragment-outline.glsl](https://github.com/Bamboozletron/ThreejsAssessment/blob/main/resources/shaders/fragment-outline.glsl).  Outline is triggered by hovering.

No attempt at loading display

## Extra
Included Stats.js to check framerate, but is disabled by default.  Uncommenting the following line can get it to appear again https://github.com/Bamboozletron/ThreejsAssessment/blob/main/index.ts#L29
