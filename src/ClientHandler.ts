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

import express = require('express');
import ws from 'ws';
import { MessageHandler } from "../client/shared/MessageHandler";
import { ReceivedData }  from "../client/shared/ReceivedData";
import { LocalPlayerIdData } from "../client/shared/LocalPlayerIdData";
import { Server } from './Server.js';
import { NetworkPlayer } from './NetworkPlayer.js';
import { Vector3 } from '../client/shared/Vector3';
import { EmitForGameObjectData } from '../client/shared/EmitForGameObjectData.js'
import { InventoryUpdatedData } from '../client/shared/InventoryUpdatedData';
import { DialogueExecutor } from './DialogueExecutor';
import { User, UserModel } from './models/UserModel';

interface TestType {
    test1: number,
    test2: number
}

export class ClientHandler {
    
    private webSockets: ws;
    private messageHandler: MessageHandler<ClientHandler>;
    private server: Server;
    public hasKey: boolean = false;
    public userInfo: User;

    player = new NetworkPlayer(this);

    public dialogueExecutor: DialogueExecutor;

    constructor(server: Server, webSockets: ws) {
        this.server = server;
        this.webSockets = webSockets;
        this.messageHandler = new MessageHandler();

        console.log("New client connected!");        
    }

    public setup() {
        this.server.world.sendWorldTo(this);
    }

    initializeEvents() {
        this.webSockets.on("message", (data) => {
            var json_data: ReceivedData = JSON.parse(data.toString());
            this.messageHandler.handle(this, json_data);
        });

        this.webSockets.on('close', (code, reason) => {
            this.server.world.removeChild(this.player);
        });

        this.messageHandler.on("test", (sender: ClientHandler, data: TestType) => {
            console.log(data.test1);
            console.log(data.test2);
        });

        this.messageHandler.on("emitForGameObject", (sender: ClientHandler, data: EmitForGameObjectData) => {
            this.server.world.getChild(data.id).messageHandler.handle(this, data.json);
        });
    }

    emitString(data: string) {
        this.webSockets.send(data);
    }

    emit(type: string, json: object) {
        this.emitString(JSON.stringify({
            type: type,
            json: json
        } as ReceivedData));
    }

    login(userInfo: User) {
        this.userInfo = userInfo;
        
        this.player.position = this.server.world.spawnPoint;
        this.server.world.addChild(this.player);
        this.emit('receiveLocalPlayerId', {
            id: this.player.id
        } as LocalPlayerIdData);
        this.player.load();
    }
}
