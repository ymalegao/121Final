import Phaser from 'phaser';
import DefaultScene from '../scenes/DefaultScene'; 


export default class Zombie {
    public i: number; // Current row on the grid
    public j: number; // Current column on the grid
    private scene: DefaultScene; // Use the correct type here
    private sprite: Phaser.GameObjects.Sprite;

    constructor(scene: DefaultScene, gridX: number, gridY: number, texture: string = 'zombie') {
        this.scene = scene;
        this.i = gridX;
        this.j = gridY;

        // Create the zombie sprite
        const { x, y } = this.getWorldPosition(gridX, gridY);
        this.sprite = this.scene.add.sprite(x, y, texture).setOrigin(0.5).setScale(0.5);
    }

    getState() {
        return { x: this.i, y: this.j };
    }

    // Calculate the world position based on grid coordinates
    private getWorldPosition(gridX: number, gridY: number): { x: number; y: number } {
        const cellSize = this.scene.gridManager.cellSize; // Access cell size from GridManager
        return {
            x: gridX * cellSize + cellSize / 2,
            y: gridY * cellSize + cellSize / 2,
        };
    }

    // Move the zombie forward one tile
    public move(): void {
        this.i -= 1; // Decrement gridX to move left
        const { x, y } = this.getWorldPosition(this.i, this.j);
        this.sprite.setPosition(x, y); // Update sprite position
        console.log(`Zombie moved to (${this.i}, ${this.j})`);
    }
    

    // Check if the zombie has reached the end of the grid
    public hasReachedEnd(): boolean {
        if (this.i < 0) {
            (this.scene as DefaultScene).gameOver(); // Trigger game over
            return true;
        }
        return false;
    }

    public clone(): Zombie {    
        return new Zombie(this.scene, this.i, this.j, 'Zombie');
    }

    public redraw(): void {
        if (this.sprite) {
            this.sprite.destroy(); // Remove old sprite
        }
        const { x, y } = this.getWorldPosition(this.i, this.j);
        this.sprite = this.scene.add.sprite(x, y, 'zombie').setOrigin(0.5).setScale(0.5);
    }
        
    
    

    // Destroy the zombie sprite
    public destroy(): void {
        this.sprite.destroy();
        console.log(`Zombie destroyed at (${this.i}, ${this.j})`);
    }
}
