import Phaser from 'phaser';
import GridManager from '../classes/GridManager';
import Player from '../classes/Player';

export default class DefaultScene extends Phaser.Scene {
    private gridManager: GridManager;
    private player: Player;

    constructor() {
        super('DefaultScene');
    }

    create() {
        const cellWidth = 64;
        const cellHeight = 32;
        const gridWidth = 10;
        const gridHeight = 10;

        this.gridManager = new GridManager(this, cellWidth, cellHeight, gridWidth, gridHeight);
        this.player = new Player(this, this.gridManager, 0, 0);

        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'ArrowUp') this.player.move('up');
            if (event.key === 'ArrowDown') this.player.move('down');
            if (event.key === 'ArrowLeft') this.player.move('left');
            if (event.key === 'ArrowRight') this.player.move('right');
        });
    }
}
