import * as THREE from 'three';
import { Component } from "../../EntityComponent/Component";
import { ScaleWeightComponent } from './ScaleWeightComponent';

export class WeighableComponent extends Component
{
    params: any;

    isOnScale: boolean = false;
    weight: number = 423.0;

    tempScaleGroup: THREE.Group = new THREE.Group();

    originalPos!: THREE.Vector3;
    originalScale!: THREE.Vector3;
    originalRot!: THREE.Euler;

    scaleWeightComponent!: ScaleWeightComponent;

    lerpTime: number = 1.0;

    constructor(params: any)
    {
        super();
        this.params = params;
    }

    initializeEntity(): void {
        this.addEventHandler("entitySelected", (eventData: any) => this.onSelect(eventData));

        if (this.entity)
        {
            this.originalPos = this.entity.group.position.clone();
            this.originalScale = this.entity.group.scale.clone();
            this.originalRot = this.entity.group.rotation.clone();
        }

        this.tempScaleGroup.position.set(0,0.105,0);
        this.scaleWeightComponent.entity?.group.add(this.tempScaleGroup);        
    }

    onSelect(eventData: any)
    {
        if(this.isOnScale)
        {   
            this.removeFromScale(); 
            this.isOnScale = false;        
        }
        else if (!this.scaleWeightComponent.occupied)        
        {            
            this.placeOnScale();
            this.isOnScale = true;
        }        
    }

    setScaleComponent(swc: ScaleWeightComponent)
    {
        this.scaleWeightComponent = swc;
    }

    // Consider moving this into ScaleVisualComponent
    placeOnScale()
    {                   
        this.tempScaleGroup.add(this.entity!.group);

        // Adjust positioning        
        this.entity!.group.rotation.set(0,0,0);

        const box = new THREE.Box3().setFromObject(this.tempScaleGroup);
        this.entity!.group.position.set(0, (box.max.y - box.min.y)/2, 0);


        this.scaleWeightComponent.occupied = true;
        this.scaleWeightComponent.changeScaleWeight(this.weight);
    }

    removeFromScale()
    {
        this.scaleWeightComponent.entity?.group.remove(this.entity!.group);
        this.params.scene.add(this.entity!.group); // Have to re-add this entities group to the scene when removing from other group

        this.entity!.group.position.set(this.originalPos.x, this.originalPos.y, this.originalPos.z);
        this.entity!.group.rotation.set(this.originalRot.x, this.originalRot.y, this.originalRot.z);
        this.entity!.group.scale.set(this.originalScale.x, this.originalScale.y, this.originalScale.z);

        this.scaleWeightComponent.occupied = false;
        this.scaleWeightComponent.changeScaleWeight(0.0);
    }

    update(delta: number): void {
        
    }

}