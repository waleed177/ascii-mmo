import { ClientHandler } from './ClientHandler.js';
import { app } from './app';
import { NetworkWorld } from './NetworkWorld';
import { ChatBox } from './ChatBox.js';
import { InventoryDisplay } from './InventoryDisplay.js';
import { TileMapObject } from './TileMapObject.js';
import { NPC } from './NPC.js';
import { Vector3 } from '../client/shared/Vector3.js';
import { DialogueBuilder } from './DialogueBuilder';
import { dialogues } from './NPCData';
import { QuestsDisplay } from './QuestsDisplay.js';

export class Server {
    private clients = new Array<ClientHandler>();
    public world = new NetworkWorld(this);
    public inventoryDisplay = new InventoryDisplay();
    public tilemap = new TileMapObject(16, 16, 1);
    public questsDisplay = new QuestsDisplay();
    
    addClient(client: ClientHandler) {
        this.clients.push(client);
    }

    start() {
        app.ws('/server', (ws, req) => {
            var clientHandler = new ClientHandler(this, ws);
            clientHandler.initializeEvents();
            this.addClient(clientHandler);
            clientHandler.initPlayerEntity();
        });

        this.world.addChild(new ChatBox());
        this.world.addChild(this.inventoryDisplay);
        this.world.addChild(this.tilemap);
        this.world.addChild(this.questsDisplay);

        var npc = new NPC('N', dialogues.get("welcome_dialogue"));
        npc.position = new Vector3(11, 13, 0);
        this.world.addChild(npc);

        this.tilemap.tilemap.writeText(1, 1, 0, 'tomatoes are cool');
    }

    broadcast(type: string, data: any) {
        var data_to_send = JSON.stringify({
            "type": type,
            "json": data
        });

        for(var i = 0; i < this.clients.length; i++) {
            this.clients[i].emitString(data_to_send);
        }
    }
}
