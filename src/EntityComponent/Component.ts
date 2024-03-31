import {Entity} from '../EntityComponent/Entity'

/** Represents a component in the Entity-Component framework */
export class Component
{
    /** Entity that this component belongs to */
    Entity!: Entity;    

    /** Called on Entity initialization (When entity is added via {@link EntityManager.addComponent}*/
    InitializeEntity(){};

    /** Called when Component is added to the entity */
    InitializeComponent(){};
    
    /** Add an event handler to the component
     * @param name Name of event to listen to
     * @param fn function callback
     */
    AddEventHandler(name: string, fn: Function)
    {
        this.Entity?.AddEventHandler(name, fn);
    }
    
    Update(delta: number){};
    
}