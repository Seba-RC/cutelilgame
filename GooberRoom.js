const colyseus = require('colyseus');
const schema = require('@colyseus/schema');

class Player extends schema.Schema {}
schema.defineTypes(Player, {
    x: "number",
    y: "number"
});

class RoomState extends schema.Schema {
    constructor() {
        super();
        this.players = new schema.MapSchema();
    }
}

class MyRoom extends colyseus.Room {
    onCreate(options) {
        this.state = (new RoomState());

        // When a player tells the server they moved
        this.onMessage("move", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            player.x = data.x;
            player.y = data.y;
        });
    }

    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        const player = new Player();
        player.x = 500; // Starting X
        player.y = 500; // Starting Y
        this.state.players.set(client.sessionId, player);
    }

    onLeave(client, consented) {
        this.state.players.delete(client.sessionId);
    }
}

module.exports = GooberRoom;