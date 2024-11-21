import GridManager from './GridManager';
import Plant from './Plant';
import SunPlant from './SunPlant';

export default class PlantManager {
    private scene: Phaser.Scene;
    private gridManager: GridManager;
    private plants: Plant[]; // Array of Plant objects

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
            default:
                console.log('Invalid plant type.');
                return;
        }

        // Add the plant to the list
        this.plants.push(plant);
    }

    // Grow the plant at a specific grid position
    public growPlant(gridX: number, gridY: number): void {
        const plant = this.getPlantAt(gridX, gridY);
        if (plant) {
            plant.grow();
        }
    }

    // Get the plant at a specific grid position
    public getPlantAt(gridX: number, gridY: number): Plant | null {
        return this.plants.find((plant) => plant.i === gridX && plant.j === gridY) || null;
    }
}
