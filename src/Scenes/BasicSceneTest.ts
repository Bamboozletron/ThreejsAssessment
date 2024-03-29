import * as THREE from 'three'
import StationaryOrbit from '../Camera/StationaryOrbit';

import BaseScene from './SceneSetup/BaseScene'
import Renderer from '../Renderer/Renderer';
import LabScale from '../LabScale';

import * as ThreeHelpers from '../Util/ThreeHelpers';

export default class BasicTestScene extends BaseScene
{
    mainCamera: any;
    orbit: any;

    timeElapsed: number = 0;

    labScale?: LabScale;

    constructor()
    {
        super();
    }
    
    async initialize(renderer: Renderer)
    {
        super.initialize(renderer);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Create basic scene
        this.mainCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100.0);
        this.mainCamera.position.set(0,1.8,3);

        this.orbit = new StationaryOrbit(this.mainCamera, renderer.domElement);
        this.orbit.target.set(0, 1, -2);
        this.orbit.update();

        const ambientLight = new THREE.AmbientLight(0x808080);
        this.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xAAAAAA);
        directionalLight.position.set(-3.0, 4.0, 1.0);        
        directionalLight.castShadow = true;
        this.add(directionalLight);

        const skyboxLoader = new THREE.CubeTextureLoader();
        const texture = skyboxLoader.load([
            './resources/skybox/Cold_Sunset__Cam_2_Left+X.png',
            './resources/skybox/Cold_Sunset__Cam_3_Right-X.png',
            './resources/skybox/Cold_Sunset__Cam_4_Up+Y.png',
            './resources/skybox/Cold_Sunset__Cam_5_Down-Y.png',
            './resources/skybox/Cold_Sunset__Cam_0_Front+Z.png',
            './resources/skybox/Cold_Sunset__Cam_1_Back-Z.png',
        ]);
        this.background = texture;

        
        this.labScale = new LabScale();

        // const cube = new THREE.BoxGeometry();
        // const cubeMesh = new THREE.Mesh(cube);
        // cubeMesh.castShadow = true;
        // cubeMesh.scale.set(0.4, 0.4, 0.4);
        // cubeMesh.position.set(-0.2, 1.5, 0.0);

        // this.add(cubeMesh);

        // Wait for all the loading of models
        await Promise.all([
            this.labScale.initialize(this),
            this.setupTable(),
        ])
    }


    async setupTable()
    {
        const tableModel = await ThreeHelpers.LoadGLTF("./resources/models/table.glb")
        .catch(err => {
            console.log("Error loading model:\n" + err);
        });        

        if (tableModel != null)
        {
            const tableMat = new THREE.MeshPhongMaterial({
                color: 0x996633,            
            });

            tableModel.scene.children.forEach((o) => 
            {    
                if (o instanceof THREE.Mesh)
                {                    
                  o.material = tableMat;
                }
            })

            this.add(tableModel!.scene);
        }
    }    

    update(delta: number)
    {
        this.timeElapsed += delta;        
        this.labScale?.update(delta);
    }
}