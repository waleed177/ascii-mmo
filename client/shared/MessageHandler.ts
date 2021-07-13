import {ReceivedData} from './ReceivedData.js'

type MessageHandlerFunction<T> = (sender: T, data: any) => void;

export class MessageHandler<T> {
    private functionBindings: Map<string, MessageHandlerFunction<T>>;

    constructor() {
        this.functionBindings = new Map<string, MessageHandlerFunction<T>>();
    }

    public on(type: string, callback: MessageHandlerFunction<T>) {
        this.functionBindings.set(type, callback);
    }

    public handle(sender: T, data: ReceivedData) {
        if(this.functionBindings.has(data.type))
            this.functionBindings.get(data.type)(sender, data.json);
        else
            console.error("Function binding " + data.type + " does not exist!");
    }
}
