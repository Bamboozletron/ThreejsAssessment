import * as THREE from 'three';
import {Component} from '../../EntityComponent/Component';

/**
 * Component to track mouse movement on the screen.  Tracks position/interactions
 */
export class MousePointerComponent extends Component
{
    private params: any;

    private intersections!: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[];

    Raycaster!: THREE.Raycaster;    
    PointerPos: THREE.Vector2;

    constructor(params: any)
    {
        super();
        this.params = params;
        this.PointerPos = new THREE.Vector2();
    }

    InitializeComponent(): void {
        window.addEventListener('mousemove', (event) =>
        {
            this.onMouseMove(event);
        }, false);

        this.Raycaster = new THREE.Raycaster();
    }

    /** Get the current first intersection of this component */
    GetFirstIntersection(): THREE.Object3D | null
    {
        if (this.intersections)
        {
            if (this.intersections.length > 0)
            {
                return (<THREE.Object3D>this.intersections[0].object);
            }
        }

        return null;
    }

    /** Sets intersections and pointerposition from the mouse event
     * @param event mouse event data
     */
    private onMouseMove(event: MouseEvent)
    {
        this.PointerPos.x = (event.clientX/window.innerWidth) * 2 - 1;
        this.PointerPos.y = -((event.clientY/window.innerHeight) * 2 - 1);

        this.Raycaster.setFromCamera(this.PointerPos, this.params.camera);

        this.intersections = this.Raycaster.intersectObjects(this.params.scene.children);
    }
}