import * as THREE from 'three';
import {Component} from '../EntityComponent/Component';

/** Component for a very simple Geometry */
export class BasicGeometryComponent extends Component
{
    private params: any;

    private geometry!: THREE.BufferGeometry
    private mat!: THREE.Material;    

    mesh!: THREE.Mesh;

    private castShadows: boolean = false;

    constructor(params: any)
    {
        super();
        this.params = params;
        this.castShadows = this.params.castShadows;    
    }    

    initializeEntity()
    {        
        this.entity?.group.add(this.mesh);
    }

    /**
     * Sets the generated geometry for this component
     * @param geometry Supplied buffer geometry
     */
    setGeometry(geometry: THREE.BufferGeometry)
    {
        this.geometry = geometry;
    }

    /**
     * Sets the material for this entity
     * @param material supplied material
     */
    setMaterial(material: THREE.Material)
    {
        this.mat = material;
    }

    /**
     * Generate the mesh from the given geometry and material
     * @remarks
     * Must be called after setGeometry/setMesh which isn't ideal
     */
    createMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.mat);
        this.mesh.castShadow = true;
    }
}

