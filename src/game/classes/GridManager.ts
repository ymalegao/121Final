export default class GridManager {
    private scene: Phaser.Scene;
    public cellSize: number;
    public gridWidth: number;
    public gridHeight: number;
    public cells: Phaser.GameObjects.Rectangle[][];

    constructor(scene: Phaser.Scene, cellSize: number, gridWidth: number, gridHeight: number) {
        this.scene = scene;
        this.cellSize = cellSize;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.cells = [];

        this.createGrid();
    }

    private createGrid(): void {
        for (let y = 0; y < this.gridHeight; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.scene.add.rectangle(
                    x * this.cellSize + this.cellSize / 2,
                    y * this.cellSize + this.cellSize / 2,
                    this.cellSize - 2,
                    this.cellSize - 2,
                    0xcccccc
                ).setOrigin(0.5);
                this.cells[y][x] = cell;
            }
        }
    }

    public getCellWorldPosition(x: number, y: number): { x: number; y: number } {
        return {
            x: x * this.cellSize + this.cellSize / 2,
            y: y * this.cellSize + this.cellSize / 2,
        };
    }

    public isWithinBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight;
    }
}
