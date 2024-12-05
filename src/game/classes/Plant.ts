interface IPlant {
    i: number;
    j: number;
    sunLight: number; // Required sunlight
    water: number; // Required water
    growthUnlocked: boolean; // Indicates if the plant can grow
    upgradeCost: number; // Cost to upgrade the plant
}

export default class Plant implements IPlant {
    public i: number; // Grid row
    public j: number; // Grid column
    protected scene: Phaser.Scene | null;
    protected growthLevel: number;
    public sprite: Phaser.GameObjects.Sprite | null;
    public texture: string;

    public sunLight: number; // Required sunlight
    public water: number; // Required water
    public growthUnlocked: boolean; // Can the plant grow
    public upgradeCost: number; // Upgrade cost for the plant

    constructor(
        scene: Phaser.Scene | null,
        gridX: number,
        gridY: number,
        texture: string,
        sunlight: number = 5, // Default sunlight requirement
        water: number = 5, // Default water requirement
        upgradeCost: number = 10, // Default upgrade cost
        growthLevel: number = 1 // Default growth level
    ) {
        this.scene = scene;
        this.i = gridX;
        this.j = gridY;
        this.growthLevel = growthLevel; // Start at level 1
        this.sunLight = sunlight;
        this.water = water;
        this.growthUnlocked = false;
        this.upgradeCost = upgradeCost;
        this.texture = texture; 

        if (scene) {
            const { x, y } = this.getWorldPosition(gridX, gridY);
            this.sprite = this.scene?.add.sprite(x, y, texture).setOrigin(0.5).setScale(0.5 * this.growthLevel / 20) || null;
        } else {
            this.sprite = null; // No sprite if no scene provided
        }
    }

    public destroy(): void {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
            console.log(`Plant destroyed at (${this.i}, ${this.j})`);
        }
    }

    public reAddToScene(scene: Phaser.Scene): void {
        this.scene = scene;
        const { x, y } = this.getWorldPosition(this.i, this.j);
        this.sprite = this.scene.add.sprite(x, y, this.texture).setOrigin(0.5).setScale(0.5 * this.growthLevel / 20);
    }

    // Calculate the world position based on grid coordinates
    private getWorldPosition(gridX: number, gridY: number): { x: number; y: number } {
        const cellSize = 64; // Assuming a fixed cell size
        return {
            x: gridX * cellSize + cellSize / 2,
            y: gridY * cellSize + cellSize / 2,
        };
    }

    public checkGrowthConditions(currentSunlight: number, currentWater: number): boolean {
        this.growthUnlocked = currentSunlight >= this.sunLight && currentWater >= this.water;
        return this.growthUnlocked;
    }

    public grow(): void {
        if (this.growthUnlocked) {
            this.growthLevel++;
            if (this.sprite) {
                this.sprite.setScale(0.5 * this.growthLevel / 20); // Increase size with growth
            }
        }
    }

    public applyAdjacentEffects(adjacentPlants: Plant[]): void {
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

    public clone(): Plant {
        return new Plant(null, this.i, this.j, this.texture, this.sunLight, this.water, this.upgradeCost, this.growthLevel);
    }
}
