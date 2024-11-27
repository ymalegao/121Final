import Plant from './Plant';
import Phaser from 'phaser';

export default class AttackPlant extends Plant {
    public gridX: number; // Store grid position
    public gridY: number; // Store grid position

    constructor(scene: Phaser.Scene, gridX: number, gridY: number) {
        super(scene, gridX, gridY, 'attackPlant');  // Assuming 'peashooter' texture exists
        this.sprite.setScale(0.25);
        this.gridX = gridX; // Store the grid X position
        this.gridY = gridY; // Store the grid Y position
        
        // Enable physics on the plant for collision detection
        this.scene.physics.world.enable(this.sprite);
    }
}