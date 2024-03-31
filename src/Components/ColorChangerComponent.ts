import * as THREE from 'three';
import {Component} from '../EntityComponent/Component';

import * as ThreeHelpers from '../Util/ThreeHelpers';

export class ColorChangerComponent extends Component
{
    // Get the general MousePointerComponent existing in the scene
    private material!: THREE.MeshPhysicalMaterial; // Should be able to make this a generic material, but cannot
        
    private isHovered: boolean = false;
    private progress: number = 0.0;

    constructor(params: any)
    {
        super();
    }
    
    initializeEntity(): void {
        this.addEventHandler("entityHoverStart", (eventData: any) => this.hoverStart(eventData));
        this.addEventHandler("entityHoverEnd", (eventData: any) => this.hoverEnd(eventData));
    }

    setMaterialToUpdate(mat: THREE.MeshPhysicalMaterial)
    {
        this.material = mat;
    }

    hoverStart(data: any)
    {
        this.isHovered = true;
    }

    hoverEnd(data: any)
    {
        this.isHovered = false;
    }
    
    update(delta: number): void {
        
        if (this.material)
        {
            if (this.isHovered)
            {
                this.progress += delta * 0.0005; 
                const sinV = Math.sin(this.progress);
                const remappedSin = ThreeHelpers.Remap(sinV, -1.0, 1.0, 0.0, 256);   
                const color = new THREE.Color().setHSL(remappedSin, 1.0, 0.5);
                this.material.color.set(color);
            }
        }
    }
}