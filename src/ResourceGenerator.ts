import { ItemData } from '../client/shared/Item';
import { PrefabName } from '../client/shared/Prefabs';
import { Chest } from './Chest';
import { NetworkEntity } from './NetworkEntity';



export class ResourceGenerator extends NetworkEntity {

    constructor() {
        super();
        this.prefab = "entityCharSprite";
        this.sprite = "R";
        
        this.every(4, () => {
            var neighbors = this.get4Neighbors();
            neighbors.forEach((value, index, array) => {
                if (value instanceof Chest) {
                    value.inventory.addItem("r", 1);
                }
            });
        });
    }

    getPrivateData() {
        return {
            prefab: 'resourceGenerator'
        } as { prefab: PrefabName; };
    }

    update() {
        super.update();

    }

}
