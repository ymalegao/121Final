import * as PIXI from 'pixi.js';
import GridManager from './GridManager';
import Zombie from './Zombie';

export default class ZombieManager {
  public container: PIXI.Container; // Parent container for zombie sprites
  private gridManager: GridManager;
  public zombies: Zombie[]; // Array of zombie objects

  constructor(container: PIXI.Container, gridManager: GridManager) {
    this.container = container;
    this.gridManager = gridManager;
    this.zombies = []; // Initialize an empty list of zombies
  }

  public spawnZombie(): void {
    const gridX = this.gridManager.gridWidth + 4.5; // Set to the far-right column of the grid
    const gridY = Math.floor(
      Math.random() * this.gridManager.gridHeight
    ); // Random row
    const zombie = new Zombie(this.container, gridX, gridY, 'Zombie'); // Use the correct texture key

    // Adjust the zombie's world position to align with the far-right column of the grid
    if (zombie.sprite) {
      const { x, y } = zombie.getWorldPosition(gridX, gridY);
      zombie.sprite.position.set(x, y); // Set position to grid-aligned coordinates
    }

    this.zombies.push(zombie);
    console.log(
      `Zombie spawned at grid position (${gridX}, ${gridY}) - far-right column`
    );
  }

  // Get zombie at specific grid coordinates
  public getZombieAt(gridX: number, gridY: number): Zombie | null {
    return (
      this.zombies.find((zombie) => zombie.i === gridX && zombie.j === gridY) ||
      null
    );
  }

  // Move all zombies
  public moveZombies(): void {
    for (let index = this.zombies.length - 1; index >= 0; index--) {
      const zombie = this.zombies[index];

      // Check if the zombie has reached the end of the grid
      if (zombie.hasReachedEnd()) {
        zombie.destroy(); // Destroy the sprite
        this.zombies.splice(index, 1); // Remove the zombie from the array
        console.log('Zombie removed from array at index:', index);
        continue; // Skip to the next iteration
      }

      // Move the zombie
      zombie.move();
    }
  }

  // Redraw all zombies in the container
  public redrawZombies(): void {
    this.zombies.forEach((zombie) => {
      zombie.redraw();
    });
  }

  // Destroy all zombies
  public destroyAllZombies(): void {
    this.zombies.forEach((zombie) => {
      zombie.destroy(); // Properly destroy each zombie
    });
    this.zombies = []; // Clear the zombies array
    console.log('All zombies destroyed.');
  }

  // Update all zombies (move them and potentially spawn new ones)
  public updateZombies(): void {
    this.moveZombies();
    const randomZombieSpawnChance: number = Math.random() * 100;
    if (randomZombieSpawnChance > 50) {
      this.spawnZombie();
    }
  }
}
