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
import {WeighableComponent} from '../Components/ScaleComponents/WeighableComponent';
import {HoverComponent} from '../Components/MouseHandlingComponent/HoverComponent';
import {ColorChangerComponent} from '../Components/ColorChangerComponent';
import { OutlineHoverComponent } from '../Components/OutlineHoverComponent';

export default class BasicTestScene extends BaseScene
{
    mainCamera: any;
    orbit: any;

    timeElapsed: number = 0;

    entityManager: EntityManager;

    scaleGroup!: THREE.Group;
    scaleComponent!: ScaleWeightComponent;

    skybox!: THREE.Texture;
    colors: Array<THREE.Color> =
    [
        new THREE.Color(0xff0000),
        new THREE.Color(0x00ff00),
        new THREE.Color(0x0000ff),
    ]

    // Lights
    ambientLight!: THREE.AmbientLight;
    directionalLight!: THREE.DirectionalLight;
    hemiLight!: THREE.HemisphereLight;

    customOutlineMat!: THREE.ShaderMaterial;

    constructor()
    {        
        super();
        this.entityManager = new EntityManager();
    }
    
    async initialize(renderer: Renderer)
    {
        super.initialize(renderer);
        this.initializeBasicScene(renderer);

        this.customOutlineMat = await this.createSphereMat();

        // Creating entities        
        this.createMouseHandlerEntity();
        this.createScaleEntity();

        this.createWeightedCube();
        this.createWeightedSphere();

        this.setupTable();
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
        const material = this.createCubeMat();

        const cubeEntity = new Entity();        

        // Setup component
        const geometryComponent = new BasicGeometryComponent(params);
        geometryComponent.setGeometry(box);
        geometryComponent.setMaterial(material);
        geometryComponent.createMesh();

        const selectComponent = new SelectableComponent(params);        
        selectComponent.setSelectableObject(geometryComponent.mesh);

        const hoverComponent = new HoverComponent(params);        
        hoverComponent.setSelectableObject(geometryComponent.mesh);

        const colorChanger = new ColorChangerComponent(params);
        colorChanger.setMaterialToUpdate(material);

        const weighableComponent = new WeighableComponent(params);
        weighableComponent.setScaleComponent(this.scaleComponent); // I know I'm making the scale first, so just save the component above intsead of going through entity manager
        weighableComponent.weight = 567.89;

        cubeEntity.addComponent(geometryComponent);
        cubeEntity.addComponent(selectComponent);
        cubeEntity.addComponent(hoverComponent);
        cubeEntity.addComponent(colorChanger);
        cubeEntity.addComponent(weighableComponent);

        cubeEntity.group.scale.set(0.25, 0.25, 0.25);
        cubeEntity.group.position.set(0.00, 1.15, 0.0);

        this.entityManager.addEntity(cubeEntity, "WeightedCube");    
        
        this.add(cubeEntity.group);
    }

    // Could probably collapse sphere/cube, but not 100% sure I want to yet
    createWeightedSphere()
    {
        const params = {
            scene: this,
            castShadows: true,
        }

        const sphere = new THREE.SphereGeometry(0.5, 16, 16);

        const sphereEntity = new Entity();        

        // Setup component
        const geometryComponent = new BasicGeometryComponent(params);
        geometryComponent.setGeometry(sphere);
        geometryComponent.setMaterial(this.customOutlineMat);
        geometryComponent.createMesh();

        const selectComponent = new SelectableComponent(params);        
        selectComponent.setSelectableObject(geometryComponent.mesh);

        const hoverComponent = new HoverComponent(params);        
        hoverComponent.setSelectableObject(geometryComponent.mesh);

        const outlineComponent = new OutlineHoverComponent(params);
        outlineComponent.setMaterialToUpdate(this.customOutlineMat);
        outlineComponent.setOutlineColor(new THREE.Color(0.9, 0.3, 0.9));

        const weighableComponent = new WeighableComponent(params);
        weighableComponent.setScaleComponent(this.scaleComponent); // I know I'm making the scale first, so just save the component above intsead of going through entity manager
        weighableComponent.weight = 123.45;

        sphereEntity.addComponent(geometryComponent);
        sphereEntity.addComponent(selectComponent);
        sphereEntity.addComponent(hoverComponent);
        sphereEntity.addComponent(outlineComponent);
        sphereEntity.addComponent(weighableComponent);

        sphereEntity.group.scale.set(0.25, 0.25, 0.25);
        sphereEntity.group.position.set(-0.5, 1.2, 0.0);

        this.entityManager.addEntity(sphereEntity, "WeightedSphere");    
        
        this.add(sphereEntity.group);
    }

    // Camera/controls/skybox setup.  Could also be it's own entity now
    initializeBasicScene(renderer: Renderer)
    {

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Create basic scene
        this.mainCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100.0);
        this.mainCamera.position.set(0,1.6,1.2);

        this.orbit = new StationaryOrbit(this.mainCamera, renderer.domElement);
        this.orbit.target.set(0, 1, -2);
        this.orbit.update();

        this.ambientLight = new THREE.AmbientLight(0x808080, 0.0);
        this.add(this.ambientLight);

        this.hemiLight = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 0.6);
        this.add(this.hemiLight);

        this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
        this.directionalLight.position.set(-3.0, 4.0, 1.0);        
        this.directionalLight.castShadow = true;
        this.add(this.directionalLight);

        const skyboxLoader = new THREE.CubeTextureLoader();
        this.skybox = skyboxLoader.load([
            './resources/skybox/Cold_Sunset__Cam_2_Left+X.png',
            './resources/skybox/Cold_Sunset__Cam_3_Right-X.png',
            './resources/skybox/Cold_Sunset__Cam_4_Up+Y.png',
            './resources/skybox/Cold_Sunset__Cam_5_Down-Y.png',
            './resources/skybox/Cold_Sunset__Cam_0_Front+Z.png',
            './resources/skybox/Cold_Sunset__Cam_1_Back-Z.png',
        ]);
        this.background = this.skybox;
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
                  o.receiveShadow = true;
                }
            })

            gltf.scene.receiveShadow = true;
            this.add(gltf!.scene);
        }
    }

    createCubeMat()
    {
        const physMat = new THREE.MeshPhysicalMaterial(
            {
                color: 0x80d1fd,
                transparent: true,
                opacity: 0.35,
                side: THREE.DoubleSide,
                depthWrite: false,
                roughness: 0.275,
                metalness: 0.165,
                ior: 1.7,
                reflectivity: 0.6,
                iridescence: 1,
                iridescenceIOR: 1.3,
                sheen: 0.6,
                envMap: this.skybox
            }
        )

        return physMat;        
    }

    // Custom shader for the sphere
    async createSphereMat()
    {
        const vsh = await fetch('./resources/shaders/vertex-outline.glsl');
        const fsh = await fetch('./resources/shaders/fragment-outline.glsl');

        const customMaterial = new THREE.ShaderMaterial({
            uniforms:
            {
                uSelected: {value : false},
                uOutlineColor: { value: new THREE.Vector3(0.6, 0.2, 0.2)},
                uBaseColor: { value: new THREE.Vector3(0.3, 0.3, 0.3)},
                uAmbient: { value: this.ambientLight.color},
                uDiffuseDir: { value: this.directionalLight.position.sub(this.directionalLight.target.position)},
                uDiffuseColor: {value: this.directionalLight.color},
            },
            vertexShader: await vsh.text(),
            fragmentShader: await fsh.text(),
        });

        return customMaterial;
    }

    update(delta: number)
    {
        this.timeElapsed += delta;        
        this.entityManager.updateEntities(delta);
    }
    
    
}