import GridState from './GridState';
import Player from './Player';
import PlantManager from './PlantManager';
import Zombie from './Zombie';
import ZombieManager from './ZombieManager';
import DefaultScene from '../scenes/DefaultScene'; // Import the DefaultScene class
import Plant from './Plant';

export interface SavedGameState {
  gridState: number[]; // Serialized GridState
  playerPosition: { x: number; y: number };
  plants: { i: number; j: number; texture: string; sunLight: number; water: number; upgradeCost: number; growthLevel: number }[]; // Include necessary properties
  zombies: { i: number; j: number }[];
  totalSun: number; // Total sunlight
  totalWater: number; // Total water
}

export default class GameState {
  public gridState: GridState;
  public player: Player;
  public plantManager: PlantManager;
  public zombieManager: ZombieManager;
  public undoStack: SavedGameState[] = [];
  public redoStack: SavedGameState[] = [];
  public scene: DefaultScene;
  totalSun: number;
  totalWater: number;

  constructor(
    gridState: GridState,
    player: Player,
    plantManager: PlantManager,
    zombieManager: ZombieManager,
    scene: DefaultScene, // Pass the scene instance
  ) {
    this.gridState = gridState;
    this.player = player;
    this.plantManager = plantManager;
    this.zombieManager = zombieManager;
    this.scene = scene; // Assign the scene instance
    this.totalSun = 0;
    this.totalWater = 0;
  }

  // Serialize the current state
  public serialize(): string {
    const currentState = this.getCurrentState();
    return JSON.stringify(currentState);
  }

  // Deserialize and restore game state
  public static deserialize(
    data: string,
    gridState: GridState,
    player: Player,
    plantManager: PlantManager,
    zombieManager: ZombieManager,
    scene: DefaultScene,
  ): GameState {
    const savedState: SavedGameState = JSON.parse(data);
    console.log('saved state is ', savedState);
    const gameState = new GameState(
      gridState,
      player,
      plantManager,
      zombieManager,
      scene,
    );

    gameState.restoreState(savedState);
    return gameState;
  }

  public getGameState(): void {
    console.log('water ', this.scene.totalWater);
    console.log('state ', this.scene.gameState);
    this.saveState();
    console.log('new state ', this.scene.gameState.player);
  }

  // Save to a specific slot
  public saveToSlot(slotName: string): void {
    const serializedState = this.serialize();
    localStorage.setItem(slotName, serializedState);
    console.log(`Game saved to slot: ${slotName}`);
  }

  // Load from a specific slot
  public static loadFromSlot(
    slotName: string,
    gridState: GridState,
    player: Player,
    plantManager: PlantManager,
    zombieManager: ZombieManager,
    scene: DefaultScene,
  ): GameState | null {
    const serializedState = localStorage.getItem(slotName);
    if (!serializedState) {
      console.log(`No save data found in slot: ${slotName}`);
      return null;
    }
    console.log(`Game loaded from slot: ${slotName}`);
    return GameState.deserialize(
      serializedState,
      gridState,
      player,
      plantManager,
      zombieManager,
      scene,
    );
  }

  // List available save slots
  public static getAvailableSaveSlots(): string[] {
    return Object.keys(localStorage).filter((key) =>
      key.startsWith('saveSlot-'),
    );
  }

  // Save the current game state
  public saveState(): void {
    const gameState: SavedGameState = this.getCurrentState();
    this.undoStack.push(gameState);
    this.redoStack = []; // Clear redo stack after a new save
    console.log('Game state saved.');
  }

  // Undo the last action
  public undo(): void {
    if (this.undoStack.length > 1) {
      // Always leave one state for fallback
      const lastState = this.undoStack.pop();
      this.redoStack.push(lastState as SavedGameState);
      this.restoreState(this.undoStack[this.undoStack.length - 1]);
      console.log('Undo successful.');
    } else {
      console.log('No more undos available.');
    }
  }

  // Redo the last undone action
  public redo(): void {
    if (this.redoStack.length > 0) {
      const lastState = this.redoStack.pop();
      this.undoStack.push(lastState as SavedGameState);
      this.restoreState(lastState as SavedGameState);
      console.log('Redo successful.');
    } else {
      console.log('No more redos available.');
    }
  }

  // Get the current game state as a snapshot
  public getCurrentState(): SavedGameState {
    return {
      gridState: Array.from(this.gridState.getRawState()),
      playerPosition: { x: this.player.position.x, y: this.player.position.y },
      plants: this.plantManager.plants.map((plant) => ({
        i: plant.i,
        j: plant.j,
        texture: plant.texture,
        sunLight: plant.sunLight,
        water: plant.water,
        upgradeCost: plant.upgradeCost,
        growthLevel: plant.growthLevel,
      })),      zombies: this.zombieManager.zombies.map((z) => ({ i: z.i, j: z.j })),
      totalSun: this.scene.totalSun,
      totalWater: this.scene.totalWater,
    };
  }

  // Restore the game to a given state
  public restoreState(state: SavedGameState): void {
    if (!state) return;

    console.log('Restoring game state...');
    //find type of state.gridState
    console.log('Current state:', state.gridState.constructor.name);
    console.log('Current state:', state.gridState);
    const uint8 = new Uint8Array(state.gridState);
    this.gridState.loadRawState(uint8);
    this.player.setPosition(state.playerPosition.x, state.playerPosition.y);

    this.plantManager.destroyAllPlants();
    this.zombieManager.destroyAllZombies();

    this.plantManager.plants = state.plants.map((pData) => {
        const newPlant = new Plant(
          this.scene,
          pData.i,
          pData.j,
          pData.texture,
          pData.sunLight,
          pData.water,
          pData.upgradeCost,
          pData.growthLevel
        );
        return newPlant;
      });

    this.zombieManager.zombies = state.zombies.map((zData) => {
      const newZombie = new Zombie(this.scene, zData.i, zData.j, 'Zombie');
      return newZombie;
    });

    this.scene.totalSun = state.totalSun;
    this.scene.totalWater = state.totalWater;
    this.scene.updateSunAndWaterUI(this.scene.totalSun, this.scene.totalWater);

    console.log('Game state restored.');
  }

  public autoSave(): void {
    const serializedState = this.serialize();
    localStorage.setItem('autoSaveSlot', serializedState);
    console.log('Auto-saved game state.');
  }
}
