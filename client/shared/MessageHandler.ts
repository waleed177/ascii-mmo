import {ReceivedData} from './ReceivedData.js'

export class MessageHandler {
    private functionBindings: Map<string, (data: object) => void>;

    constructor() {
        this.functionBindings = new Map<string, (data: object) => void>();
    }

    public on(type: string, callback: (data: object) => void) {
        this.functionBindings.set(type, callback);
    }

    public handle(data: ReceivedData) {
        if(this.functionBindings.has(data.type))
            this.functionBindings.get(data.type)(data.json);
        else
            console.error("Function binding " + data.type + " does not exist!");
    }
}
