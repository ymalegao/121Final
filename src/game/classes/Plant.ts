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
    protected scene: Phaser.Scene;
    protected growthLevel: number;
    public sprite: Phaser.GameObjects.Sprite;

    public sunLight: number; // Required sunlight
    public water: number; // Required water
    public growthUnlocked: boolean; // Can the plant grow
    public upgradeCost: number; // Upgrade cost for the plant

    constructor(
        scene: Phaser.Scene,
        gridX: number,
        gridY: number,
        texture: string,
        sunlight: number = 5, // Default sunlight requirement
        water: number = 5, // Default water requirement
        upgradeCost: number = 10 // Default upgrade cost
    ) {
        this.scene = scene;
        this.i = gridX;
        this.j = gridY;
        this.growthLevel = 1; // Start at level 1
        this.sunLight = sunlight;
        this.water = water;
        this.growthUnlocked = false;
        this.upgradeCost = upgradeCost;

        const { x, y } = this.getWorldPosition(gridX, gridY);
        this.sprite = this.scene.add.sprite(x, y, texture).setOrigin(0.5).setScale(0.5);
    }

    getState() {
        return { x: this.i, y: this.j, type: this.sprite };
    }

    // Calculate the world position based on grid coordinates
    private getWorldPosition(gridX: number, gridY: number): { x: number; y: number } {
        const cellSize = 64; // Assuming a fixed cell size
        return {
            x: gridX * cellSize + cellSize / 2,
            y: gridY * cellSize + cellSize / 2,
        };
    }

    // Check growth conditions based on sunlight and water
    public checkGrowthConditions(currentSunlight: number, currentWater: number): boolean {
        if (currentSunlight >= this.sunLight && currentWater >= this.water) {
            this.growthUnlocked = true;
        } else {
            this.growthUnlocked = false;
        }
        return this.growthUnlocked;
    }

    // Grow the plant
    public grow(): void {
        if (this.growthUnlocked) {
            this.growthLevel++;
            this.sprite.setScale(0.5 * this.growthLevel / 20); // Increase size with growth
        }
    }

    public getGrowthLevel(): number {
        return this.growthLevel;
    }

    public applyAdjacentEffects(adjacentPlants: Plant[]): void {
        let sameTypeCount = 0;

        adjacentPlants.forEach((plant) => {
            if (plant instanceof Plant && plant.constructor === this.constructor) {
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
        return new Plant(this.scene, this.i, this.j, 'plant', this.sunLight, this.water, this.upgradeCost);
    }

    
    
}
