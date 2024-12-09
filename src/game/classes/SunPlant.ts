import * as PIXI from 'pixi.js';
import Plant from './Plant';

export default class SunPlant extends Plant {
  constructor(container: PIXI.Container | null, gridX: number, gridY: number) {
    super(container, gridX, gridY, 'sunflower'); // Assuming 'sunflower' texture exists

    if (this.sprite) {
      this.sprite.scale.set(0.05); // Set custom scale for the SunPlant
    }
  }

  // Method to produce sun points based on the growth level
  public produceSun(): number {
    return 5 * this.growthLevel;
  }
}
