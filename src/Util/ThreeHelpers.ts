import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export async function createCustomMaterial(vshPath: string, fshPath: string):  Promise<THREE.ShaderMaterial>
{
    const vsh = await fetch(vshPath);
    const fsh = await fetch(fshPath);

    const customMaterial = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: await vsh.text(),
        fragmentShader: await fsh.text(),
    });

    return customMaterial;
}

export function LoadAndSplitGLTF(modelPath: string): Promise<Array<THREE.Object3D>>
{
    return new Promise((resolve, reject) => {
        
        const loader = new GLTFLoader();
        loader.load(modelPath, function (gltf)
        {            
            var model = gltf.scene;

            let meshArray: THREE.Object3D[] = [];

            model.children.forEach((o) => 
            {    
                if (o instanceof THREE.Mesh)
                {
                    meshArray.push(o);
                }
            })

            resolve(meshArray);

        }, undefined, function(error)
        {
            reject(error);
        });        
    });    
}

export async function LoadGLTF(modelPath: string)
{
    const loader = new GLTFLoader();
    return loader.loadAsync(modelPath);
}