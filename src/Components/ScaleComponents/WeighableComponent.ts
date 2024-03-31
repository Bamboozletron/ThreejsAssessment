import * as THREE from 'three';
import { Component } from "../../EntityComponent/Component";
import { ScaleWeightComponent } from './ScaleWeightComponent';

/**
 * A componet that indicates an entity can be placed on the scale
 */
export class WeighableComponent extends Component
{
    private params: any;

    private isOnScale: boolean = false;
    private weight: number = 423.0;

    private tempScaleGroup: THREE.Group = new THREE.Group();

    private originalPos!: THREE.Vector3;
    private originalScale!: THREE.Vector3;
    private originalRot!: THREE.Euler;

    private scaleWeightComponent!: ScaleWeightComponent;

    constructor(params: any)
    {
        super();
        this.params = params;
    }

    InitializeEntity(): void {
        this.AddEventHandler("entitySelected", (eventData: any) => this.onSelect(eventData));

        // Save the original positoin of this (Should move to PlaceOnScale if they ever can move before going on the scale)
        if (this.Entity)
        {
            this.originalPos = this.Entity.Group.position.clone();
            this.originalScale = this.Entity.Group.scale.clone();
            this.originalRot = this.Entity.Group.rotation.clone();
        }

        this.tempScaleGroup.position.set(0,0.105,0);
        this.scaleWeightComponent.Entity?.Group.add(this.tempScaleGroup);        
    }

    /**
     * Listening for entities "entitySelected" event
     * Will move this on/off the scale if available
     * @param eventData event data     
     */
    private onSelect(eventData: any)
    {
        if(this.isOnScale)
        {   
            this.removeFromScale(); 
            this.isOnScale = false;        
        }
        else if (!this.scaleWeightComponent.Occupied)        
        {            
            this.placeOnScale();
            this.isOnScale = true;
        }        
    }

    /**
     * Sets entity weight
     * @param weight entity weight
     */
    SetWeight(weight: number)
    {
        this.weight = weight;
    }

    /**
     * Sets a reference to the scale that this will interact with
     * @param swc Scale Weighing component 
     */
    SetScaleComponent(swc: ScaleWeightComponent)
    {
        this.scaleWeightComponent = swc;
    }

    /**
     * Moves the entity to be on top of the scale with a little offset from {@link this.tempScaleGroup}
     */
    private placeOnScale()
    {                   
        this.tempScaleGroup.add(this.Entity!.Group);

        // Adjust positioning        
        this.Entity!.Group.rotation.set(0,0,0);

        const box = new THREE.Box3().setFromObject(this.tempScaleGroup);
        this.Entity!.Group.position.set(0, (box.max.y - box.min.y)/2, 0);


        this.scaleWeightComponent.Occupied = true;
        this.scaleWeightComponent.ChangeScaleWeight(this.weight);
    }

    /**
     * Returns the entity to it's original position
     */
    private removeFromScale()
    {
        this.scaleWeightComponent.Entity?.Group.remove(this.Entity!.Group);
        this.params.scene.add(this.Entity!.Group); // Have to re-add this entities group to the scene when removing from other group

        this.Entity!.Group.position.set(this.originalPos.x, this.originalPos.y, this.originalPos.z);
        this.Entity!.Group.rotation.set(this.originalRot.x, this.originalRot.y, this.originalRot.z);
        this.Entity!.Group.scale.set(this.originalScale.x, this.originalScale.y, this.originalScale.z);

        this.scaleWeightComponent.Occupied = false;
        this.scaleWeightComponent.ChangeScaleWeight(0.0);
    }

}