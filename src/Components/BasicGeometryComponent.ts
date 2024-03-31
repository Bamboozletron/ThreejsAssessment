import * as THREE from 'three';
import {Component} from '../EntityComponent/Component';

/** Component for a very simple Geometry */
export class BasicGeometryComponent extends Component
{
    private params: any;

    private geometry!: THREE.BufferGeometry
    private mat!: THREE.Material;    

    Mesh!: THREE.Mesh;

    private castShadows: boolean = false;

    constructor(params: any)
    {
        super();
        this.params = params;
        this.castShadows = this.params.castShadows;    
    }    

    InitializeEntity()
    {        
        this.Entity?.Group.add(this.Mesh);
    }

    /**
     * Sets the generated geometry for this component
     * @param geometry Supplied buffer geometry
     */
    SetGeometry(geometry: THREE.BufferGeometry)
    {
        this.geometry = geometry;
    }

    /**
     * Sets the material for this entity
     * @param material supplied material
     */
    SetMaterial(material: THREE.Material)
    {
        this.mat = material;
    }

    /**
     * Generate the mesh from the given geometry and material
     * @remarks
     * Must be called after setGeometry/setMesh which isn't ideal
     */
    CreateMesh()
    {
        this.Mesh = new THREE.Mesh(this.geometry, this.mat);
        this.Mesh.castShadow = this.castShadows;
    }
}

