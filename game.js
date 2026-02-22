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
    

    const platformTiles = map.addTilesetImage('platform', 'grass_img');
    const dirtTiles = map.addTilesetImage('dirt', 'dirt_img');
    const deadgrassTiles = map.addTilesetImage('deadgrass', 'dead_img');
    const cyanTiles = map.addTilesetImage('cyan', 'cyan_img');
    const deadgrassTiles2 = map.addTilesetImage('deadgrass', 'dead_img');


    const allTiles = [platformTiles, dirtTiles, deadgrassTiles, cyanTiles, deadgrassTiles2];
    const layer = map.createLayer('Tile Layer 1', allTiles, 0, 0);

    
    layer.setCollisionBetween(1, 1000);

    player = this.physics.add.sprite(5400, 7000, 'goober').setScale(0.2); 

    this.physics.add.collider(player, layer);

    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    this.cameras.main.setBounds(0, 0, 30000, 30000);

    cursors = this.input.keyboard.createCursorKeys();

    }

function update() {

    if (!player) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.setFlipX(true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.setFlipX(false);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-400);
    }
}