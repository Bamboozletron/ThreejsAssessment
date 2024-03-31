import * as THREE from 'three'
import Renderer from './src/Renderer/Renderer';
import BasicTestScene from './src/Scenes/BasicSceneTest';
import BaseScene from './src/Scenes/SceneSetup/BaseScene';
import Stats from 'stats.js';

// One large "full screen" renderer for this
class ThreeJSAssessment
{
    renderer: Renderer;
    baseScene: BaseScene;

    previousT: number = 0;

    stats!: Stats;

    constructor()
    {
      this.baseScene = new BasicTestScene();
      this.renderer = new Renderer();
    }

    async initialize()
    {      

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        // Create single renderer set as full screen
        this.renderer = new Renderer();        
        this.renderer.initialize();

        document.body.appendChild(this.renderer.domElement);            

        await this.baseScene.initialize(this.renderer);

        this.renderer.activeScene = this.baseScene;    
        this.renderer.setClearColor(0x999999, 1.0);

        // Start game loop        
        this.raf_();

    }

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

let TestApp = new ThreeJSAssessment();
TestApp.initialize();
