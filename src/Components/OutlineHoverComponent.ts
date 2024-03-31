import * as THREE from 'three';
import {Component} from '../EntityComponent/Component';

// On second thought maybe ColorChangerComponent/OutlineHoverCompoment should extend HoverComponent.  Although I'd be doing the interaction checking multiple times
export class OutlineHoverComponent extends Component
{
    private material!: THREE.ShaderMaterial;        
    private isHovered: boolean = false;

    constructor(params: any)
    {
        super();
    }
    
    initializeEntity(): void {
        this.addEventHandler("entityHoverStart", (eventData: any) => this.hoverStart(eventData));
        this.addEventHandler("entityHoverEnd", (eventData: any) => this.hoverEnd(eventData));
    }

    setMaterialToUpdate(mat: THREE.ShaderMaterial)
    {
        this.material = mat;
    }

    setOutlineColor(color: THREE.Color)
    {
        if (this.material)
        {
            this.material.uniforms.uOutlineColor.value = new THREE.Vector3(color.r, color.g, color.b);
        }
    }

    hoverStart(data: any)
    {
        this.isHovered = true;
        if (this.material)
        {
            this.material.uniforms.uSelected.value = true;
        }
    }

    hoverEnd(data: any)
    {
        this.isHovered = false;
        if (this.material)
        {
            this.material.uniforms.uSelected.value = false;
        }
    }
}