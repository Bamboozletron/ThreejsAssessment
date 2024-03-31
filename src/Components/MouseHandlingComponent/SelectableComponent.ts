import * as THREE from 'three';
import {Component} from '../../EntityComponent/Component';
import { MousePointerComponent } from './MousePointerComponent';

/** A component to track when the entity is selected by mouse click*/
export class SelectableComponent extends Component
{
    // Get the general MousePointerComponent existing in the scene
    private selectableObject!: THREE.Object3D;
    private mousePointerHandler!: MousePointerComponent;    

    constructor(params: any)
    {
        super();
    }

    InitializeComponent(): void {
        document.addEventListener('mouseup', (eventData) => {
            this.onMouseUp(eventData);
        }, false);;   
    }

    InitializeEntity(): void {
        this.mousePointerHandler = <MousePointerComponent>this.Entity?.Manager.GetEntity("MousePointerEntity")?.GetComponent("MousePointerComponent");
    }

    /** Set the object to track
     * @remarks Could possibly just default to the entity.group
     * @param obj The reference to which object to track selection on
     */
    SetSelectableObject(obj: THREE.Object3D)
    {
        this.selectableObject = obj;
    }
    
    /**Broadcast entitySelected event if the selected object is intersected
     * @param eventData mouse event data
     */
    private onMouseUp(eventData: MouseEvent)
    {
        const intersections = this.mousePointerHandler.Raycaster.intersectObject(this.Entity!.Group, true);
        if (intersections.length > 0)
        {
            this.Entity?.BroadcastEvent(
                {
                    eventName: "entitySelected",
                }
            )
        }
    }

}