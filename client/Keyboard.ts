export class Keyboard {
    private keys: Map<string, boolean>;

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
        return this.keys.get(key);
    }
}
