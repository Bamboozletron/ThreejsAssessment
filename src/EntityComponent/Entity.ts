import * as THREE from 'three'
import {Component} from "./Component";
import EntityManager from './EntityManager';

export class Entity
{
    private name: string = "";    
    private components: Array<Component>;

    // Possibly a weird idea. Each Entity has a top level "Group" from threejs for positioning
    // Let components handle more complicated entity setup for now (ie, no heirarchy for entities yet)
    group: THREE.Group;
    manager!: EntityManager;

    // Handlers for events (Referencing SimonDev entity setup for mouse events)
    eventHandlers: Map<string, Array<Function>> = new Map<string, Array<Function>>();


    constructor()
    {     
        this.components = new Array<Component>();
        this.group = new THREE.Group();
    }

    getName(): string
    {
        return this.name;
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

    addEventHandler(name: string, fn: Function)
    {
        if (!this.eventHandlers.has(name))
        {
            const fnArray = new Array<Function>();
            fnArray.push(fn);
            this.eventHandlers.set(name, fnArray);
        }
        else
        {
            this.eventHandlers.get(name)?.push(fn);
        }
    }

    broadcastEvent(eventData: any)
    {
        // Probably a better way to collapse a has/get to be one call
        if (this.eventHandlers.has(eventData.eventName))
        {
            let fnArray = this.eventHandlers.get(eventData.eventName);

            if (fnArray)
            {                
                for (let currHandler of fnArray)
                {
                    currHandler(eventData);
                }
            }
        }
    }

}