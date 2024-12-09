import Plant from './Plant';
import Phaser from 'phaser';

export default class AttackPlant extends Plant {
  constructor(scene, gridX, gridY) {
    super(scene, gridX, gridY, 'attackPlant'); // Assuming 'peashooter' texture exists
    if (this.sprite) {
      this.sprite.setScale(0.25); // Set custom scale for the AttackPlant
      this.scene?.physics.world.enable(this.sprite); // Enable physics for collision detection
    }
    this.gridX = gridX; // Store the grid X position
    this.gridY = gridY; // Store the grid Y position

    // Enable physics on the plant for collision detection
  }
}
