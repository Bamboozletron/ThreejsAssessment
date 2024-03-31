import * as THREE from 'three';
import {Component} from '../../EntityComponent/Component';

/**
 * Component to track mouse movement on the screen.  Tracks position/interactions
 */
export class MousePointerComponent extends Component
{
    private params: any;

    private intersections!: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[];

    raycaster!: THREE.Raycaster;    
    pointerPos: THREE.Vector2;

    constructor(params: any)
    {
        super();
        this.params = params;
        this.pointerPos = new THREE.Vector2();
    }

    initializeComponent(): void {
        window.addEventListener('mousemove', (event) =>
        {
            this.onMouseMove(event);
        }, false);

        this.raycaster = new THREE.Raycaster();
    }

    /** Sets intersections and pointerposition from the mouse event
     * @param event mouse event data
     */
    onMouseMove(event: MouseEvent)
    {
        this.pointerPos.x = (event.clientX/window.innerWidth) * 2 - 1;
        this.pointerPos.y = -((event.clientY/window.innerHeight) * 2 - 1);

        this.raycaster.setFromCamera(this.pointerPos, this.params.camera);

        this.intersections = this.raycaster.intersectObjects(this.params.scene.children);
    }

    /** Get the current first intersection of this component */
    getFirstIntersection(): THREE.Object3D | null
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
}