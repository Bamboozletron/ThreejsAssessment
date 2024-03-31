import * as THREE from 'three';
import {Component} from '../EntityComponent/Component';

// Just using this for basic basic shapes on entity. Loses "nice" way to customize geometry though
export class BasicGeometryComponent extends Component
{
    params: any;

    geometry!: THREE.BufferGeometry
    mesh!: THREE.Mesh;
    mat!: THREE.Material;    

    constructor(params: any)
    {
        super();
        this.params = params;
    }

    initializeEntity()
    {        
        this.entity?.group.add(this.mesh);
    }

    setGeometry(geometry: THREE.BufferGeometry)
    {
        this.geometry = geometry;
    }

    setMaterial(material: THREE.Material)
    {
        this.mat = material;        
    }

    createMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.mat);
    }
}

