import {Entity} from './Entity';

export default class EntityManager
{
    entities: Array<Entity>;

    constructor()
    {
        this.entities = new Array<Entity>();        
    }

    addEntity(entity: Entity, name: string)
    {

        entity.setName(name);        
        entity.manager = this;

        this.entities.push(entity);        
        entity.initialize();
    }

    // Could be improved with map
    getEntity(name: string)
    {
        for (var k in this.entities)
        {
            if (this.entities[k].getName() == name)
            {
                return this.entities[k];
            }
        }

        return null;
    }

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