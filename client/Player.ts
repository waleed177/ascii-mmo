import { CharSprite } from "./CharSprite.js";
import { Entity } from "./Entity.js";
import { Vector3 } from "./shared/Vector3.js";
import { keyboard, renderer } from "./Client.js";
import { NPC } from "./NPC.js";
export class Player extends Entity {
    private cameraZ = 0;

    constructor() {
        super();
        this.sprite = new CharSprite(new Vector3(0, 0, 0), 'P');
    }

    update() {
        if (this.world.playerId == this.id){
            this.handleMovement();
            //Move this to some other appropriate class.
            if (keyboard.isKeyDown("[")) {
                this.cameraZ -= 1;
            }
            if (keyboard.isKeyDown("]")) {
                this.cameraZ += 1;
            }
            if (this.cameraZ < 0) 
                this.cameraZ = 0;
            if (this.cameraZ >= renderer.depth)
                this.cameraZ = renderer.depth-1;

            renderer.cameraPosition = this.position.sub(
                new Vector3(
                    Math.floor(renderer.width/2),
                    Math.floor(renderer.height/2),
                    0
                )
            );

            renderer.cameraPosition.z = this.cameraZ;

            if(keyboard.isKeyDown("e")) {
                let res = this.world.findEntitiesWithinRadius(this.position, 1);
                for(let i = 0; i < res.length; i++) {
                    let entity = res[i];
                    if (entity instanceof NPC) {
                        entity.talk();
                    }
                }
            }
        }
    }

    private handleMovement() {
        if (keyboard.isKeyDown("d") || keyboard.isKeyDown("D")) {
            this.position.x += 1;
            this.sendNewPosition();
        }

        if (keyboard.isKeyDown("a") || keyboard.isKeyDown("A")) {
            this.position.x -= 1;
            this.sendNewPosition();
        }

        if (keyboard.isKeyDown("s") || keyboard.isKeyDown("S")) {
            this.position.y += 1;
            this.sendNewPosition();
        }

        if (keyboard.isKeyDown("w") || keyboard.isKeyDown("W")) {
            this.position.y -= 1;
            this.sendNewPosition();
        }
    }
}
