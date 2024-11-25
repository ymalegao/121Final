// F0.d Grid Cells have sun and water levels (Implementation)
// Sun and Water indicator / feature or progress bar for growth

import Phaser from 'phaser';
import GridManager from '../classes/GridManager';
import Player from '../classes/Player';
import PlantManager from '../classes/PlantManager';

export default class DefaultScene extends Phaser.Scene {
    private gridManager: GridManager;
    private player: Player;
    private plantManager: PlantManager;
    private sunText: Phaser.GameObjects.Text;
    private waterText: Phaser.GameObjects.Text;
    private sunBar: Phaser.GameObjects.Graphics;
    private waterBar: Phaser.GameObjects.Graphics;

    constructor() {
        super('DefaultScene');
    }

    public preload() {
        console.log('Preloading assets...');

        this.load.image('sunflower', '/121Final//assets/Sunflower.png');
        this.load.image('chomper', '/121Final//assets/Chomper.png');
    }

    create() {
        const cellSize = 64;
        const gridWidth = 10;
        const gridHeight = 10;

        this.gridManager = new GridManager(this, cellSize, gridWidth, gridHeight);
        this.player = new Player(this, this.gridManager, 0, 0);
        this.plantManager = new PlantManager(this, this.gridManager);

        // Player movement controls
        this.input.keyboard.on('keydown', (event: { key: string }) => {
            if (event.key === 'ArrowUp') this.player.move('up');
            if (event.key === 'ArrowDown') this.player.move('down');
            if (event.key === 'ArrowLeft') this.player.move('left');
            if (event.key === 'ArrowRight') this.player.move('right');
        });

        // Plant sunflower
        this.input.keyboard.on('keydown-P', () => {
            this.plantManager.plant('sun', this.player.position.x, this.player.position.y);
        });

        // Advance turn logic
        this.input.keyboard.on('keydown-Space', () => {
            this.advanceTurn();
        });

        // Create UI elements for sun and water
        this.createResourceDisplay();
    }

    private createResourceDisplay() {
        // Text for Sun and Water
        this.sunText = this.add.text(16, 16, 'Sun: 0', { fontSize: '16px', color: '#fff' });
        this.waterText = this.add.text(16, 40, 'Water: 0', { fontSize: '16px', color: '#fff' });

        // Progress bars for Sun and Water
        this.sunBar = this.add.graphics();
        this.sunBar.fillStyle(0xFFFF00, 1); // Yellow for sun
        this.sunBar.fillRect(100, 10, 200, 20); // Create a placeholder bar

        this.waterBar = this.add.graphics();
        this.waterBar.fillStyle(0x1E90FF, 1); // Blue for water
        this.waterBar.fillRect(100, 34, 200, 20); // Create a placeholder bar
    }

    private advanceTurn(): void {
        console.log('Advancing time...');
        
        // Update sun and water levels for all cells
        this.gridManager.updateSunAndWaterLevels(); 
        
        // Check plant growth based on updated sun and water levels
        this.plantManager.updatePlants(); 
        
        // Update the sun and water resource display
        this.updateResourceDisplay();
    }

    private updateResourceDisplay() {
        let totalSun = 0;
        let totalWater = 0;

        // Sum up the sun and water values for all cells
        for (let y = 0; y < this.gridManager.gridHeight; y++) {
            for (let x = 0; x < this.gridManager.gridWidth; x++) {
                const cellData = this.gridManager.getCellResources(x, y);
                if (cellData) {
                    totalSun += cellData.sun;
                    totalWater += cellData.water;
                }
            }
        }

        // Update the text display
        this.sunText.setText(`Sun: ${totalSun}`);
        this.waterText.setText(`Water: ${totalWater}`);

        // Update the progress bars
        const sunPercentage = Phaser.Math.Clamp(totalSun / (this.gridManager.gridWidth * this.gridManager.gridHeight * 5), 0, 1);
        const waterPercentage = Phaser.Math.Clamp(totalWater / (this.gridManager.gridWidth * this.gridManager.gridHeight * 10), 0, 1);

        this.sunBar.clear();
        this.sunBar.fillStyle(0xFFFF00, 1); // Yellow for sun
        this.sunBar.fillRect(100, 10, 200 * sunPercentage, 20);

        this.waterBar.clear();
        this.waterBar.fillStyle(0x1E90FF, 1); // Blue for water
        this.waterBar.fillRect(100, 34, 200 * waterPercentage, 20);
    }
}
