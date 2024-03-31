import * as THREE from 'three';
import {Component} from '../EntityComponent/Component';

import * as ThreeHelpers from '../Util/ThreeHelpers';

/**
 * Component that will change an entities color over time when hovered
 */
export class ColorChangerComponent extends Component
{
    private material!: THREE.MeshPhysicalMaterial; // Should be able to make this a generic material, but cannot
        
    private isHovered: boolean = false;
    private progress: number = 0.0;

    constructor(params: any)
    {
        super();
    }
    
    InitializeEntity(): void {
        this.AddEventHandler("entityHoverStart", (eventData: any) => this.hoverStart(eventData));
        this.AddEventHandler("entityHoverEnd", (eventData: any) => this.hoverEnd(eventData));
    }

    /**
     * Sets the material that this component should change
     * @param mat provided material
     */
    SetMaterialToUpdate(mat: THREE.MeshPhysicalMaterial)
    {
        this.material = mat;
    }

    /**
     * Respond to "entityHoverStart" event
     */
    private hoverStart(data: any)
    {
        this.isHovered = true;
    }

    /**
     * Respond to "entityHoverEnd" event
     */
    private hoverEnd(data: any)
    {
        this.isHovered = false;
    }
    
    /**
     * If hovered, cycle through hues
     */
    Update(delta: number): void {
        
        if (this.material)
        {
            if (this.isHovered)
            {
                this.progress += delta * 0.001; 
                const sinV = Math.sin(this.progress);
                const remappedSin = ThreeHelpers.Remap(sinV, -1.0, 1.0, 0.0, 256);   
                const color = new THREE.Color().setHSL(remappedSin, 1.0, 0.5);
                this.material.color.set(color);
            }
        }
    }
}