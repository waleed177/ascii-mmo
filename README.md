# Description
Its an ascii mmo game, in progress, not for production yet.

# License
This game is licensed under the Affero General Public License Version 3 Only.

# Installation Instructions
## Dependencies
NodeJS (Tested on v16.6.1)
MongoDB (Tested on db version v4.4.5)

## Instructions
### 0. Download mongodb and run it and obtain the url for it.
Usually they are written in this format:
mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
https://docs.mongodb.com/manual/reference/connection-string/

### 1. download this repository.
```
git clone https://github.com/waleed177/ascii-mmo.git
```

### 2. open the terminal in that directory (or cd into it), then:
```
npm install
npm run compile
```

### 3. Go to the folder dist/app, and write these three files:
#### config.json
```
{
  "alphaKey": "whatever"
}
```
This is just used for registering, you need a key, this is dum and ill remove it later.

#### credentials.json
```
{
  "url": ""
}
```

Put the value of url as the url of your mongodb server along with the password and username.


#### test.json (I SHOULD rename it to world.json, but it won't be here for long ill switch to databases for worlds).
```
{
  "spawnPoint": {"x": 0, "y": 0, "z": 0},
  "gameObjects": []
}
```

This is an empty world file.


### 4. Run the software
```
npm start
```

### 5. Connect to it via web browser
The url would be http://127.0.0.1:3000/

# Controls (PARTIAL, this is incomplete)
```
write in chat (by clicking /), dont change the word somethingsecret lol
/key somethingsecret
then write
/register <username> <password>
dont write an important password pls, there is nothing in this game so just do 123 lol. /register whatever 123
then /login whatever 123

controls:
WASD to move
there is more just lazy to write rn, they arent important rn

more commands:
u can do /spawnship to spawn a ship in ur current location

wasd to move 
> to chat
/ to use commands
i to use inventory
f to leave any ui except chat, chat u leave by clicking enter or >

worldeditor
x to world edit
h to move cursor 
space then any character to change tile. 
e to start and stop placing
wasd to move cursor
f to leave editing
```
