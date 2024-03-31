// threejs
import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

import {StationaryOrbit} from '../Camera/StationaryOrbit';
import {BaseScene} from './SceneSetup/BaseScene'
import {Renderer} from '../Renderer/Renderer';

// Custom threejs util
import * as ThreeHelpers from '../Util/ThreeHelpers';

// Entity system
import EntityManager from '../EntityComponent/EntityManager';
import {Entity} from '../EntityComponent/Entity';

// Components
import {ScaleVisualComponent} from '../Components/ScaleComponents/ScaleVisualComponent';
import {ScaleWeightComponent} from '../Components/ScaleComponents/ScaleWeightComponent';
import {MousePointerComponent} from '../Components/MouseHandlingComponent/MousePointerComponent';
import {BasicGeometryComponent} from '../Components/BasicGeometryComponent';
import {SelectableComponent} from '../Components/MouseHandlingComponent/SelectableComponent';
import {WeighableComponent} from '../Components/ScaleComponents/WeighableComponent';
import {HoverComponent} from '../Components/MouseHandlingComponent/HoverComponent';
import {ColorChangerComponent} from '../Components/ColorChangerComponent';
import { OutlineHoverComponent } from '../Components/OutlineHoverComponent';

/**
 * A scene representing the basic lab for the assessment
 * @remarks
 * Uses an Entity-component framework via {@link EntityManager}
 * 
 * Main entities:
 *  A lab scale, which is loaded from a GLB file and can weigh the Cube/Sphere when they're selected
 *  Cube entity using a {@link THREE.MeshPhysicalMaterial} which changes colors when hovered over
 *  Sphere entity using a custom materias {@link createSphereMat}.  Using "../resources/shaders/fragment-outline"   
 */
export class LabScene extends BaseScene
{
    private orbit: any;

    private entityManager: EntityManager;

    private scaleGroup!: THREE.Group;
    private scaleComponent!: ScaleWeightComponent;

    private skybox!: THREE.Texture;

    // Lights
    private ambientLight!: THREE.AmbientLight;
    private directionalLight!: THREE.DirectionalLight;
    private hemiLight!: THREE.HemisphereLight;

    private customOutlineMat!: THREE.ShaderMaterial;

    /** Creates new LabScene */
    constructor()
    {        
        super();
        this.entityManager = new EntityManager();
    }
    
    /** Initialize the scene, creating entities*/
    async Initialize(renderer: Renderer)
    {        
        super.Initialize(renderer);
        
        this.initializeBasicScene(renderer); //  Could be swapped to be an entity
        this.customOutlineMat = await this.createSphereMat();

        // Creating entities        
        this.createMouseHandlerEntity();
        this.createScaleEntity();
        this.createWeightedCube();
        this.createWeightedSphere();

        // Old style table setup, could be swapped to be an entity now
        this.setupTable();
    }

    /** Creates the entity responsible for tracking mouse movement in the scene */
    private createMouseHandlerEntity()
    {
        const params = {
            scene: this,
            camera: this.MainCamera,
        }

        const mouseEntity = new Entity();

        const mousePointerComponent= new MousePointerComponent(params);
        mouseEntity.AddComponent(mousePointerComponent);

        this.entityManager.AddEntity(mouseEntity, "MousePointerEntity");        
    }

    /** Creates entity representing the lab scale */
    private createScaleEntity()
    {
        const params = {
            scene: this,
        }

        const scaleEntity = new Entity();
        const visualComponent = new ScaleVisualComponent(params);
        this.scaleComponent = new ScaleWeightComponent(params);
        scaleEntity.AddComponent(visualComponent);
        scaleEntity.AddComponent(this.scaleComponent);

        this.entityManager.AddEntity(scaleEntity, "ScaleEntity");

        // Positioning scale where I want
        scaleEntity.Group.position.set(0.45, 1.03, 0.0);
        scaleEntity.Group.rotateOnAxis(new THREE.Vector3(0.0, 1.0, 0.0), -0.24);

        // Add entities group to the scene for rendering
        this.add(scaleEntity.Group);        
    }

    /** Creates entity representing the weighted cube */
    private createWeightedCube()
    {
        const params = {
            scene: this,
            castShadows: true,
        }

        const box = new THREE.BoxGeometry();
        const material = this.createCubeMat();

        const cubeEntity = new Entity();        

        // Setup components
        const geometryComponent = new BasicGeometryComponent(params);
        geometryComponent.SetGeometry(box);
        geometryComponent.SetMaterial(material);
        geometryComponent.CreateMesh();

        const selectComponent = new SelectableComponent(params);        
        selectComponent.SetSelectableObject(geometryComponent.Mesh);

        const hoverComponent = new HoverComponent(params);        
        hoverComponent.SetHoverableObject(geometryComponent.Mesh);

        const colorChanger = new ColorChangerComponent(params);
        colorChanger.SetMaterialToUpdate(material);

        const weighableComponent = new WeighableComponent(params);
        weighableComponent.SetScaleComponent(this.scaleComponent); // I know I'm making the scale first, so just save the component above intsead of going through entity manager
        weighableComponent.SetWeight(567.89);

        cubeEntity.AddComponent(geometryComponent);
        cubeEntity.AddComponent(selectComponent);
        cubeEntity.AddComponent(hoverComponent);
        cubeEntity.AddComponent(colorChanger);
        cubeEntity.AddComponent(weighableComponent);

        cubeEntity.Group.scale.set(0.25, 0.25, 0.25);
        cubeEntity.Group.position.set(0.00, 1.15, 0.0);

        this.entityManager.AddEntity(cubeEntity, "WeightedCube");    
        
        this.add(cubeEntity.Group);
    }

    /** Creates entity representing the weighted sphere 
     * @remarks
     * Possibly could collapse some setup with {@link createWeightedCube}
     * Could also probably move entity creation out to some generic factory reading from json as well
    */
    private createWeightedSphere()
    {
        const params = {
            scene: this,
            castShadows: true,
        }

        const sphere = new THREE.SphereGeometry(0.5, 16, 16);

        const sphereEntity = new Entity();        

        // Setup component
        const geometryComponent = new BasicGeometryComponent(params);
        geometryComponent.SetGeometry(sphere);
        geometryComponent.SetMaterial(this.customOutlineMat);
        geometryComponent.CreateMesh();

        const selectComponent = new SelectableComponent(params);        
        selectComponent.SetSelectableObject(geometryComponent.Mesh);

        const hoverComponent = new HoverComponent(params);        
        hoverComponent.SetHoverableObject(geometryComponent.Mesh);

        const outlineComponent = new OutlineHoverComponent(params);
        outlineComponent.SetMaterialToUpdate(this.customOutlineMat);
        outlineComponent.SetOutlineColor(new THREE.Color(0.9, 0.3, 0.9));

        const weighableComponent = new WeighableComponent(params);
        weighableComponent.SetScaleComponent(this.scaleComponent); // I know I'm making the scale first, so just save the component above intsead of going through entity manager
        weighableComponent.SetWeight(123.45);

        sphereEntity.AddComponent(geometryComponent);
        sphereEntity.AddComponent(selectComponent);
        sphereEntity.AddComponent(hoverComponent);
        sphereEntity.AddComponent(outlineComponent);
        sphereEntity.AddComponent(weighableComponent);

        sphereEntity.Group.scale.set(0.25, 0.25, 0.25);
        sphereEntity.Group.position.set(-0.5, 1.2, 0.0);

        this.entityManager.AddEntity(sphereEntity, "WeightedSphere");    
        
        this.add(sphereEntity.Group);
    }

    /** Creates basic scene elements
     * @remarks
     * Sets up:
     * The Main camera for thes cene
     * Orbit controls
     * Ambient, directional, hemisphere lights
     * Skybox
     */
    private initializeBasicScene(renderer: Renderer)
    {

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Create basic scene
        this.MainCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100.0);
        this.MainCamera.position.set(0,1.6,1.2);

        this.orbit = new StationaryOrbit(this.MainCamera, renderer.domElement);
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

    /** Kicks off loading the table model */
    private setupTable()
    {
        ThreeHelpers.LoadGLFT("./resources/models/table.glb", this)
    }

    /** Callback for when the model is finished loading@remarks
     * 
     */
    ModelLoaded(gltf: GLTF)
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

    /** Creates material for cube of type {@link THREE.MeshPhysicalMaterial} */
    private createCubeMat()
    {
        const physMat = new THREE.MeshPhysicalMaterial(
            {
                color: 0xFF0000,
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

    /** Creates custom matetrial for the sphere with provided shaders*/
    private async createSphereMat()
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

    /** Update the scene*/
    Update(delta: number)
    {
        this.entityManager.UpdateEntities(delta);
    }
    
    
}