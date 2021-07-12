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
        for(var i = 0; i < this.sendQueue.length; i++) {
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
