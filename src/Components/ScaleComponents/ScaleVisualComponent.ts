import * as THREE from 'three'
import * as ThreeHelpers from '../../Util/ThreeHelpers';
import {Component} from '../../EntityComponent/Component';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class ScaleVisualComponent extends Component
{
     private params: any;

     // Objects/Group
     private scaleGroup: THREE.Group;
     private scaleContainer: THREE.Group;
    
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

     constructor(params: any)
     {
        super();
        this.params = params;        

        this.scaleGroup = new THREE.Group();
        this.scaleContainer = new THREE.Group();
     };

    initializeEntity()
    {
        this.loadScaleModel();
    }

    loadScaleModel()
    {
        this.setupTextPlaneAndScreenMat();
        this.loadBasicScaleMats();
        ThreeHelpers.LoadGLFT("./resources/models/scale.glb", this)        
    }

    loadBasicScaleMats()
    {
        this.mainScaleMat = new THREE.MeshPhongMaterial({
            color: 0x7f7f7f,
        });

        this.plateMat = new THREE.MeshPhongMaterial({
            color: 0x404040,
        });
    }

    modelLoaded(gltf: GLTF)
    {        
        var model = gltf.scene;
        let meshArray = new Array<THREE.Object3D>();
        model.children.forEach((o) => 
        {    
            if (o instanceof THREE.Mesh)
            {
                meshArray.push(o);
            }
        })

         this.assignObjects(meshArray);
         this.setupGroup();
    }

    assignObjects(meshArray: Array<THREE.Object3D>)
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

    setupGroup()
    {        
        this.scaleGroup.add(this.mainScale);
        this.scaleGroup.add(this.scalePlate);
        this.scaleGroup.add(this.scaleScreen);

        // const cube = new THREE.BoxGeometry(0.4, 0.4, 0.4);        
        // const mat = new THREE.MeshPhongMaterial();

        // cube.computeBoundingBox();
        // console.log(cube.boundingBox?.min.y);

        
        this.scaleContainer.position.set(0,0.125,0);
        // Undo scaling of scale instelf for this group so objects I move to this position will stay the same size

        this.scaleContainer.scale.set(1.0/0.8, 1.0/0.8, 1.0/0.8);
        this.scaleGroup.add(this.scaleContainer);

        // this.params.scene.add(this.scaleGroup);
        this.entity?.group.add(this.scaleGroup);
    }

    setupTextPlaneAndScreenMat()
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

        this.canvasTexture = new THREE.Texture(this.textCanvas);
        this.canvasTexture.minFilter = THREE.LinearFilter;
        this.canvasTexture.needsUpdate = true;

        this.screenMat = new THREE.MeshBasicMaterial({ map: this.canvasTexture, });        
    }

    setScaleWeightTexture(targetWeight: string)
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

    update(delta: number)
    {
    }
}