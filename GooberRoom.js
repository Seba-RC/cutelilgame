const colyseus = require('colyseus');
const schema = require('@colyseus/schema');

const { Schema, MapSchema, defineTypes } = schema;

class Player extends Schema {}
defineTypes(Player, {
    x: "number",
    y: "number",
    flipX: "boolean",
    spriteKey: "string"
});

class MyState extends Schema {
    constructor() {
        super();
        this.players = new MapSchema();
    }
}
defineTypes(MyState, {
    players: { map: Player }
});

class GooberRoom extends colyseus.Room {
    onCreate(options) {
        this.state = (new MyState());
        console.log("Room created as:", this.roomId)

        this.onMessage("move", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (player) {
                player.x = data.x;
                player.y = data.y;
                player.flipX = data.flipX;
            }
        });
    }

    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        this.playerCount++;
        const player = new Player();
        player.x = 5400;
        player.y = 7000;
        player.spriteKey = (this.playerCount === 1) ? 'goober' : 'shamk';
        this.state.players.set(client.sessionId, player);
    }

    onLeave(client, consented) {
        this.state.players.delete(client.sessionId);
    }
}

module.exports = GooberRoom;