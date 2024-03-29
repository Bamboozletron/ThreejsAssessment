import {Entity} from '../EntityComponent/Entity'

export class Component
{
    entity!: Entity | null;    

    initializeEntity(){};
    initializeComponent(){};
    setEntity(entity: any)
    {
        this.entity = entity;
    }
    update(delta: number){};
}