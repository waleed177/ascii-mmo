//#region PREAMBLE
/*
    This is an ASCII MMO game.
    Copyright (C) 2021 waleed177 <potatoxel@gmail.com>
    Copyright (C) 2021 metamuffin <muffin@metamuffin.org>

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

import { ReceivedData } from "./shared/ReceivedData.js";

export class Socket {
    private webSocket: WebSocket;
    private functionBindings: Map<string, (data: object) => void>;
    private sendQueue: Array<string>;

    constructor() {
        this.sendQueue = new Array<string>();
        this.functionBindings = new Map<string, (data: object) => void>();
    }

    connect(url: string) {
        this.webSocket = new WebSocket(url);
        this.webSocket.onopen = (ev: Event) => this.onSocketOpen(ev);
        this.webSocket.onmessage = (ev: MessageEvent<string>) => this.onSocketMessage(ev);
        this.webSocket.onclose = () => {
            console.log("disconnected");
            const try_reconnect = () => {
                console.log("trying to reconnect...");
                const ws = new WebSocket(this.webSocket.url)
                ws.onopen = () => {
                    console.log("reload!");
                    // reconnect successful, now reload
                    window.location.reload()
                }
                ws.onclose = () => setTimeout(try_reconnect, 100)
            }
            try_reconnect()
        }
    }

    emit(type: string, data: object) {
        var data_to_send = JSON.stringify({
            "type": type,
            "json": data
        });

        if (this.webSocket.readyState == 0) {
            this.sendQueue.push(data_to_send);
        } else {
            this.webSocket.send(data_to_send);
        }
    }

    on(type: string, func: (data: object) => void) {
        this.functionBindings.set(type, func);
    }

    private onSocketOpen(ev: Event) {
        for (var i = 0; i < this.sendQueue.length; i++) {
            var data = this.sendQueue[i];
            this.webSocket.send(data);
        }
        this.sendQueue = null;
    }

    private onSocketMessage(ev: MessageEvent<string>) {
        var data: ReceivedData = JSON.parse(ev.data);
        this.functionBindings.get(data.type)(data.json);
    }
}
