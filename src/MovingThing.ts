import { PrefabName } from '../client/shared/Prefabs';
import { Vector3 } from '../client/shared/Vector3';
import { NetworkEntity } from './NetworkEntity';


export class MovingThing extends NetworkEntity {
    public velocity: Vector3 = new Vector3(1, 0, 0);

    constructor() {
        super();
        this.prefab = "entityCharSprite";
        this.sprite = "k";
    }

    getPrivateData() {
        return {
            prefab: "movingThing"
        } as {prefab: PrefabName}
    }

    update() {
        let lastPos = this.position.clone();
        this.position = this.position.add(this.velocity);
        if(this.world.findEntitiesCollidingWithPoint(this.position).length >0) {
            this.position = lastPos;
            this.velocity = this.velocity.mul(-1);
        }
        this.emitPosition();
    }
}
