import * as THREE from 'three';
import {Component} from '../../EntityComponent/Component';
import { MousePointerComponent } from './MousePointerComponent';

export class SelectableComponent extends Component
{
    // Get the general MousePointerComponent existing in the scene
    selectableObject!: THREE.Object3D;
    mousePointerHandler!: MousePointerComponent;    

    constructor(params: any)
    {
        super();
    }

    initializeComponent(): void {
        document.addEventListener('mouseup', (eventData) => {
            this.onMouseUp(eventData);
        }, false);;   
    }

    initializeEntity(): void {
        this.mousePointerHandler = <MousePointerComponent>this.entity?.manager.getEntity("MousePointerEntity")?.getComponent("MousePointerComponent");
    }

    setSelectableObject(obj: THREE.Object3D)
    {
        this.selectableObject = obj;
    }
    
    onMouseUp(eventData: MouseEvent)
    {
        const intersections = this.mousePointerHandler.raycaster.intersectObject(this.entity!.group, true);
        if (intersections.length > 0)
        {
            this.entity?.broadcastEvent(
                {
                    eventName: "entitySelected",         
                }
            )
        }
    }

}