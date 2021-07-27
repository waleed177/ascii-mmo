import { PrefabName } from '../client/shared/Prefabs';
import { Vector3 } from '../client/shared/Vector3';
import { ServerGameObject } from './ServerGameObject';
import { TileMapObject } from './TileMapObject';

export class SpaceShip extends TileMapObject {

    constructor() {
        super();
        this.setupWithText(`
#########
#   ^   #
# <   > #
#       
#   V   #
#########
        `.trim());
    }

    getPrivateData() {
        return {
            prefab: "spaceship"
        } as {prefab: PrefabName}
    }

    processCollisionWith(obj: ServerGameObject, pos: Vector3) {
        let tile = this.getTileAtWorldSpace(pos);
        if (tile == "^") {
            this.position.y -= 1;
        } else if (tile == "V") {
            this.position.y += 1;
        } else if (tile == ">") {
            this.position.x += 1;
        } else if (tile == "<") {
            this.position.x -= 1;
        }
        this.emitPosition();
    }
}
