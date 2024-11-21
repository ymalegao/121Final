import Phaser from 'phaser';
import GridManager from '../classes/GridManager';
import Player from '../classes/Player';
import PlantManager from '../classes/PlantManager';


export default class DefaultScene extends Phaser.Scene {
    private gridManager: GridManager;
    private player: Player;
    private plantManager: PlantManager;

    constructor() {
        super('DefaultScene');
    }

    public preload() {
        this.load.image('sunflower', '../assets/Sunflower.png');
        //scale down the image
        
    }

    create() {
       
        const cellSize = 64;
        const gridWidth = 10;
        const gridHeight = 10;

        this.gridManager = new GridManager(this, cellSize, gridWidth, gridHeight);
        this.player = new Player(this, this.gridManager, 0, 0);
        this.plantManager = new PlantManager(this, this.gridManager);

        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'ArrowUp') this.player.move('up');
            if (event.key === 'ArrowDown') this.player.move('down');
            if (event.key === 'ArrowLeft') this.player.move('left');
            if (event.key === 'ArrowRight') this.player.move('right');
        });

        this.input.keyboard.on('keydown-P', () => {
            this.plantManager.plant('sun', this.player.position.x, this.player.position.y);
        });
    }
}
