import { ClientHandler } from './ClientHandler.js';
import { app } from './app';
import { NetworkWorld } from './NetworkWorld';
import { ChatBox } from './ChatBox.js';
import { InventoryDisplay } from './InventoryDisplay.js';
import { TileMapObject } from './TileMapObject.js';

export class Server {
    private clients = new Array<ClientHandler>();
    public world = new NetworkWorld(this);
    public inventoryDisplay = new InventoryDisplay();
    public tilemap = new TileMapObject(16, 16);

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

        this.tilemap.tilemap.writeText(1, 1, 'tomatoes are cool');
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
