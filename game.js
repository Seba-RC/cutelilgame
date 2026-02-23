var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};
let game = new Phaser.Game(config);

let player;

let remotePlayer;

let cursors;

var jumpCounter = 0; // variable to track the number of jumps

var dashCounter = 0; // variable to track the number of dashes

const protocol = window.location.protocol.replace("http", "ws");
const endpoint = `${protocol}//${window.location.host}`;

let client;


function preload() {

    // load assets!
    //map
    this.load.tilemapTiledJSON('map', './assets/level1.json');
    
    this.load.image('grass_img', './assets/platform.png');
    this.load.image('dirt_img', './assets/dirt.png');
    this.load.image('dead_img', './assets/deadgrass.png');
    this.load.image('cyan_img', './assets/cyan.png');

    // goober player
    this.load.spritesheet('goober', './assets/goober.png', {
        frameWidth: 320,
        frameHeight: 320,
    });
    // shamk player
    this.load.spritesheet('shamk', './assets/shamk.png', {
        frameWidth: 320,
        frameHeight: 320,
    });
    
}

function create() {

    this.cameras.main.setBackgroundColor('#87CEEB');

    const map = this.make.tilemap({ key: 'map' });
    console.log("Map Loaded! Layers found:", map.layers.map(l => l.name));
    
    // you might ask Seba why are there two dead grass tiles
    // tiled did a funny move
    const platformTiles = map.addTilesetImage('platform', 'grass_img');
    const dirtTiles = map.addTilesetImage('dirt', 'dirt_img');
    const deadgrassTiles = map.addTilesetImage('deadgrass', 'dead_img');
    const cyanTiles = map.addTilesetImage('cyan', 'cyan_img');
    const deadgrassTiles2 = map.addTilesetImage('deadgrass', 'dead_img');


    const allTiles = [platformTiles, dirtTiles, deadgrassTiles, cyanTiles, deadgrassTiles2];
    const layer = map.createLayer('Tile Layer 1', allTiles, 0, 0);

    
    layer.setCollisionBetween(1, 1000); // sets collision between all tiles 

    player = this.physics.add.sprite(5400, 7000, 'goober').setScale(0.2); // hard coded coordinates Yes I Do Know that there is a better way but still.

    this.physics.add.collider(player, layer); // adds collision with the player

    this.cameras.main.startFollow(player, true, 0.1, 0.1); // makes camera follow the player

    this.cameras.main.setBounds(0, 0, 30000, 30000); // sets camera bounds (being a little extra)

    cursors = this.input.keyboard.createCursorKeys(); // sets up input 

    console.log("Phaser 'create' started. Calling connect...");

    connect(this)

    }

function update() {

    // todo: when I add the second player, make the update function track the *coordinates* of the second player

    

    if (!player) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-250);
        player.setFlipX(true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(250);
        player.setFlipX(false);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && Phaser.Input.Keyboard.JustDown(cursors.up) && jumpCounter < 1) {
        player.setVelocityY(-330);
        jumpCounter++;
    }
    if (player.body.blocked.down) {
        jumpCounter = 0;
        dashCounter = 0;
    }

    if (cursors.shift.isDown) {
        if (dashCounter < 1) {
        
        if (cursors.up.isDown && (cursors.right.isDown || cursors.left.isDown)) {
        
        player.setVelocityX(player.body.velocity.x * 2.5);
        player.setVelocityY(-400);
        this.time.delayedCall(200, () => {
            player.setVelocityX(100);
            player.setVelocityY(0);
            dashCounter++;
        });
        } else if (cursors.right.isDown || cursors.left.isDown) {
        player.setVelocityX(player.body.velocity.x * 2.5);
        this.time.delayedCall(200, () => {
            player.setVelocityX(100);
            dashCounter++;
        });
    }
        }
    }

    this.input.keyboard.on('keydown-R', function () {
        player.setPosition(5400, 7000); // resets player position to the hard coded coordinates
    });

    if (this.room && (player.body.velocity.x !== 0 || player.body.velocity.y !== 0)) {
        this.room.send("move", { x: player.x, y: player.y });
    }
}

async function connect(scene) {
    scene.Client = new Colyseus.Client(endpoint);
    console.log("Connecting to server at", endpoint);
    const room = await scene.Client.joinOrCreate("my_room");
    console.log("Joined room:", room.name);

}