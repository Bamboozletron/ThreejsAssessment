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
    async initialize()
    {      
        // Create and add stats to page
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // Create single renderer (Fullscreen)
        this.renderer = new Renderer();        
        this.renderer.initialize();
        document.body.appendChild(this.renderer.domElement);            

        // Wait for scene to setup
        await this.baseScene.initialize(this.renderer);

        this.renderer.setScene(this.baseScene);   
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

        this.baseScene.update(delta/1000); // Convert to seconds (I believe this was in MS)
        this.renderer.renderScene();

        this.raf_();
      });
    }
}

// Setup
let TestApp = new ThreeJSAssessment();
TestApp.initialize();
