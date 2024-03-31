import * as THREE from 'three'
import {BaseScene} from '../Scenes/SceneSetup/BaseScene'

/** Questionable and small wrapping of THREE.WebGLRenderer.
 * Contains a single scene to be renderer and handles resizing of renderer with page resizing
*/
export class Renderer extends THREE.WebGLRenderer
{
    // Scene to render
    private activeScene!: BaseScene;

    /** Creates a new Renderer with a default empty scene */
    constructor()
    {
        super();
    }
    
    /** Initialize renderer */
    initialize()
    {        
        // Listen for window resize
        window.addEventListener('resize', () =>
        {
            this.onWindowResize();
        }, false);

        this.onWindowResize();
    }

    /** Set which scene for the renderer to render */
    setScene(scene: BaseScene)
    {
        this.activeScene = scene;
    }

    /** Render the scene with the scene's main camera
     * @remarks
     * Assumes scenes only have one "main" camera right now to render to view.
     */
    renderScene()
    {
        this.render(this.activeScene as THREE.Object3D, this.activeScene.mainCamera as THREE.Camera);        
    }

    /** Window resize event, adjust renderer size and adjust the camera if it's a {@link THREE.PerspectiveCamera} */
    onWindowResize()
    {
        this.setSize(window.innerWidth, window.innerHeight);    

        if (this.activeScene)
        {
            if (this.activeScene.mainCamera instanceof THREE.PerspectiveCamera)
            {
                let perspectiveCamera: THREE.PerspectiveCamera = this.activeScene.mainCamera;
                perspectiveCamera.aspect = window.innerWidth / window.innerHeight;        
                perspectiveCamera.updateProjectionMatrix();
            }
        }
    }
}