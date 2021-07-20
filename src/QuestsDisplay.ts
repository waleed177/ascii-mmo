import { RecieveItemListData } from '../client/shared/RecieveItemListData';
import { SpawnGameObjectData } from '../client/shared/SpawnGameObjectData';
import { ClientHandler } from './ClientHandler';
import { ServerGameObject } from './ServerGameObject';

export class QuestsDisplay extends ServerGameObject {
    shouldBeSerialized = false;

    constructor() {
        super();

    }

    getPublicData(): SpawnGameObjectData {
        return {
            id: this.id,
            sprite: " ",
            x: 0,
            y: 0,
            z: 0,
            prefab: "questDisplay",
            data: {
                displayItems: [ ]
            } as RecieveItemListData
        };
    }

    emitDisplayUpdate(client: ClientHandler, items: Array<string>) {
        this.emitTo(client, 'recieveItems', {
            displayItems: items
        } as RecieveItemListData);
    }
}