import GridState from './GridState';
import Player from './Player';
import PlantManager from './PlantManager';
import ZombieManager from './ZombieManager';
import DefaultScene from '../scenes/DefaultScene';
import GameState from './GameState';

export class SaveManager {
  static saveGame(slotName: string, gameState: GameState): void {
    // const serializedState = gameState.serialize();
    // const serializedState = JSON.stringify(gameState);
    // localStorage.setItem(`save_${slotName}`, serializedState);
    alert(`Game saved to slot: ${slotName}`);
  }

  static loadGame(
    slotName: string,
    gridState: GridState,
    player: Player,
    plantManager: PlantManager,
    zombieManager: ZombieManager,
    scene: DefaultScene,
  ): GameState | null {
    const serializedState = localStorage.getItem(`save_${slotName}`);
    if (serializedState) {
      return GameState.deserialize(
        serializedState,
        gridState,
        player,
        plantManager,
        zombieManager,
        scene,
      );
    }
    alert('No save data found for the selected slot.');
    return null;
  }

  static getSaveSlots(): string[] {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith('save_'))
      .map((key) => key.replace('save_', ''));
  }

  static deleteSave(slotName: string): void {
    localStorage.removeItem(`save_${slotName}`);
    alert(`Save slot ${slotName} deleted.`);
  }
}
