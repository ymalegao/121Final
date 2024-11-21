import Plant from './Plant';

export default class SunPlant extends Plant {




    constructor(scene: Phaser.Scene, gridX: number, gridY: number) {


        super(scene, gridX, gridY, 'sunflower'); 
        this.sprite.setScale(0.1);
    }

    public produceSun(): number {
        return 5 * this.growthLevel; 
    }
}
