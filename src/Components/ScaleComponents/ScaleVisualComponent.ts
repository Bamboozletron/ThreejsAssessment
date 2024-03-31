import * as THREE from 'three'
import * as ThreeHelpers from '../../Util/ThreeHelpers';
import {Component} from '../../EntityComponent/Component';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

/** Represents the visual components of the lab scale
 * @remarks
 * In it's own component because it's a bit more complicated with multiple meshes split from a single GLB file
 */
export class ScaleVisualComponent extends Component
{
     // Objects/Group
     private scaleGroup: THREE.Group;
    
     private mainScale!: THREE.Object3D;
     private scalePlate!: THREE.Object3D;
     private scaleScreen!: THREE.Object3D;
 
     // Materials
     private mainScaleMat!: THREE.Material;
     private plateMat!: THREE.Material;
     private screenMat!: THREE.Material;
 
     // Canvas texture elements for scale display
     private canvasHeight: number = 500;
     private canvasWidth: number = 1000;
 
     private textCanvas!: HTMLCanvasElement;
     private canvasContext!: CanvasRenderingContext2D | null;
     private canvasTexture!: THREE.Texture;     

     /**
      * Creates new Lab Scale Visuals component
      */
     constructor(params: any)
     {
        super();
        this.scaleGroup = new THREE.Group();
     };

    InitializeEntity()
    {
        this.setupTextPlaneAndScreenMat();
        this.loadBasicScaleMats();
        ThreeHelpers.LoadGLFT("./resources/models/scale.glb", this);
    }

    /**
     * Creates two basic materials for the main body and the plate
     */
    private loadBasicScaleMats()
    {
        this.mainScaleMat = new THREE.MeshPhongMaterial({
            color: 0x7f7f7f,
        });

        this.plateMat = new THREE.MeshPhongMaterial({
            color: 0x404040,
        });
    }

    /**
     * Callback for when the model is finished loading
     * @param gltf the loaded model
     */
    ModelLoaded(gltf: GLTF)
    {        
        var model = gltf.scene;
        let meshArray = new Array<THREE.Object3D>();
        model.children.forEach((o) => 
        {    
            if (o instanceof THREE.Mesh)
            {
                meshArray.push(o);
                o.receiveShadow = true;                
            }
        })

        this.assignObjects(meshArray);
        this.setupGroup();
    }

    /**
     * Assigns split mesh to class members based on name and sets their materials
     * @remarks
     * Probably not the best way to do this, not much experience with loading multiple mesh models though.
     */
    private assignObjects(meshArray: Array<THREE.Object3D>)
    {
        for (var k in meshArray)
        {
            console.log(meshArray[k].name);            

            switch (meshArray[k].name)
            {
                case "Scale":
                    this.mainScale = meshArray[k];
                    (<THREE.Mesh>meshArray[k]).material = this.mainScaleMat;
                    break;
                case "ScaleScreen":
                    this.scaleScreen = meshArray[k];
                    (<THREE.Mesh>meshArray[k]).material = this.screenMat;
                    break;
                case "Plate":
                    this.scalePlate = meshArray[k];
                    (<THREE.Mesh>meshArray[k]).material = this.plateMat;
                    break;
            }
        }
    }

    /**  
     * Adds individual meshes to a single {@link THREE.Group} to have them operate as a single unit
    */
    private setupGroup()
    {        
        this.scaleGroup.add(this.mainScale);
        this.scaleGroup.add(this.scalePlate);
        this.scaleGroup.add(this.scaleScreen);    

        this.scaleGroup.scale.set(0.8, 0.8, 0.8);

        this.Entity?.Group.add(this.scaleGroup);
    }

    /**
     * Sets up a text canvas that is then converted to a texture for use as the scales screen
     * @remarks
     * Was a pretty confusing process, referenced {@link https://jsfiddle.net/m64x29p8/} quite a bit from a forum post
     * Couldn't figure out how to get custom fonts working
     */
    private setupTextPlaneAndScreenMat()
    {
        this.textCanvas = document.createElement('canvas');
        this.textCanvas.width = this.canvasWidth;
        this.textCanvas.height = this.canvasHeight;

        this.canvasContext = this.textCanvas.getContext('2d');

        if (this.canvasContext)
        {
            this.canvasContext.font = '160px Arial';

            this.canvasContext.fillStyle = 'white'
            this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

            this.canvasContext.fillStyle = 'black';        
            this.canvasContext.textAlign = "center";
            this.canvasContext.textBaseline = "middle";
            this.canvasContext.fillText("00000.00g", this.canvasWidth/2, this.canvasHeight/2);
        }

        // Creating textutre from this canvas
        this.canvasTexture = new THREE.Texture(this.textCanvas);
        this.canvasTexture.minFilter = THREE.LinearFilter; // Keeps text a bit crisper
        this.canvasTexture.needsUpdate = true;

        // Assign it to our screenMaterial
        this.screenMat = new THREE.MeshBasicMaterial({ map: this.canvasTexture, });        
    }


    /**
     * Sets the scales screen to display a given string
     * @param targetWeight string to display
     * @remarks
     * Seems like it has to be refilled every time otherwise it just painted over the old texture
     */
    SetScaleWeightTexture(targetWeight: string)
    {
        if (this.canvasContext)
        {
            this.canvasContext.font = '160px Arial';

            this.canvasContext.fillStyle = 'white'
            this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

            this.canvasContext.fillStyle = 'black';        
            this.canvasContext.textAlign = "center";
            this.canvasContext.textBaseline = "middle";
            this.canvasContext.fillText(targetWeight, this.canvasWidth/2, this.canvasHeight/2);
        }
        this.canvasTexture.needsUpdate = true;
    }
}