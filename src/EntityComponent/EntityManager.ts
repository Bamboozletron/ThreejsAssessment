import {Entity} from './Entity';

export default class EntityManager
{
    entities: Array<Entity>;

    constructor()
    {
        this.entities = new Array<Entity>();        
    }

    addEntity(entity: Entity)
    {
        this.entities.push(entity);
        entity.initialize();
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