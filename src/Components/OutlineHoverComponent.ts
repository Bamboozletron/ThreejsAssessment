import * as THREE from 'three';
import {Component} from '../EntityComponent/Component';

/**
 * Component to add outline via custom shader when hoveored
 * @remarks
 * Could probably collapse some of this and {@link ColorChangerComponent}
 */
export class OutlineHoverComponent extends Component
{
    private material!: THREE.ShaderMaterial;

    constructor(params: any)
    {
        super();
    }
    
    InitializeEntity(): void {
        this.AddEventHandler("entityHoverStart", (eventData: any) => this.hoverStart(eventData));
        this.AddEventHandler("entityHoverEnd", (eventData: any) => this.hoverEnd(eventData));
    }

    /**
     * Set the material to adjust when hovered
     * @param mat provided material
     */
    SetMaterialToUpdate(mat: THREE.ShaderMaterial)
    {
        this.material = mat;
    }

    /**
     * Set the outline color
     * @param color Outline color 
     */
    SetOutlineColor(color: THREE.Color)
    {
        if (this.material)
        {
            this.material.uniforms.uOutlineColor.value = new THREE.Vector3(color.r, color.g, color.b);
        }
    }

    /**
     * Respond to "entityHoverStart" event
     */
    private hoverStart(data: any)
    {
        if (this.material)
        {
            this.material.uniforms.uSelected.value = true;
        }
    }

    /**
     * Respond to "entityHoverEnd" event
     */
    private hoverEnd(data: any)
    {
        if (this.material)
        {
            this.material.uniforms.uSelected.value = false;
        }
    }
}