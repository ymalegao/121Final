// export interface CellData {
//     sun: number;
//     water: number;
// }

// export default class GridManager {
//     private scene: Phaser.Scene;
//     public cellSize: number;
//     public gridWidth: number;
//     public gridHeight: number;
//     public cells: Phaser.GameObjects.Rectangle[][];

//     constructor(scene: Phaser.Scene, cellSize: number, gridWidth: number, gridHeight: number) {
//         this.scene = scene;
//         this.cellSize = cellSize;
//         this.gridWidth = gridWidth;
//         this.gridHeight = gridHeight;
//         this.cells = [];

//         this.createGrid();
//     }

//     private createGrid(): void {
//         for (let y = 0; y < this.gridHeight; y++) {
//             this.cells[y] = [];
//             for (let x = 0; x < this.gridWidth; x++) {
//                 const cell = this.scene.add.rectangle(
//                     x * this.cellSize + this.cellSize / 2,
//                     y * this.cellSize + this.cellSize / 2,
//                     this.cellSize - 2,
//                     this.cellSize - 2,
//                     0xcccccc
//                 ).setOrigin(0.5);
//                 this.cells[y][x] = cell;

//                 // Initialize cell data for each grid cell
//                 cell.setData('cellData', { sun: 0, water: 0 } as CellData);
//             }
//         }
//     }

//     public getCellWorldPosition(x: number, y: number): { x: number; y: number } {
//         return {
//             x: x * this.cellSize + this.cellSize / 2,
//             y: y * this.cellSize + this.cellSize / 2,
//         };
//     }

//     public isWithinBounds(x: number, y: number): boolean {
//         return x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight;
//     }

//     public updateSunAndWaterLevels(): void {
//         for (let y = 0; y < this.gridHeight; y++) {
//             for (let x = 0; x < this.gridWidth; x++) {
//                 // Generate random sun and water levels
//                 const randomSun = Phaser.Math.Between(0, 5); // Sun energy is immediate
//                 const randomWater = Phaser.Math.Between(0, 3); // Water accumulates

//                 // Get cell data
//                 const cellData: CellData = this.cells[y][x].getData('cellData');

//                 // Update sun and water levels
//                 cellData.sun = randomSun; // Overwrite sun
//                 cellData.water = Math.min(cellData.water + randomWater, 10); // Accumulate water

//                 // Store the updated data back in the cell
//                 this.cells[y][x].setData('cellData', cellData);
//             }
//         }
//     }
// }


// F0.d Grid Cells have sun and water levels (Implementation)

export interface CellData {
    sun: number;
    water: number;
    hasPlant: boolean; //Added for tracking adjacency of plants
}

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

                // Initialize cell data for each grid cell (initial sun and water levels)
                cell.setData('cellData', { sun: 0, water: 0 } as CellData);
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

    // Update Sun and Water levels
    public updateSunAndWaterLevels(): void {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                // Generate random sun and water levels
                const randomSun = Phaser.Math.Between(0, 5); // Sun energy is immediate and lost
                const randomWater = Phaser.Math.Between(0, 3); // Water accumulates

                // Get cell data
                const cellData: CellData = this.cells[y][x].getData('cellData');

                // Update sun and water levels
                cellData.sun = randomSun; // Sun energy is overwritten each turn
                cellData.water = Math.min(cellData.water + randomWater, 10); // Water accumulates, but max value is 10

                // Store the updated data back in the cell
                this.cells[y][x].setData('cellData', cellData);
                console.log(cellData.sun);
                console.log(cellData.water);
            }
        }
    }

    // Get the cell resources (sun and water levels) safely
    public getCellResources(x: number, y: number): CellData | null {
        if (this.isWithinBounds(x, y)) {
            return this.cells[y][x].getData('cellData');
        }
        return null;
    }
}