import * as THREE from 'three'
import Renderer from './src/Renderer/Renderer';
import BasicTestScene from './src/Scenes/BasicSceneTest';
import BaseScene from './src/Scenes/SceneSetup/BaseScene';

// One large "full screen" renderer for this testing.
class ThreeJSTesting
{
    renderer: Renderer;
    baseScene: BaseScene;

    previousT: number = 0;

    constructor()
    {
      this.baseScene = new BasicTestScene();
      this.renderer = new Renderer();
    }

    async initialize()
    {
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

          this.baseScene.update(delta/1000);
          this.renderer.renderScene();
          this.raf_();          
        });
      }
}

let TestApp = new ThreeJSTesting();
TestApp.initialize();
