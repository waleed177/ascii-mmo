import { ClientHandler } from './ClientHandler.js';
import { app } from './app';
import { NetworkWorld } from './NetworkWorld';
import { ChatBox } from './ChatBox.js';
import { InventoryDisplay } from './InventoryDisplay.js';
import { QuestsDisplay } from './QuestsDisplay.js';
import { WorldEditor } from './WorldEditor.js';
import mongoose from 'mongoose';
import { GameObject } from '../client/shared/GameObject.js';

export class Server {
    private clients = new Array<ClientHandler>();
    public world = new NetworkWorld(this);
    public inventoryDisplay = new InventoryDisplay();
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
        this.world.addChild(this.questsDisplay);
        this.world.addChild(new WorldEditor());
        this.world.load();

        setInterval(() => {
            this.world.update();
        }, 100);

        mongoose.connect('mongodb://localhost:27017/asciimmo', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    broadcast(type: string, data: any, except: ClientHandler[] = null) {
        var data_to_send = JSON.stringify({
            "type": type,
            "json": data
        });

        for(var i = 0; i < this.clients.length; i++) {
            if(except && except.indexOf(this.clients[i]) >= 0) continue;
            this.clients[i].emitString(data_to_send);
        }
    }
}
