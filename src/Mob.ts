import { PrefabName } from '../client/shared/Prefabs';
import { NetworkEntity } from './NetworkEntity';

export class Mob extends NetworkEntity {

    constructor() {
        super();
        this.prefab = "entityCharSprite";
        this.sprite = "c";

    }

    getPrivateData() {
        return {
            prefab: 'mob' as PrefabName
        }
    }

    update() {
        let lastPos = this.position.clone();
        this.position.x += Math.round(Math.random()*2 - 1);
        this.position.y += Math.round(Math.random()*2 - 1);
        if(this.world.findEntitiesCollidingWithPoint(this.position).length >0)
            this.position = lastPos;
        this.emitPosition();
    }

}
