import {Renderer} from './src/Renderer/Renderer';
import {BaseScene} from './src/Scenes/SceneSetup/BaseScene';
import {LabScene} from './src/Scenes/LabScene';
import Stats from 'stats.js';

/** Entry point for the application */
class ThreeJSAssessment
{
    // ThreeJS Wrappers to use
    private renderer: Renderer;
    private baseScene: BaseScene;

    // Stats.js property for performance tracking
    private stats!: Stats;
    
    private previousT: number = 0;

    constructor()
    {
      this.baseScene = new LabScene();
      this.renderer = new Renderer();
    }


    /** Initialize the application*/
    async Initialize()
    {      
        // Create and add stats to page
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // Create single renderer (Fullscreen)
        this.renderer = new Renderer();        
        this.renderer.Initialize();
        document.body.appendChild(this.renderer.domElement);            

        // Wait for scene to setup
        await this.baseScene.Initialize(this.renderer);

        this.renderer.SetScene(this.baseScene);   
        this.renderer.setClearColor(0x999999, 1.0);

        // Start game loop        
        this.raf_();
    }


    /** EFfectively the game loop.  Used to call the highest level update on the scene and render it */
    raf_() {
      requestAnimationFrame((t) => {    

        let delta: number = t - this.previousT;
        this.previousT = t;

        this.stats.update();

        this.baseScene.Update(delta/1000); // Convert to seconds (I believe this was in MS)
        this.renderer.RenderScene();

        this.raf_();
      });
    }
}

// Setup
let TestApp = new ThreeJSAssessment();
TestApp.Initialize();
