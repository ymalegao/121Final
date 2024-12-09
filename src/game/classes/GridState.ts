class GridState {
  private gridWidth: number;
  private gridHeight: number;
  private stateArray: Uint8Array;

  constructor(gridWidth: number, gridHeight: number) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    // Each cell uses 4 bytes: plantType, plantLevel, sunLevel, waterLevel
    this.stateArray = new Uint8Array(gridWidth * gridHeight * 4);
  }

  // Convert grid coordinates (x, y) to a 1D index
  private getIndex(x: number, y: number): number {
    if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) {
      throw new Error(`Coordinates (${x}, ${y}) are out of bounds`);
    }
    return (y * this.gridWidth + x) * 4;
  }

  // Get the state of a cell
  public getCell(
    x: number,
    y: number,
  ): {
    plantType: number;
    plantLevel: number;
    sunLevel: number;
    waterLevel: number;
  } {
    const index = this.getIndex(x, y);
    return {
      plantType: this.stateArray[index],
      plantLevel: this.stateArray[index + 1],
      sunLevel: this.stateArray[index + 2],
      waterLevel: this.stateArray[index + 3],
    };
  }

  // Update the state of a cell
  public setCell(
    x: number,
    y: number,
    plantType: number,
    plantLevel: number,
    sunLevel: number,
    waterLevel: number,
  ): void {
    const index = this.getIndex(x, y);
    this.stateArray[index] = plantType;
    this.stateArray[index + 1] = plantLevel;
    this.stateArray[index + 2] = sunLevel;
    this.stateArray[index + 3] = waterLevel;
  }

  // Clear a cell
  public clearCell(x: number, y: number): void {
    this.setCell(x, y, 0, 0, 0, 0);
  }

  // Reset the entire grid
  public reset(): void {
    this.stateArray.fill(0);
  }

  // Get the raw byte array (for saving/loading)
  public getRawState(): Uint8Array {
    return new Uint8Array(this.stateArray); // Return a copy
  }

  // Load a raw byte array into the grid
  public loadRawState(data: Uint8Array): void {
    if (data.length !== this.stateArray.length) {
      throw new Error('Invalid state array size');
    }
    this.stateArray.set(data);
  }
}

export default GridState;
