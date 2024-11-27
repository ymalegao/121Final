import GridManager from './GridManager';
import Plant from './Plant';
import SunPlant from './SunPlant';
import AttackPlant from './AttackPlant';
import { CellData } from './GridManager';

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
            case 'attack':
                plant = new AttackPlant(this.scene, gridX, gridY);
            break;
            default:
                console.log('Invalid plant type.');
                return;
        }

        // Add the plant to the list
        this.plants.push(plant);
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
            const cellData: CellData = this.gridManager.cells[i][j].getData('cellData');

            // Check growth conditions
            if (plant.checkGrowthConditions(cellData.sun, cellData.water)) {
                plant.grow();
                cellData.sun = 0; // Reset sun
                cellData.water -= 5; // Deduct water
            }

            // Apply adjacency effects
            const adjacentPlants = this.getAdjacentPlants(i, j);
            plant.applyAdjacentEffects(adjacentPlants);

            // Update the cell data in the grid
            this.gridManager.cells[i][j].setData('cellData', cellData);
        });
    }
}
