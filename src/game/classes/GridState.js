class GridState {
  constructor(gridWidth, gridHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    // Each cell uses 4 bytes: plantType, plantLevel, sunLevel, waterLevel
    this.stateArray = new Uint8Array(gridWidth * gridHeight * 4);
  }

  // Convert grid coordinates (x, y) to a 1D index
  getIndex(x, y) {
    return (y * this.gridWidth + x) * 4;
  }

  // Get the state of a cell
  getCell(x, y) {
    const index = this.getIndex(x, y);
    console.log("plantLevel", this.stateArray[index + 1]);

    return {
      plantType: this.stateArray[index],
      plantLevel: this.stateArray[index + 1],
      sunLevel: this.stateArray[index + 2],
      waterLevel: this.stateArray[index + 3],
    };
  }

  // Update the state of a cell
  setCell(x, y, plantType, plantLevel, sunLevel, waterLevel) {
    const index = this.getIndex(x, y);
    this.stateArray[index] = plantType;
    this.stateArray[index + 1] = plantLevel;
    this.stateArray[index + 2] = sunLevel;
    this.stateArray[index + 3] = waterLevel;
  }

  // Get the raw byte array (for saving/loading)
  getRawState() {
    return new Uint8Array(this.stateArray); // Return a copy
  }

  // Load a raw byte array into the grid
  loadRawState(data) {
    if (data.length !== this.stateArray.length) {
      throw new Error('Invalid state array size');
    }
    this.stateArray.set(data);
  }
}

export default GridState;
