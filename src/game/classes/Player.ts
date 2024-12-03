import GridManager from './GridManager';

export default class Player {
    private scene: Phaser.Scene;
    private sprite: Phaser.GameObjects.Rectangle;
    private gridManager: GridManager;
    public position: { x: number; y: number };

    constructor(scene: Phaser.Scene, gridManager: GridManager, startX: number, startY: number) {
        this.scene = scene;
        this.gridManager = gridManager;
        this.position = { x: startX, y: startY };

        const { x, y } = gridManager.getCellWorldPosition(startX, startY);
        this.sprite = this.scene.add.rectangle(x, y, gridManager.cellSize / 2, gridManager.cellSize / 2, 0x00ff00);
    }

    public move(direction: 'up' | 'down' | 'left' | 'right'): void {
        let newX = this.position.x;
        let newY = this.position.y;

        if (direction === 'up') newY--;
        if (direction === 'down') newY++;
        if (direction === 'left') newX--;
        if (direction === 'right') newX++;

        if (this.gridManager.isWithinBounds(newX, newY)) {
            this.position = { x: newX, y: newY };
            const { x, y } = this.gridManager.getCellWorldPosition(newX, newY);
            this.sprite.setPosition(x, y);
        }
    }

    public setPosition(x: number, y: number): void {
        this.position = { x, y };
        const { x: worldX, y: worldY } = this.gridManager.getCellWorldPosition(x, y);
        this.sprite.setPosition(worldX, worldY);
    }
}



