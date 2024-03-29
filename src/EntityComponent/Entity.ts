import * as THREE from 'three'
import {Component} from "./Component";

export class Entity
{
    public readonly uuid: string = "";

    private name: string = "";    
    private components: Array<Component>;

    // Possibly a weird idea. Each Entity has a top level "Group" from threejs for positioning
    // Let components handle more complicated entity setup for now (ie, no heirarchy for entities yet)
    group: THREE.Group;

    constructor()
    {     
        this.uuid = crypto.randomUUID();   
        this.components = new Array<Component>();

        this.group = new THREE.Group();
    }

    setName(name: string)
    {
        this.name = name;
    }

    setPosition(x: number, y:number, z:number)
    {
        this.group.position.set(x,y,z);
    }

    addComponent(component: Component)
    {        
        this.components.push(component);
        component.initializeComponent();
        component.setEntity(this);
    }

    removeComponent(component: Component)
    {
        const index = this.components.indexOf(component);
        if (index >= 0)
        {
            this.components.splice(index, 1);
        }
    }

    // Assume no duplicate components for now
    getComponent(type: string): Component | null
    {
        for (var k in this.components)
        {            
            console.log(this.components[k].constructor.name);
            if (this.components[k].constructor.name == type)
            {
                return this.components[k];
            }
        }

        return null;
    }

    initialize()
    {
        for(var k in this.components)
        {
            this.components[k].initializeEntity();            
        }
    }

    updateComponents(delta: number)
    {
        for(var k in this.components)
        {
            this.components[k].update(delta);
        }
    }

}