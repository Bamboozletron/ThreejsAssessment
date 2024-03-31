import * as THREE from 'three';
import {Component} from '../../EntityComponent/Component';
import { MousePointerComponent } from './MousePointerComponent'

/** A component to track when the entity is being hovered by the mouse */
export class HoverComponent extends Component
{
    // Get the general MousePointerComponent existing in the scene
    private selectableObject!: THREE.Object3D;
    private mousePointerHandler!: MousePointerComponent;
    
    private isHovered: boolean = false;
    
    constructor(params: any)
    {
        super();
    }
    
    InitializeEntity()
    {
        // Grab mousePointerHandler componoent to reference
        this.mousePointerHandler = <MousePointerComponent>this.Entity?.Manager.GetEntity("MousePointerEntity")?.GetComponent("MousePointerComponent");
    }

    /** Set the object to track
     * @remarks Could possibly just default to the entity.group
     * @param obj The reference to which object to track hovering on
     */
    SetHoverableObject(obj: THREE.Object3D)
    {
        this.selectableObject = obj;
    }
    
    /* Broadcast hover events based on mouse interaction */
    Update(delta: number)
    {                
        const intersect = this.mousePointerHandler.GetFirstIntersection();
        if (intersect)
        {
            if (intersect == this.selectableObject)
            {   
                if (!this.isHovered)
                {  
                    this.isHovered = true;
                    this.Entity?.BroadcastEvent(
                        {
                            eventName: "entityHoverStart",         
                        }
                    )
                }
            }
            else if (this.isHovered)
            {
                this.isHovered = false;
                this.Entity?.BroadcastEvent(
                    {
                        eventName: "entityHoverEnd",         
                    }
                )
            }
        }
        else
        {
            if (this.isHovered)
            {
                this.isHovered = false;
                this.Entity?.BroadcastEvent(
                    {
                        eventName: "entityHoverEnd",         
                    }
                )
            }
        }
    }

}