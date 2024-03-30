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

    addEventHandler(name: string, fn: Function)
    {
        this.entity?.addEventHandler(name, fn);
    }
}