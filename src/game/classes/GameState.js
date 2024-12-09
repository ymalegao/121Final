import GridState from './GridState';
import Player from './Player';
import PlantManager from './PlantManager';
import Zombie from './Zombie';
import ZombieManager from './ZombieManager';
import DefaultScene from '../scenes/DefaultScene'; // Import the DefaultScene class
import Plant from './Plant';

export default class GameState {
  constructor(
    gridState,
    player,
    plantManager,
    zombieManager,
    scene // Pass the scene instance
  ) {
    this.gridState = gridState;
    this.player = player;
    this.plantManager = plantManager;
    this.zombieManager = zombieManager;
    this.scene = scene; // Assign the scene instance
    this.totalSun = 0;
    this.totalWater = 0;
    this.undoStack = [];
    this.redoStack = [];
  }

  // Serialize the current state
  serialize() {
    const currentState = this.getCurrentState();
    return JSON.stringify(currentState);
  }

  // Deserialize and restore game state
  static deserialize(
    data,
    gridState,
    player,
    plantManager,
    zombieManager,
    scene
  ) {
    const savedState = JSON.parse(data);
    console.log('saved state is ', savedState);
    const gameState = new GameState(
      gridState,
      player,
      plantManager,
      zombieManager,
      scene
    );

    gameState.restoreState(savedState);
    return gameState;
  }

  getGameState() {
    console.log('water ', this.scene.totalWater);
    console.log('state ', this.scene.gameState);
    this.saveState();
    console.log('new state ', this.scene.gameState.player);
  }

  // Save to a specific slot
  saveToSlot(slotName) {
    const serializedState = this.serialize();
    localStorage.setItem(slotName, serializedState);
    console.log(`Game saved to slot: ${slotName}`);
  }

  // Load from a specific slot
  static loadFromSlot(
    slotName,
    gridState,
    player,
    plantManager,
    zombieManager,
    scene
  ) {
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
      scene
    );
  }

  // List available save slots
  static getAvailableSaveSlots() {
    return Object.keys(localStorage).filter((key) =>
      key.startsWith('saveSlot-')
    );
  }

  // Save the current game state
  saveState() {
    const gameState = this.getCurrentState();
    this.undoStack.push(gameState);
    this.redoStack = []; // Clear redo stack after a new save
    console.log('Game state saved.');
  }

  // Undo the last action
  undo() {
    if (this.undoStack.length > 1) {
      // Always leave one state for fallback
      const lastState = this.undoStack.pop();
      this.redoStack.push(lastState);
      this.restoreState(this.undoStack[this.undoStack.length - 1]);
      console.log('Undo successful.');
    } else {
      console.log('No more undos available.');
    }
  }

  // Redo the last undone action
  redo() {
    if (this.redoStack.length > 0) {
      const lastState = this.redoStack.pop();
      this.undoStack.push(lastState);
      this.restoreState(lastState);
      console.log('Redo successful.');
    } else {
      console.log('No more redos available.');
    }
  }

  // Get the current game state as a snapshot
  getCurrentState() {
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
      })),
      zombies: this.zombieManager.zombies.map((z) => ({ i: z.i, j: z.j })),
      totalSun: this.scene.totalSun,
      totalWater: this.scene.totalWater,
    };
  }

  // Restore the game to a given state
  restoreState(state) {
    if (!state) return;

    console.log('Restoring game state...');
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

  autoSave() {
    const serializedState = this.serialize();
    localStorage.setItem('autoSaveSlot', serializedState);
    console.log('Auto-saved game state.');
  }
}
