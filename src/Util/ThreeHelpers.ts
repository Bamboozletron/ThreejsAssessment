/**
 * Helper utiliy functions related to threejs
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/** Load the GLFT model */
export function LoadGLFT(modelPath: string, object: any)
{
    const loader = new GLTFLoader();
    loader.load(modelPath, function (gltf)
    {            
        object.modelLoaded(gltf);
    }, undefined, function(error)
    {
        console.log(error);
    });
}

/** Remap a lerp to a different range */
export function Remap(value: number, inMin: number, inMax: number, outMin: number, outMax: number)
{    
    const t = THREE.MathUtils.inverseLerp(inMin, inMax, value);
    return THREE.MathUtils.lerp(outMin, outMax, t);
}


/** Async load and split the GLTF model into individual meshes
 * @remarks
 * No longer used because I swapped to non-async for now
 */
// export function LoadAndSplitGLTF(modelPath: string): Promise<Array<THREE.Object3D>>
// {
//     return new Promise((resolve, reject) => {
        
//         const loader = new GLTFLoader();
//         loader.load(modelPath, function (gltf)
//         {            
//             var model = gltf.scene;

//             let meshArray: THREE.Object3D[] = [];

//             model.children.forEach((o) => 
//             {    
//                 if (o instanceof THREE.Mesh)
//                 {
//                     meshArray.push(o);
//                 }
//             })

//             resolve(meshArray);

//         }, undefined, function(error)
//         {
//             reject(error);
//         });        
//     });    
// }

/** Async load the GLTF model
 * @remarks
 * No longer used because I swapped to non-async for now
 */

// export async function LoadGLTF(modelPath: string)
// {
//     const loader = new GLTFLoader();
//     return loader.loadAsync(modelPath);
// }

/** Creates a custom material with the given shaders */

// export async function createCustomMaterial(vshPath: string, fshPath: string):  Promise<THREE.ShaderMaterial>
// {
//     const vsh = await fetch(vshPath);
//     const fsh = await fetch(fshPath);

//     const customMaterial = new THREE.ShaderMaterial({
//         uniforms: {},
//         vertexShader: await vsh.text(),
//         fragmentShader: await fsh.text(),
//     });

//     return customMaterial;
// }