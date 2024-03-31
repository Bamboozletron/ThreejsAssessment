import {Entity} from './Entity';

/** Entity manager.  Maintains a list of active entities */
export default class EntityManager
{
    private entities: Array<Entity>;

    constructor()
    {
        this.entities = new Array<Entity>();        
    }

    /** Adds an entity
     * @param entity Entity to add
     * @param name Required name
     * @remarks
     * This is what initializes triggers Entity initialization. {@link Entity.initialize}
     */
    addEntity(entity: Entity, name: string)
    {
        entity.name = name;        
        entity.manager = this;

        this.entities.push(entity);        
        entity.initialize();
    }

    /** Get an entity based on name */
    getEntity(name: string)
    {
        for (var k in this.entities)
        {
            if (this.entities[k].name == name)
            {
                return this.entities[k];
            }
        }
        return null;
    }

    /** UNTESTED Remove an entity 
     * @remarks Similar to Component, didn't quite need this so it's a bit behind and untested. Should probably be part of the overhaul to a map and remove based on name
    */
    removeEntity(entity: Entity)
    {
        const index = this.entities.indexOf(entity);
        if (index >= 0)
        {
            this.entities.splice(index, 1);
        }
    }

    updateEntities(delta: number)
    {
        for(var k in this.entities)
        {
            this.entities[k].updateComponents(delta);
        }    
    }
}