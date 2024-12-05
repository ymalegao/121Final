import GridState from './GridState';
import Player from './Player';
import PlantManager from './PlantManager';
import Zombie from './Zombie';
import ZombieManager from './ZombieManager';
import DefaultScene from '../scenes/DefaultScene'; // Import the DefaultScene class
import Plant from './Plant';

export interface SavedGameState {
    gridState: Uint8Array; // Serialized GridState
    playerPosition: { x: number; y: number };
    plants: Plant[]; // Array of plant objects with their states
    zombies: Zombie[]; // Array of zombies with their states
    totalSun: number; // Total sunlight
    totalWater: number; // Total water
}

export default class GameState {
    private gridState: GridState;
    private player: Player;
    private plantManager: PlantManager;
    private zombieManager: ZombieManager;
    private undoStack: SavedGameState[] = [];
    private redoStack: SavedGameState[] = [];
    private scene: DefaultScene;

    constructor(
        gridState: GridState,
        player: Player,
        plantManager: PlantManager,
        zombieManager: ZombieManager,
        scene: DefaultScene // Pass the scene instance
    ) {
        this.gridState = gridState;
        this.player = player;
        this.plantManager = plantManager;
        this.zombieManager = zombieManager;
        this.scene = scene; // Assign the scene instance
    }

    // Save the current game state
    public saveState(): void {
        const gameState: SavedGameState = {
            gridState: this.gridState.getRawState(),
            playerPosition: { x: this.player.position.x, y: this.player.position.y },
            plants: this.plantManager.plants.map(plant => plant.clone()),
            zombies: this.zombieManager.zombies.map(zombie => zombie.clone()),
            totalSun: this.scene.totalSun,
            totalWater: this.scene.totalWater,
        };

        this.undoStack.push(gameState);
        this.redoStack = [];
        console.log('Game state saved.');
    }

    // Restore the game to a given state
    public restoreState(state: SavedGameState): void {
        if (!state) return;

        // Restore grid state
        this.gridState.loadRawState(state.gridState);

        // Restore player position
        this.player.setPosition(state.playerPosition.x, state.playerPosition.y);

        // Destroy existing plants and zombies
        this.plantManager.destroyAllPlants();
        this.zombieManager.destroyAllZombies();

        // Restore plants
        this.plantManager.plants = state.plants.map(plantClone => {
            plantClone.reAddToScene(this.scene);
            return plantClone;
        });

        // Restore zombies
        this.zombieManager.zombies = state.zombies.map(zombieClone => {
            zombieClone.reAddToScene(this.scene);
            return zombieClone;
        });

        // Restore resources
        this.scene.totalSun = state.totalSun;
        this.scene.totalWater = state.totalWater;
        this.scene.updateSunAndWaterUI(this.scene.totalSun, this.scene.totalWater);

        console.log('Game state restored.');
    }

    // Undo the last action
    public undo(): void {
        if (this.undoStack.length > 0) {
            const lastState = this.undoStack.pop();
            this.redoStack.push(lastState as SavedGameState);
            this.restoreState(this.undoStack[this.undoStack.length - 1]);
        }
    }

    // Redo the last undone action
    public redo(): void {
        if (this.redoStack.length > 0) {
            const lastState = this.redoStack.pop();
            this.undoStack.push(lastState as SavedGameState);
            this.restoreState(lastState as SavedGameState);
        }
    }
}
