import GridState from './GridState';

export interface CellData {
  sun: number;
  water: number;
  hasPlant: boolean; //Added for tracking adjacency of plants
}

export default class GridManager {
  public gridManager: GridManager;
  private scene: Phaser.Scene;
  public gridState: GridState;
  public cellSize: number;
  public gridWidth: number;
  public gridHeight: number;
  public cells: Phaser.GameObjects.Rectangle[][];
  public sunPlants: number;

  constructor(
    scene: Phaser.Scene,
    cellSize: number,
    gridWidth: number,
    gridHeight: number,
  ) {
    this.scene = scene;
    this.cellSize = cellSize;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cells = [];
    this.sunPlants = 0;
    this.gridState = new GridState(gridWidth, gridHeight);

    this.createGrid();
  }

  private createGrid(): void {
    for (let y = 0; y < this.gridHeight; y++) {
      this.cells[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        const cell = this.scene.add
          .rectangle(
            x * this.cellSize + this.cellSize / 2,
            y * this.cellSize + this.cellSize / 2,
            this.cellSize - 2,
            this.cellSize - 2,
            0xcccccc, // Light grey
          )
          .setOrigin(0.5);
        this.cells[y][x] = cell;

        // Initialize cell data for each grid cell (initial sun and water levels)
        this.gridState.setCell(x, y, 0, 0, 0, 0);
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
        const randomSun = Phaser.Math.Between(0, 100) + this.sunPlants; // Sun energy is immediate and lost
        const randomWater = Phaser.Math.Between(0, 100); // Water accumulates

        const { plantType, plantLevel, sunLevel, waterLevel } =
          this.gridState.getCell(x, y);
        // Get cell data

        // Update sun and water levels
        const newSunLevel = randomSun + sunLevel; // Sun energy is overwritten each turn
        const newWaterLevel = Math.min(waterLevel + randomWater, 100); // Water accumulates, but max value is 10

        this.gridState.setCell(
          x,
          y,
          plantType,
          plantLevel,
          newSunLevel,
          newWaterLevel,
        );

        // Store the updated data back in the cell
      }
    }
  }

  // Get the cell resources (sun and water levels) safely
  public getCellResources(x: number, y: number): CellData | null {
    if (this.isWithinBounds(x, y)) {
      const { sunLevel, waterLevel, plantType } = this.gridState.getCell(x, y);

      return {
        sun: sunLevel,
        water: waterLevel,
        hasPlant: plantType > 0,
      };
    }
    return null;
  }
}
