import * as PIXI from 'pixi.js';
import GridState from './GridState';

export interface CellData {
  sun: number;
  water: number;
  hasPlant: boolean; // Added for tracking adjacency of plants
}

export default class GridManager {
  public gridState: GridState;
  public cellSize: number;
  public gridWidth: number;
  public gridHeight: number;
  public cells: PIXI.Graphics[][];
  public sunPlants: number;
  private container: PIXI.Container; // Container for grid cells

  constructor(
    container: PIXI.Container,
    cellSize: number,
    gridWidth: number,
    gridHeight: number,
  ) {
    this.container = container;
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
        const cell = new PIXI.Graphics();

        // Determine the color of the cell
        const isEvenTile = x % 2 === 0 && y % 2 === 0;
        const fillColor = isEvenTile ? 0xe6a165 : 0xcccccc; // Brown for even tiles, light grey for others

        // Draw the cell
        cell.beginFill(fillColor);
        cell.drawRect(
          x * this.cellSize,
          y * this.cellSize,
          this.cellSize - 2,
          this.cellSize - 2,
        );
        cell.endFill();

        // Position the cell in the container
        cell.position.set(
          x * this.cellSize + this.cellSize / 2,
          y * this.cellSize + this.cellSize / 2,
        );

        this.cells[y][x] = cell;
        this.container.addChild(cell);

        // Initialize cell data in GridState
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
        const randomSun = Math.floor(Math.random() * 101) + this.sunPlants; // Sun energy is immediate and lost
        const randomWater = Math.floor(Math.random() * 101); // Water accumulates

        const { plantType, plantLevel, sunLevel, waterLevel } =
          this.gridState.getCell(x, y);

        // Update sun and water levels
        const newSunLevel = randomSun + sunLevel; // Sun energy is overwritten each turn
        const newWaterLevel = Math.min(waterLevel + randomWater, 100); // Water accumulates, max value is 100

        this.gridState.setCell(
          x,
          y,
          plantType,
          plantLevel,
          newSunLevel,
          newWaterLevel,
        );
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
