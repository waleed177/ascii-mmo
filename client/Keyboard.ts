type KeyboardEventFunction = (ev: KeyboardEvent) => void;
type KeyboardEventFunctionAndData = {
    scope: string,
    callback: KeyboardEventFunction
}

export class Keyboard {
    private keys: Map<string, boolean>;
    private currentScope: string;
    private scopeStack: Array<string> = new Array<string>();
    private keyboardOwner: string;
    private keyDownListeners = new Array<KeyboardEventFunctionAndData>();
    private keyUpListeners = new Array<KeyboardEventFunctionAndData>();

    constructor() {
        this.keys = new Map<string, boolean>();
    }

    public hookToWindow() {
        window.addEventListener("keydown", (ev: KeyboardEvent) => {
            this.keys.set(ev.key, true);
            for(let i = 0; i < this.keyDownListeners.length; i++) {
                var keyDownListener = this.keyDownListeners[i];
                if(keyDownListener.scope == this.keyboardOwner || this.keyboardOwner == null) 
                    keyDownListener.callback(ev);
            }
        });
        window.addEventListener("keyup", (ev: KeyboardEvent) => {
            this.keys.set(ev.key, false);
            for(let i = 0; i < this.keyUpListeners.length; i++) {
                var keyUpListener = this.keyUpListeners[i];
                if(keyUpListener.scope == this.keyboardOwner || this.keyboardOwner == null) 
                    keyUpListener.callback(ev);
            }
        });
    }

    public addKeyDownListener(scope: string, callback: KeyboardEventFunction) {
        this.keyDownListeners.push({
            scope: scope,
            callback: callback
        });
    }

    public isKeyDown(key: string) {
        return (this.currentScope == this.keyboardOwner || this.keyboardOwner == null) && this.keys.get(key);
    }

    public startScope(name: string) {
        if (this.currentScope != null)
            this.scopeStack.push(this.currentScope);
        this.currentScope = name;
    }

    public endScope() {
        this.currentScope = this.scopeStack.pop();
    }

    public claimOwnership(name: string) {
        if (this.keyboardOwner == null)
            this.keyboardOwner = name;
    }

    public releaseOwnership(name: string) {
        if (this.keyboardOwner == name) 
            this.keyboardOwner = null;
    }
}
