import * as PIXI from 'pixi.js';
import Plant from './Plant';

export default class AttackPlant extends Plant {
  public gridX: number; // Store grid position
  public gridY: number; // Store grid position

  constructor(container: PIXI.Container | null, gridX: number, gridY: number) {
    super(container, gridX, gridY, 'attackPlant'); // Assuming 'attackPlant' texture exists

    this.gridX = gridX; // Store the grid X position
    this.gridY = gridY; // Store the grid Y position

    if (this.sprite) {
      this.sprite.scale.set(0.25); // Set custom scale for the AttackPlant
      // Additional logic for physics or collision detection can be added here
    }
  }

  // Custom collision detection (if needed)
  public checkCollision(target: PIXI.Sprite): boolean {
    if (!this.sprite) return false;

    const bounds1 = this.sprite.getBounds();
    const bounds2 = target.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }
}
