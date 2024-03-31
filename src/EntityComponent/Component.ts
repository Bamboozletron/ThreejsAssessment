import {Entity} from '../EntityComponent/Entity'

/** Represents a component in the Entity-Component framework */
export class Component
{
    /** Entity that this component belongs to */
    entity!: Entity;    

    /** Called on Entity initialization (When entity is added via {@link EntityManager.addComponent}*/
    initializeEntity(){};

    /** Called when Component is added to the entity */
    initializeComponent(){};
    
    /** Add an event handler to the component
     * @param name Name of event to listen to
     * @param fn function callback
     */
    addEventHandler(name: string, fn: Function)
    {
        this.entity?.addEventHandler(name, fn);
    }
    
    update(delta: number){};
    
}