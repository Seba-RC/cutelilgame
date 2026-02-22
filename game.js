var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    this.load.tilemapTiledJSON('map', 'assets/level1.json');
    
    // images
    this.load.image('grass_img', 'assets/platform.png');
    this.load.image('dirt_img', 'assets/dirt.png');
    this.load.image('dead_img', 'assets/deadgrass.png');
    this.load.image('cyan_img', 'assets/cyan.png');

    // goober player
    this.load.spritesheet('goober', 'assets/goober.png', {
        frameWidth: 320,
        frameHeight: 320,
    });
    // shamk player
    this.load.spritesheet('shamk', 'assets/shamk.png', {
        frameWidth: 320,
        frameHeight: 320,
    });
    
}

function create() {
    this.cameras.main.startFollow(player);

    const map = this.make.tilemap({ key: 'map' });

    const platformTiles = map.addTilesetImage('platform', 'grass_img');
    const dirtTiles = map.addTilesetImage('dirt', 'dirt_img');
    const deadgrassTiles = map.addTilesetImage('deadgrass', 'dead_img');
    const cyanTiles = map.addTilesetImage('cyan', 'cyan_img');

    const allTiles = [platformTiles, dirtTiles, deadgrassTiles, cyanTiles];
    const layer = map.createLayer('Tile Layer 1', allTiles, 0, 0);

}

function update() {

}
