import Plant from './Plant';

export default class SunPlant extends Plant {
    constructor(scene: Phaser.Scene | null, gridX: number, gridY: number) {
        super(scene, gridX, gridY, 'sunflower');
        if (this.sprite) {
            this.sprite.setScale(0.05); // Set custom scale for the SunPlant
        }
    }

    public produceSun(): number {
        return 5 * this.growthLevel;
    }
}
