export default class Plant {
  constructor(
    scene,
    gridX,
    gridY,
    texture,
    sunlight = 5, // Default sunlight requirement
    water = 5, // Default water requirement
    upgradeCost = 10, // Default upgrade cost
    growthLevel = 1 // Default growth level
  ) {
    this.scene = scene;
    this.i = gridX; // Grid row
    this.j = gridY; // Grid column
    this.growthLevel = growthLevel; // Start at level 1
    this.sunLight = sunlight; // Required sunlight
    this.water = water; // Required water
    this.growthUnlocked = false; // Indicates if the plant can grow
    this.upgradeCost = upgradeCost; // Upgrade cost for the plant
    this.texture = texture; // Plant texture
    this.type = ''; // Type property (can be set dynamically)

    if (scene) {
      const { x, y } = this.getWorldPosition(gridX, gridY);
      this.sprite = this.scene.add
        .sprite(x, y, texture)
        .setOrigin(0.5)
        .setScale((0.5 * this.growthLevel) / 20);
    } else {
      this.sprite = null; // No sprite if no scene provided
    }
  }

  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
      this.sprite = null;
      console.log(`Plant destroyed at (${this.i}, ${this.j})`);
    }
  }

  reAddToScene(scene) {
    this.scene = scene;
    const { x, y } = this.getWorldPosition(this.i, this.j);
    this.sprite = this.scene.add
      .sprite(x, y, this.texture)
      .setOrigin(0.5)
      .setScale((0.5 * this.growthLevel) / 20);
  }

  // Calculate the world position based on grid coordinates
  getWorldPosition(gridX, gridY) {
    const cellSize = 64; // Assuming a fixed cell size
    return {
      x: gridX * cellSize + cellSize / 2,
      y: gridY * cellSize + cellSize / 2,
    };
  }

  getBounds() {
    const x = this.i * 64 + 32; // Calculate X position
    const y = this.j * 64 + 32; // Calculate Y position
    const width = 64;  // Cell width
    const height = 64; // Cell height
    return new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height);
  }

  checkGrowthConditions(currentSunlight, currentWater) {
    this.growthUnlocked =
      currentSunlight >= this.sunLight && currentWater >= this.water;
    return this.growthUnlocked;
  }

  grow() {
    if (this.growthUnlocked) {
      this.growthLevel++;
      if (this.sprite) {
        this.sprite.setScale((0.5 * this.growthLevel) / 20); // Increase size with growth
      }
    }
  }

  applyAdjacentEffects(adjacentPlants) {
    let sameTypeCount = 0;

    adjacentPlants.forEach((plant) => {
      if (plant.constructor === this.constructor) {
        sameTypeCount++;
      }
    });

    if (sameTypeCount > 0) {
      const discount = 10; // Example discount value per adjacent plant
      this.upgradeCost -= discount * sameTypeCount;
      if (this.upgradeCost < 0) this.upgradeCost = 0;
    }
  }

  clone() {
    return new Plant(
      null,
      this.i,
      this.j,
      this.texture,
      this.sunLight,
      this.water,
      this.upgradeCost,
      this.growthLevel
    );
  }
}
