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
     * This is what initializes triggers Entity initialization. {@link Entity.Initialize}
     */
    AddEntity(entity: Entity, name: string)
    {
        entity.Name = name;        
        entity.Manager = this;

        this.entities.push(entity);        
        entity.Initialize();
    }

    /** Get an entity based on name */
    GetEntity(name: string)
    {
        for (var k in this.entities)
        {
            if (this.entities[k].Name == name)
            {
                return this.entities[k];
            }
        }
        return null;
    }

    /** UNTESTED Remove an entity 
     * @remarks Similar to Component, didn't quite need this so it's a bit behind and untested. Should probably be part of the overhaul to a map and remove based on name
    */
    RemoveEntity(entity: Entity)
    {
        const index = this.entities.indexOf(entity);
        if (index >= 0)
        {
            this.entities.splice(index, 1);
        }
    }

    UpdateEntities(delta: number)
    {
        for(var k in this.entities)
        {
            this.entities[k].UpdateComponents(delta);
        }    
    }
}