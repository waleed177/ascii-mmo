export class Keyboard {
    private keys: Map<string, boolean>;
    private currentScope: string;
    private scopeStack: Array<string> = new Array<string>();
    private keyboardOwner: string;

    constructor() {
        this.keys = new Map<string, boolean>();
    }

    public hookToWindow() {
        window.addEventListener("keydown", (ev: KeyboardEvent) => {
            this.keys.set(ev.key, true);
        });
        window.addEventListener("keyup", (ev: KeyboardEvent) => {
            this.keys.set(ev.key, false);
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
