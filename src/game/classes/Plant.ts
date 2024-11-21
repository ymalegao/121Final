interface IPlant {
    i: number;
    j: number;
}

export default class Plant implements IPlant {
    public i: number; // Grid row
    public j: number; // Grid column
    protected scene: Phaser.Scene;
    protected growthLevel: number;
    protected sprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, gridX: number, gridY: number, texture: string) {
        this.scene = scene;
        this.i = gridX;
        this.j = gridY;
        this.growthLevel = 1; // Start at level 1

        const { x, y } = this.getWorldPosition(gridX, gridY);
        this.sprite = this.scene.add.sprite(x, y, texture).setOrigin(0.5).setScale(0.5);
    }

    // Calculate the world position based on grid coordinates
    protected getWorldPosition(gridX: number, gridY: number): { x: number; y: number } {
        const cellSize = 64; // Assuming a fixed cell size
        return {
            x: gridX * cellSize + cellSize / 2,
            y: gridY * cellSize + cellSize / 2,
        };
    }

    // Grow the plant
    public grow(): void {
        this.growthLevel++;
        this.sprite.setScale(0.5 + 0.2 * this.growthLevel); // Increase the size with growth
    }

    public getGrowthLevel(): number {
        return this.growthLevel;
    }
}
