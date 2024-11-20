import Phaser from 'phaser';

export default class DefaultScene extends Phaser.Scene {
    constructor() {
        super('DefaultScene');
    }

    preload() {
        // Preload assets here (e.g., images, sounds)
    }

    create() {
        // Add basic elements to confirm the scene works
        this.add.text(400, 300, 'Default Scene', {
            font: '32px Arial',
            color: '#ffffff',
        }).setOrigin(0.5);

        // Example: Add a simple event for debugging
        this.input.on('pointerdown', () => {
            console.log('Pointer clicked in Default Scene');
        });
    }

    // update(time: number, delta: number) {
    //     // Add frame-by-frame logic here
    // }
}
