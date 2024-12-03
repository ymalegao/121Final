import GridManager from './GridManager';
import Plant from './Plant';
import SunPlant from './SunPlant';
import AttackPlant from './AttackPlant';

export default class PlantManager {
    private scene: Phaser.Scene;
    private gridManager: GridManager;
    public plants: Plant[]; // Array of Plant objects


    constructor(scene: Phaser.Scene, gridManager: GridManager) {
        this.scene = scene;
        this.gridManager = gridManager;
        this.plants = []; // Initialize an empty list of plants
    }

    // Add a plant to the grid
    public plant(type: 'sun' | 'attack' | 'water', gridX: number, gridY: number): void {
        // Check if the position is valid and unoccupied
        if (!this.gridManager.isWithinBounds(gridX, gridY) || this.getPlantAt(gridX, gridY)) {
            console.log('Cannot plant here.');
            return;
        }

        // Create the appropriate plant type
        let plant: Plant;
        switch (type) {
            case 'sun':
                plant = new SunPlant(this.scene, gridX, gridY);
                break;
            case 'attack':
                plant = new AttackPlant(this.scene, gridX, gridY);
            break;
            default:
                console.log('Invalid plant type.');
                return;
        }

        // Add the plant to the list
        this.plants.push(plant);
        const cellData = this.gridManager.getCellResources(gridX, gridY);
        if (cellData) {
            this.gridManager.gridState.setCell(gridX, gridY, 1, 1, cellData.sun, cellData.water);
        }
        console.log(`Planted ${type} at (${gridX}, ${gridY})`);
    }

    // Get the plant at a specific grid position
    public getPlantAt(gridX: number, gridY: number): Plant | null {
        return this.plants.find((plant) => plant.i === gridX && plant.j === gridY) || null;
    }

    // Get adjacent plants
    public getAdjacentPlants(gridX: number, gridY: number): Plant[] {
        const adjacentPositions = [
            { i: gridX - 1, j: gridY },
            { i: gridX + 1, j: gridY },
            { i: gridX, j: gridY - 1 },
            { i: gridX, j: gridY + 1 },
        ];

        return adjacentPositions
            .filter(pos => this.gridManager.isWithinBounds(pos.i, pos.j))
            .map(pos => this.getPlantAt(pos.i, pos.j))
            .filter((plant): plant is Plant => plant !== null);
    }

    // Update all plants
    public updatePlants(): void {
        this.plants.forEach((plant) => {
            const { i, j } = plant;

            // Retrieve the cell data
            const { sunLevel, waterLevel, plantType, plantLevel } = this.gridManager.gridState.getCell(i, j);

            // Check growth conditions
            if (plant.checkGrowthConditions(sunLevel, waterLevel)) {
                plant.grow();

                // Update the byte array in GridState
                this.gridManager.gridState.setCell(i, j, plantType, plantLevel + 1, sunLevel, Math.max(waterLevel - 5, 0));
                // this.gridState.setCell(i, j, plantType, plantLevel + 1, 0, Math.max(waterLevel - 5, 0));
            }


            // Apply adjacency effects
            const adjacentPlants = this.getAdjacentPlants(i, j);
            plant.applyAdjacentEffects(adjacentPlants);

        });
    }

    public redrawPlants(): void {
        // Clear all existing plant sprites
        this.plants.forEach((plant) => {
            if (plant.sprite) {
                plant.sprite.destroy(); // Destroy old sprite
            }
            const { x, y } = this.gridManager.getCellWorldPosition(plant.i, plant.j);
            plant.sprite = this.scene.add.sprite(x, y, 'plant').setOrigin(0.5).setScale(0.5);
        });
    }
}
