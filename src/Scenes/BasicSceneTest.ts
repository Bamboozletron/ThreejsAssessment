import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import StationaryOrbit from '../Camera/StationaryOrbit';
import BaseScene from './SceneSetup/BaseScene'
import Renderer from '../Renderer/Renderer';

import * as ThreeHelpers from '../Util/ThreeHelpers';

import EntityManager from '../EntityComponent/EntityManager';
import {Entity} from '../EntityComponent/Entity';

import {ScaleVisualComponent} from '../Components/ScaleComponents/ScaleVisualComponent';
import {ScaleWeightComponent} from '../Components/ScaleComponents/ScaleWeightComponent';
import {MousePointerComponent} from '../Components/MouseHandlingComponent/MousePointerComponent';
import {BasicGeometryComponent} from '../Components/BasicGeometryComponent';
import {SelectableComponent} from '../Components/MouseHandlingComponent/SelectableComponent';
import { WeighableComponent } from '../Components/ScaleComponents/WeighableComponent';


export default class BasicTestScene extends BaseScene
{
    mainCamera: any;
    orbit: any;

    timeElapsed: number = 0;

    entityManager: EntityManager;

    scaleGroup!: THREE.Group;
    scaleComponent!: ScaleWeightComponent;

    constructor()
    {        
        super();
        this.entityManager = new EntityManager();
    }
    
    async initialize(renderer: Renderer)
    {
        super.initialize(renderer);
        this.initializeBasicScene(renderer);

        // Creating entities        
        this.createMouseHandlerEntity();
        this.createScaleEntity();

        this.createWeightedCube();

        this.setupTable();

        // Wait for all the loading of models
        // await Promise.all([
        //     this.setupTable(),
        // ])
    }

    createMouseHandlerEntity()
    {
        const params = {
            scene: this,
            camera: this.mainCamera,
        }

        const mouseEntity = new Entity();
        const mousePointerComponent= new MousePointerComponent(params);
        mouseEntity.addComponent(mousePointerComponent);

        this.entityManager.addEntity(mouseEntity, "MousePointerEntity");        
    }

    createScaleEntity()
    {
        const params = {
            scene: this,
        }

        const scaleEntity = new Entity();
        const visualComponent = new ScaleVisualComponent(params);
        this.scaleComponent = new ScaleWeightComponent(params);
        scaleEntity.addComponent(visualComponent);
        scaleEntity.addComponent(this.scaleComponent);

        this.entityManager.addEntity(scaleEntity, "ScaleEntity");

        // Positioning scale where I want
        scaleEntity.group.position.set(0.45, 1.03, 0.0);
        scaleEntity.group.rotateOnAxis(new THREE.Vector3(0.0, 1.0, 0.0), -0.24);

        // Add entities group to the scene for rendering
        this.add(scaleEntity.group);        
    }

    createWeightedCube()
    {
        const params = {
            scene: this,
        }

        const box = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial(
            {
                color: 0x00A2B4,
            }
        );

        const cubeEntity = new Entity();        

        // Setup component
        const geometryComponent = new BasicGeometryComponent(params);
        geometryComponent.setGeometry(box);
        geometryComponent.setMaterial(material);
        geometryComponent.createMesh();

        const selectComponent = new SelectableComponent(params);        
        selectComponent.setSelectableObject(geometryComponent.mesh);

        const weighableComponent = new WeighableComponent(params);
        weighableComponent.setScaleComponent(this.scaleComponent); // I know I'm making the scale first, so just save the component above intsead of going through entity manager

        cubeEntity.addComponent(geometryComponent);
        cubeEntity.addComponent(selectComponent);
        cubeEntity.addComponent(weighableComponent);

        cubeEntity.group.scale.set(0.25, 0.25, 0.25);
        cubeEntity.group.position.set(-0.45, 1.15, 0.0);

        this.entityManager.addEntity(cubeEntity, "WeightedCube");    
        
        this.add(cubeEntity.group);
    }

    // Camera/controls/skybox setup.  Could also be it's own entity now
    initializeBasicScene(renderer: Renderer)
    {
        // Create basic scene
        this.mainCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100.0);
        this.mainCamera.position.set(0,1.6,1.2);

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
    }

    // Ideally table would be split out into it's own entity now, postponing that to get the actual stuff done though
    setupTable()
    {
        ThreeHelpers.LoadGLFT("./resources/models/table.glb", this)
    }

    modelLoaded(gltf: GLTF)
    {
        if (gltf != null)
        {
            const tableMat = new THREE.MeshPhongMaterial({
                color: 0x996633,            
            });

            gltf.scene.children.forEach((o) => 
            {    
                if (o instanceof THREE.Mesh)
                {                    
                  o.material = tableMat;
                }
            })

            this.add(gltf!.scene);
        }
    }

    update(delta: number)
    {
        this.timeElapsed += delta;        
        this.entityManager.updateEntities(delta);
    }
}