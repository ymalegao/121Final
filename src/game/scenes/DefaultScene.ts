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
    private baseCostSun: number = 100;
    private baseCostWater: number = 75;

    constructor() {
        super('DefaultScene');
    }

    public preload() {
        this.load.image('sunflower', '../assets/Sunflower.png');
    }

    create() {
        const cellSize = 64;
        const gridWidth = 10;
        const gridHeight = 10;
        //let baseCostSun = 100;
        //let baseCostWater = 75;

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

        // Place sunflower
        this.input.keyboard.on('keydown-P', () => {
            this.plantManager.plant('sun', this.player.position.x, this.player.position.y);
            //console.log(this.sunText);
        });

        // Progress turn -> Receive Sun and Water
        this.input.keyboard.on('keydown-N', () => {
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
    
        // Update the counters and progress bars once, after summing up
        this.updateSunAndWaterUI(totalSun, totalWater);
        
        

        // Add event listener for planting with the 'P' key (Calculating how much plant costs)
        document.addEventListener('keydown', (event) => {
            if (event.key === 'P' || event.key === 'p') { // Check if 'P' (or lowercase 'p') is pressed
                if (totalSun >= 100 && totalWater >= 75) { // Ensure sufficient resources
                    if( (this.plantManager.getAdjacentPlants(this.player.position.x, this.player.position.y)).length == 1){
                        // Discount for adjacency
                        totalSun -= this.baseCostSun * .5;
                        totalWater -= this.baseCostWater * .5;
                        this.updateSunAndWaterUI(totalSun, totalWater);
                    }
                    else{
                        totalSun -= this.baseCostSun;
                        totalWater -= this.baseCostWater;
                        this.updateSunAndWaterUI(totalSun, totalWater);
                    }
                } else {
                    console.log("Not enough resources to plant!");
                }
            }
        });
    }
    
    // Helper method to update both sun and water UI components
    private updateSunAndWaterUI(totalSun: number, totalWater: number): void {
        // Update the text displays
        this.sunText.setText(`Sun: ${totalSun}`);
        this.waterText.setText(`Water: ${totalWater}`);
    
        // Calculate progress percentages
        const sunPercentage = Phaser.Math.Clamp(
            totalSun / (this.gridManager.gridWidth * this.gridManager.gridHeight * 5),
            0,
            1
        );
        const waterPercentage = Phaser.Math.Clamp(
            totalWater / (this.gridManager.gridWidth * this.gridManager.gridHeight * 10),
            0,
            1
        );
    
        // Update the sun bar
        this.sunBar.clear();
        this.sunBar.fillStyle(0xFFFF00, 1); // Yellow for sun
        this.sunBar.fillRect(100, 10, 200 * sunPercentage, 20);
    
        // Update the water bar
        this.waterBar.clear();
        this.waterBar.fillStyle(0x1E90FF, 1); // Blue for water
        this.waterBar.fillRect(120, 34, 200 * waterPercentage, 20);
    }
    
}
