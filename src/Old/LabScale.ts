import * as THREE from 'three'
import * as ThreeHelpers from '../Util/ThreeHelpers';

export default class LabScale
{
        
    // Objects/Group
    private scaleGroup?: THREE.Group;
    
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

    // Weight display
    private changingWeight: boolean = false;
    private currentWeight: number = 0;    
    private beginningWeight: number = 0;
    private targetWeight: number = 0;

    private readonly timeToChange: number = 2.0;
    private timeProgress: number = 0;

    private scaleDigitsToShow: number = 9;
    

    // Where to place things for the scale weight
    private scaleContainer!: THREE.Group;
    private scaleRotation: number = -0.24;

    async initialize(scene: THREE.Scene)
    {
        document.addEventListener('keyup', event => this.onKeyUp(event), false);
        await this.SetupTextPlane(scene);
        await this.loadCustomMaterial();
        await this.loadScaleModel(scene);
    }

    async SetupTextPlane(scene: THREE.Scene)
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
        this.scaleGroup.rotateOnAxis(new THREE.Vector3(0.0, 1.0, 0.0), this.scaleRotation);

        const cube = new THREE.BoxGeometry(0.4, 0.4, 0.4);        
        const mat = new THREE.MeshPhongMaterial();
        const mesh = new THREE.Mesh(cube, mat);

        cube.computeBoundingBox();
        console.log(cube.boundingBox?.min.y);

        this.scaleContainer = new THREE.Group();
        this.scaleContainer.position.set(0,0.125,0);
        // Undo scaling of scale instelf for this group so objects I move to this position will stay the same size
        this.scaleContainer.scale.set(1.0/0.8, 1.0/0.8, 1.0/0.8);

        // this.scaleGroup.add(this.scaleContainer);
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

        if (this.changingWeight && this.timeProgress <= this.timeToChange)
        {
            this.currentWeight = this.interpolateWeight(this.beginningWeight, this.targetWeight, this.timeProgress/this.timeToChange);
            this.timeProgress+= delta;            

            this.setScaleWeightTexture(this.currentWeight);
        }
        else
        {
            this.changingWeight = false;
            this.timeProgress = 0;
            this.currentWeight = this.targetWeight;

            this.setScaleWeightTexture(this.currentWeight);
        }
    }

    changeScaleWeight(targetWeight: number)
    {        
        this.timeProgress = 0.0;
        this.targetWeight = targetWeight;    
        this.beginningWeight = this.currentWeight;
        this.changingWeight = true;
    }

    setScaleWeightTexture(targetWeight: number)
    {
        if (this.canvasContext)
        {
            this.canvasContext.font = '160px Arial';

            this.canvasContext.fillStyle = 'white'
            this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

            this.canvasContext.fillStyle = 'black';        
            this.canvasContext.textAlign = "center";
            this.canvasContext.textBaseline = "middle";
            this.canvasContext.fillText(this.formatWeight(targetWeight), this.canvasWidth/2, this.canvasHeight/2);
        }
        this.canvasTexture.needsUpdate = true;
    }

    formatWeight(weight: number): string
    {        
        var weightString = weight.toFixed(2) + "g";
        const length = weightString.length;
        if (length < this.scaleDigitsToShow)
        {
            const toAdd = this.scaleDigitsToShow - length;
            for (let i = 0; i < toAdd; i++)
            {
                weightString = "0" + weightString;
            }
        }
        return weightString;
    }


    // Splitting into it's own function to mess with other curves possibly
    interpolateWeight(start: number, end: number, progress: number): number
    {
        //  Simple lerp, haven't figured math out for other ones and am wasting time
        return THREE.MathUtils.lerp(start, end, progress);        
    }


    onKeyUp(event: KeyboardEvent)
    {
        switch (event.code)
        {
            case "Space":
                console.log("SPACE");
                this.changeScaleWeight(this.currentWeight + 100.0);
                break;
        }
    }
}