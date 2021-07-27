//#region PREAMBLE
/*
    This is an ASCII MMO game.
    Copyright (C) 2021 waleed177 <potatoxel@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, version 3 of the
    License only.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
//#endregion

import { ClientHandler } from './ClientHandler.js';
import { app } from './app';
import { NetworkWorld } from './NetworkWorld';
import { ChatBox } from './ChatBox.js';
import { InventoryDisplay } from './InventoryDisplay.js';
import { QuestsDisplay } from './QuestsDisplay.js';
import { WorldEditor } from './WorldEditor.js';
import mongoose from 'mongoose';
import { GameObject } from '../client/shared/GameObject.js';
import fs from 'fs';
import path from 'path';

export class Server {
    private clients = new Array<ClientHandler>();
    public world = new NetworkWorld(this);
    public inventoryDisplay = new InventoryDisplay();
    public questsDisplay = new QuestsDisplay();
    public alphaKey: string;

    addClient(client: ClientHandler) {
        this.clients.push(client);
    }

    start() {
        app.ws('/server', (ws, req) => {
            var clientHandler = new ClientHandler(this, ws);
            clientHandler.initializeEvents();
            this.addClient(clientHandler);
            clientHandler.setup();
        });

        this.world.addChild(new ChatBox());
        this.world.addChild(this.inventoryDisplay);
        this.world.addChild(this.questsDisplay);
        this.world.addChild(new WorldEditor());
        this.world.load();

        setInterval(() => {
            this.world.update();
        }, 100);

        let credentials: {url: string} = JSON.parse(fs.readFileSync(path.join(__dirname, "../credentials.json"), 'utf8'));

        mongoose.connect(credentials.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        let config: {alphaKey: string} = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"), 'utf8'));
        this.alphaKey = config.alphaKey;
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
