import * as PIXI from 'pixi.js';
import GridManager from './GridManager';
import Plant from './Plant';
import SunPlant from './SunPlant';
import AttackPlant from './AttackPlant';

export default class PlantManager {
  public container: PIXI.Container; // Parent container for plant sprites
  private gridManager: GridManager;
  public plants: Plant[]; // Array of Plant objects

  constructor(container: PIXI.Container, gridManager: GridManager) {
    this.container = container;
    this.gridManager = gridManager;
    this.plants = []; // Initialize an empty list of plants
  }

  // Add a plant to the grid
  public plant(type: string, gridX: number, gridY: number): void {
    // Check if the position is valid and unoccupied
    if (
      !this.gridManager.isWithinBounds(gridX, gridY) ||
      this.getPlantAt(gridX, gridY)
    ) {
      console.log('Cannot plant here.');
      return;
    }

    // Create the appropriate plant type
    let plant: Plant;
    switch (type) {
      case 'sun':
        plant = new SunPlant(this.container, gridX, gridY);
        break;
      case 'attack':
        plant = new AttackPlant(this.container, gridX, gridY);
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
    return (
      this.plants.find((plant) => plant.i === gridX && plant.j === gridY) ||
      null
    );
  }

  // Update all plants
  public updatePlants(): void {
    this.plants.forEach((plant) => {
      const { i, j } = plant;

      // Retrieve the cell data
      const { sunLevel, waterLevel, plantType, plantLevel } =
        this.gridManager.gridState.getCell(i, j);

      // Check growth conditions
      if (plant.checkGrowthConditions(sunLevel, waterLevel)) {
        plant.grow();

        // Update the byte array in GridState
        this.gridManager.gridState.setCell(
          i,
          j,
          plantType,
          plantLevel + 1,
          sunLevel,
          Math.max(waterLevel - 5, 0),
        );
      }

      // Apply adjacency effects
      const adjacentPlants = this.getAdjacentPlants(i, j);
      plant.applyAdjacentEffects(adjacentPlants);
    });
  }

  // Destroy all plants
  public destroyAllPlants(): void {
    this.plants.forEach((plant) => {
      plant.destroy(); // Destroy the plant sprite
    });
    this.plants = []; // Clear the plants array
    console.log('All plants destroyed.');
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
      .filter((pos) => this.gridManager.isWithinBounds(pos.i, pos.j))
      .map((pos) => this.getPlantAt(pos.i, pos.j))
      .filter((plant): plant is Plant => plant !== null);
  }
}
