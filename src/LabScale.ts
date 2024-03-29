import * as THREE from 'three'
import * as ThreeHelpers from './Util/ThreeHelpers';

export default class LabScale
{
        
    scaleGroup?: THREE.Group;
    
    mainScale!: THREE.Object3D;
    scalePlate!: THREE.Object3D;
    scaleScreen!: THREE.Object3D;

    mainScaleMat!: THREE.Material;
    plateMat!: THREE.Material;
    screenMat!: THREE.Material;

    height: number = 500;
    width: number = 1000;

    planeTest!: any;

    textCanvas!: HTMLCanvasElement;
    canvasContext!: CanvasRenderingContext2D | null;
    canvasTexture!: THREE.Texture;

    testNum: number = 0;
    
    async initialize(scene: THREE.Scene)
    {
        
        await this.SetupTextPlane(scene);
        await this.loadCustomMaterial();
        await this.loadScaleModel(scene);
    }

    async SetupTextPlane(scene: THREE.Scene)
    {
        this.textCanvas = document.createElement('canvas');
        this.textCanvas.width = this.width;
        this.textCanvas.height = this.height;

        this.canvasContext = this.textCanvas.getContext('2d');

        if (this.canvasContext)
        {
            this.canvasContext.font = '160px Arial';

            this.canvasContext.fillStyle = 'white'
            this.canvasContext.fillRect(0, 0, this.width, this.height);

            this.canvasContext.fillStyle = 'black';        
            this.canvasContext.textAlign = "center";
            this.canvasContext.textBaseline = "middle";
            this.canvasContext.fillText("00000.00g", this.width/2, this.height/2);
        }

        this.canvasTexture = new THREE.Texture(this.textCanvas);
        this.canvasTexture.minFilter = THREE.LinearFilter;
        this.canvasTexture.needsUpdate = true;

        this.screenMat = new THREE.MeshBasicMaterial({ map: this.canvasTexture, });
        
    }

    async loadCustomMaterial()
    {
        this.mainScaleMat = new THREE.MeshPhongMaterial({
            color: 0x7f7f7f,
        });

        this.plateMat = new THREE.MeshPhongMaterial({
            color: 0x404040,
        });
    }

    async loadScaleModel(scene: THREE.Scene)
    {
        const scaleLoaded = await ThreeHelpers.LoadAndSplitGLTF("./resources/models/scale.glb").catch(err =>
        {
            console.log("Error loading model:\n" + err);
        });

        this.assignObjects(scaleLoaded!);        

        this.scaleGroup = new THREE.Group();

        this.scaleGroup.add(this.mainScale);
        this.scaleGroup.add(this.scalePlate);
        this.scaleGroup.add(this.scaleScreen);

        this.scaleGroup.scale.set(0.8, 0.8, 0.8);
        this.scaleGroup.position.set(0.45, 1.03, 0.0);
        this.scaleGroup.rotateOnAxis(new THREE.Vector3(0.0, 1.0, 0.0), -0.24);

        scene.add(this.scaleGroup);
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

    update(delta: number)
    {

        // this.testNum += 1;
        // if (this.canvasContext)
        // {
        //     this.canvasContext.font = '160px Arial';

        //     this.canvasContext.fillStyle = 'white'
        //     this.canvasContext.fillRect(0, 0, this.width, this.height);

        //     this.canvasContext.fillStyle = 'black';        
        //     this.canvasContext.textAlign = "center";
        //     this.canvasContext.textBaseline = "middle";
        //     this.canvasContext.fillText(this.testNum.toString(), this.width/2, this.height/2);
        // }
        // this.canvasTexture.needsUpdate = true;
    }

    setScaleWeight(weight: number)
    {

    }

    formatWeight(weight: number)
    {

    }
}