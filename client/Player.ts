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

import { CharSprite } from "./CharSprite.js";
import { Entity } from "./Entity.js";
import { Vector3 } from "./shared/Vector3.js";
import { keyboard, renderer } from "./Client.js";
import { NPC } from "./NPC.js";
import { TileMapObject } from "./TileMapObject.js";
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

            if(keyboard.isKeyJustDown("e")) {
                this.emit("useClosestEntity", {});
            }
        }
    }

    private handleMovement() {

        if (keyboard.isKeyDown("d") || keyboard.isKeyDown("D")) {
            this.moveWithCollision(new Vector3(1, 0, 0));
        }

        if (keyboard.isKeyDown("a") || keyboard.isKeyDown("A")) {
            this.moveWithCollision(new Vector3(-1, 0, 0));
        }

        if (keyboard.isKeyDown("s") || keyboard.isKeyDown("S")) {
            this.moveWithCollision(new Vector3(0, 1, 0));
        }

        if (keyboard.isKeyDown("w") || keyboard.isKeyDown("W")) {
            this.moveWithCollision(new Vector3(0, -1, 0));
        }
    }

    private moveWithCollision(delta: Vector3) {
        let newPos = this.position.add(delta);
        this.sendNewPosition(newPos);

        let collision = false;
        this.world.findCollisionsWithPoint(newPos).forEach(
            (gameObject, index, array) => {
                if (gameObject instanceof TileMapObject) {
                    var tile = gameObject.tilemap.getTile(
                        newPos.x - gameObject.position.x,
                        newPos.y - gameObject.position.y,
                        0
                    );

                    if (tile != " " && tile != ".") {
                        collision = true;
                    }
                }
            }
        );

        if (!collision) {
            this.position = newPos;
        }
    }
}
