import * as THREE from 'three'
import {Renderer} from '../../Renderer/Renderer';

/** Simple wrapping of THREE.Scene
 * @remarks
 * Not 100% if this is necessary or what should live here yet.
 * Overall both this and {@link Renderer} could use anotehr think through
*/
export abstract class BaseScene extends THREE.Scene
{
    /** Get/set the main {@link THREE.Camera} for the scene*/
    MainCamera: THREE.Camera;
    
    /** Creates new BaseScene */
    constructor()
    {
        super();
        this.MainCamera = new THREE.PerspectiveCamera(70, 1920.0 / 1080.0, 0.1, 100); // Default camera, mostly to ensure it has one
    }

    async Initialize(renderer: Renderer)
    {        
    }
    
    Update(delta: number)
    {        
    }
}