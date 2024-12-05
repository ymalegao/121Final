import Phaser from 'phaser';
import DefaultScene from '../scenes/DefaultScene';
import ZombieManager from './ZombieManager';

export default class Zombie {
  public i: number; // Current row on the grid
  public j: number; // Current column on the grid
  private scene: Phaser.Scene | null;
  public sprite: Phaser.GameObjects.Sprite | null; // Reference to the sprite object

  constructor(
    scene: Phaser.Scene | null,
    gridX: number,
    gridY: number,
    texture: string = 'Zombie',
  ) {
    this.scene = scene;
    this.i = gridX;
    this.j = gridY;

    if (scene) {
      // Create the zombie sprite if the scene is not null
      const { x, y } = this.getWorldPosition(gridX, gridY);
      this.sprite =
        this.scene?.add.sprite(x, y, texture).setOrigin(0.5).setScale(0.5) ||
        null;
    } else {
      this.sprite = null; // No sprite if no scene
    }
  }

  // Get the current state of the zombie
  getState(): { x: number; y: number } {
    return { x: this.i, y: this.j };
  }

  // Move the zombie forward one tile
  public move(): void {
    if (this.hasReachedEnd()) {
      this.destroy(); // Destroy the zombie if it reaches the end
      return;
    }

    // Decrement gridX to move left
    this.i -= 1;

    // Update the sprite position
    const { x, y } = this.getWorldPosition(this.i, this.j);
    if (this.sprite) {
      this.sprite.setPosition(x, y); // Update sprite position
    }
    console.log(`Zombie moved to (${this.i}, ${this.j})`);
  }

  // Check if the zombie has reached the end of the grid
  public hasReachedEnd(): boolean {
    if (this.i < 0) {
      console.log(`Zombie reached the end at (${this.i}, ${this.j})`);
      if (this.scene instanceof DefaultScene) {
        this.scene.gameOver(); // Trigger game over if needed
      }
      return true;
    }
    return false;
  }

  // Destroy the zombie sprite
  public destroy(): void {
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null; // Clear the reference to the sprite
      console.log(`Zombie destroyed at (${this.i}, ${this.j})`);
    }
  }

  // Get world position from grid coordinates
  private getWorldPosition(
    gridX: number,
    gridY: number,
  ): { x: number; y: number } {
    const cellSize = 64; // Assuming a fixed cell size
    return {
      x: gridX * cellSize + cellSize / 2,
      y: gridY * cellSize + cellSize / 2,
    };
  }

  // Move the zombie to a specific state
  public moveTo(state: { x: number; y: number }): void {
    this.i = state.x;
    this.j = state.y;
    this.redraw();
  }

  // Clone the zombie (without sprite and scene)
  public clone(): Zombie {
    return new Zombie(null, this.i, this.j); // Clone without creating a sprite
  }

  // Re-add the zombie to a specific scene
  public reAddToScene(scene: Phaser.Scene): void {
    this.scene = scene;
    const { x, y } = this.getWorldPosition(this.i, this.j);
    this.sprite = this.scene.add
      .sprite(x, y, 'Zombie')
      .setOrigin(0.5)
      .setScale(0.5);
  }

  // Redraw the zombie on the scene
  public redraw(): void {
    if (this.sprite) {
      this.sprite.destroy(); // Remove old sprite if exists
    }
    if (this.scene) {
      const { x, y } = this.getWorldPosition(this.i, this.j);
      this.sprite = this.scene.add
        .sprite(x, y, 'Zombie')
        .setOrigin(0.5)
        .setScale(0.5);
    }
  }
}
