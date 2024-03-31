import * as THREE from 'three'
import {Component} from "./Component";
import EntityManager from './EntityManager';

/** Represents an Entity in Entity-Component framework
 * Entity consists of multiple {@link Component}
 * @remarks
 * Could probably switch the Array<Component> of components to be Map<string, Array<Component>> for better access of components
*/
export class Entity
{
    Name: string = "";       

    // Possibly a weird idea. Each Entity has a top level "Group" from threejs for positioning
    // Let components handle more complicated entity setup for now (ie, no heirarchy for entities yet)
    Group: THREE.Group;
    Manager!: EntityManager;

    private eventHandlers: Map<string, Array<Function>> = new Map<string, Array<Function>>();
    private components: Array<Component>;

    /** Creates a new entity 
     * @remarks 
     * Initializes component array and creates that top level group
    */
    constructor()
    {     
        this.components = new Array<Component>();
        this.Group = new THREE.Group();
    }

    /** Add a component to the entity
     * @remarks
     * {@link Component.InitializeComponent} called from here
    */
    AddComponent(component: Component)
    {        
        this.components.push(component);
        component.InitializeComponent();
        component.Entity = this;
    }

    /** Remove a component from the entity
     * @remarks
     * Honestly untested in the current application because it wasn't really necessary.  
    */
    RemoveComponent(component: Component)
    {
        const index = this.components.indexOf(component);
        if (index >= 0)
        {
            this.components.splice(index, 1);
        }
    }

    /** Get a specific component from the entity based on type name */
    GetComponent(type: string): Component | null
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

    /** Initialize the entity.
    *  @remarks 
    * Called from {@link EntityManager.AddEntity}
    * Happens AFTER {@link Component.InitializeComponent}
    */
    Initialize()
    {
        for(var k in this.components)
        {
            this.components[k].InitializeEntity();            
        }
    }

    UpdateComponents(delta: number)
    {
        for(var k in this.components)
        {
            this.components[k].Update(delta);
        }
    }

    /** Add event handlers to the entity.
     * @param name Name of event to listen to
     * @param fn function callback
    */
    AddEventHandler(name: string, fn: Function)
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

    /** Broadcast an event across the entity
     * @param eventData Contains all event data, including an eventName
    */
    BroadcastEvent(eventData: any)
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