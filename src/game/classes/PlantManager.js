import GridManager from './GridManager';
import Plant from './Plant';
import SunPlant from './SunPlant';
import AttackPlant from './AttackPlant';

export default class PlantManager {
  constructor(scene, gridManager) {
    this.scene = scene;
    this.gridManager = gridManager;
    this.plants = []; // Initialize an empty list of plants
  }

  // Add a plant to the grid
  plant(type, gridX, gridY) {
    // Check if the position is valid and unoccupied
    if (
      !this.gridManager.isWithinBounds(gridX, gridY) ||
      this.getPlantAt(gridX, gridY)
    ) {
      console.log('Cannot plant here.');
      return;
    }

    // Create the appropriate plant type
    let plant;
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

  //Destroying Plant
  removePlant(plant) {
    // Remove the plant from the array
    const index = this.plants.indexOf(plant);
    if (index !== -1) {
      this.plants.splice(index, 1);
    }

    // Remove the plant from the scene
    plant.destroy();  // Assuming each plant has a `destroy()` method to remove it from the scene
  }

  // Get the plant at a specific grid position
  getPlantAt(gridX, gridY) {
    return (
      this.plants.find((plant) => plant.i === gridX && plant.j === gridY) ||
      null
    );
  }



  // Update all plants
  updatePlants() {
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
  destroyAllPlants() {
    this.plants.forEach((plant) => {
      plant.destroy(); // Destroy the plant sprite
    });
    this.plants = []; // Clear the plants array
    console.log('All plants destroyed.');
  }

  // Redraw all plants
  // redrawPlants() {
  //     this.plants.forEach((plant) => {
  //         plant.redraw(); // Recreate sprite using the plant's own method
  //     });
  // }

  // Get adjacent plants
  getAdjacentPlants(gridX, gridY) {
    const adjacentPositions = [
      { i: gridX - 1, j: gridY },
      { i: gridX + 1, j: gridY },
      { i: gridX, j: gridY - 1 },
      { i: gridX, j: gridY + 1 },
    ];

    return adjacentPositions
      .filter((pos) => this.gridManager.isWithinBounds(pos.i, pos.j))
      .map((pos) => this.getPlantAt(pos.i, pos.j))
      .filter((plant) => plant !== null);
  }
}
