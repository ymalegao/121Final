import Plant from './Plant';

export default class SunPlant extends Plant {
  constructor(scene, gridX, gridY) {
    super(scene, gridX, gridY, 'sunflower');
    if (this.sprite) {
      this.sprite.setScale(0.05); // Set custom scale for the SunPlant
    }
  }

  produceSun() {
    return 5 * this.growthLevel;
  }
}
