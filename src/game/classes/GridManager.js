import GridState from './GridState';

export default class GridManager {
  gridManager = null;
  scene = null;
  gridState = null;
  cellSize = 0;
  gridWidth = 0;
  gridHeight = 0;
  cells = [];
  sunPlants = 0;

  constructor(scene, cellSize, gridWidth, gridHeight) {
    this.scene = scene;
    this.cellSize = cellSize;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cells = [];
    this.sunPlants = 0;
    this.gridState = new GridState(gridWidth, gridHeight);

    this.createGrid();
  }

  preload() {
    this.load.image('grass', '././assets/Grass.png');
  }

  createGrid() {
    for (let y = 0; y < this.gridHeight; y++) {
      this.cells[y] = [];
      for (let x = 0; x < this.gridWidth; x++) {
        const cell = this.scene.add
          .rectangle(
            x * this.cellSize + this.cellSize / 2,
            y * this.cellSize + this.cellSize / 2,
            this.cellSize - 2,
            this.cellSize - 2,
            //0x50C878, // Light grey (default color)
            // Check if the tile is even (both x and y are even), then change the color to brown
            x % 2 === 0 && y % 2 === 0 ? 0x4F7942 : 0x228B22, // Brown for even tiles, light grey for others
          )
          .setOrigin(0.5);
        this.cells[y][x] = cell;

        // Initialize cell data for each grid cell (initial sun and water levels)
        this.gridState.setCell(x, y, 0, 0, 0, 0);
      }
    }
  }

  getCellWorldPosition(x, y) {
    return {
      x: x * this.cellSize + this.cellSize / 2,
      y: y * this.cellSize + this.cellSize / 2,
    };
  }

  isWithinBounds(x, y) { 
    return x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight;
  }

  // Update Sun and Water levels
  updateSunAndWaterLevels() {
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        // Generate random sun and water levels
        const randomSun = Phaser.Math.Between(0, 1) + this.sunPlants; // Sun energy is immediate and lost
        const randomWater = Phaser.Math.Between(0, 1); // Water accumulates

        const { plantType, plantLevel, sunLevel, waterLevel } =
          this.gridState.getCell(x, y);
        // Get cell data

        // Update sun and water levels
        const newSunLevel = randomSun + sunLevel; // Sun energy is overwritten each turn
        const newWaterLevel = Math.min(waterLevel + randomWater, 100); // Water accumulates, but max value is 100

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
  getCellResources(x, y) {
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