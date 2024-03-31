import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { inverseLerp } from 'three/src/math/MathUtils';

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

// Non-async, specify onLoad
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


// Async, maybe not used anymore? TBD if I go back and switch more stuff to async
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

export function Remap(value: number, inMin: number, inMax: number, outMin: number, outMax: number)
{    
    const t = THREE.MathUtils.inverseLerp(inMin, inMax, value);
    return THREE.MathUtils.lerp(outMin, outMax, t);
}