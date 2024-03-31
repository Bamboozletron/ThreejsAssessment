import * as THREE from 'three';
import {Component} from '../../EntityComponent/Component';
import { MousePointerComponent } from './MousePointerComponent'

import * as ThreeHelpers from '../../Util/ThreeHelpers';

export class HoverComponent extends Component
{
    // Get the general MousePointerComponent existing in the scene
    selectableObject!: THREE.Object3D;
    mousePointerHandler!: MousePointerComponent;
    
    private isHovered: boolean = false;

    constructor(params: any)
    {
        super();
    }

    initializeEntity(): void {
        this.mousePointerHandler = <MousePointerComponent>this.entity?.manager.getEntity("MousePointerEntity")?.getComponent("MousePointerComponent");
    }

    setSelectableObject(obj: THREE.Object3D)
    {
        this.selectableObject = obj;
    }
    
    update(delta: number): void {
        
        const intersect = this.mousePointerHandler.getFirstIntersection();
        if (intersect)
        {
            if (intersect == this.selectableObject)
            {   
                if (!this.isHovered)
                {  
                    this.isHovered = true;
                    this.entity?.broadcastEvent(
                        {
                            eventName: "entityHoverStart",         
                        }
                    )
                }
            }
            else if (this.isHovered)
            {
                this.isHovered = false;
                this.entity?.broadcastEvent(
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
                this.entity?.broadcastEvent(
                    {
                        eventName: "entityHoverEnd",         
                    }
                )
            }
        }
    }

}