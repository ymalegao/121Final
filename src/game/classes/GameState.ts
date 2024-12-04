import GridState from './GridState';
import Player from './Player';
import PlantManager from './PlantManager';
import Plant from './Plant';
import Zombie from './Zombie';
import DefaultScene from '../scenes/DefaultScene'; // Import the DefaultScene class

export interface SavedGameState {
    gridState: Uint8Array; // Serialized GridState
    playerPosition: { x: number; y: number };
    plants: any[]; // Array of plant objects with their states
    zombies: Zombie[]; // Array of zombies with their states
    totalSun: number; // Total sunlight
    totalWater: number; // Total water
}

export default class GameState {
    private gridState: GridState;
    private player: Player;
    private plantManager: PlantManager;
    private zombies: any[];
    private undoStack: SavedGameState[] = [];
    private redoStack: SavedGameState[] = [];
    private scene: DefaultScene;

    constructor(
        gridState: GridState,
        player: Player,
        plantManager: PlantManager,
        zombies: any[],
        scene: DefaultScene // Pass the scene instance
    ) {
        this.gridState = gridState;
        this.player = player;
        this.plantManager = plantManager;
        this.zombies = zombies.map(zombie => zombie.getState());;
        this.scene = scene; // Assign the scene instance
    }
     // Serialize the game state for saving
     public serialize(): string {
        const currentState = this.getCurrentState();
        return JSON.stringify(currentState);
    }

    // Deserialize and restore game state
    public static deserialize(data: string, gridState: GridState, player: Player, plantManager: PlantManager, zombies: any[], scene: DefaultScene): GameState {
        const savedState: SavedGameState = JSON.parse(data);
        const gameState = new GameState(gridState, player, plantManager, zombies, scene);
        gameState.restoreState(savedState);
        return gameState;
    }

    // Save the current game state
    public saveState(): void {
        console.log('saveState called');
        console.log('undoStack before save:', this.undoStack.length);
        console.log('redoStack before save:', this.redoStack.length);
        const gameState: SavedGameState = {
            gridState: this.gridState.getRawState(), // Serialize the grid state
            playerPosition: { x: this.player.position.x, y: this.player.position.y },
            plants: this.plantManager.plants.map(plant => plant.getState()), // Clone plant objects
            zombies: this.zombies.map(zombie => zombie.getWorldPosition()), // Clone zombie objects
            totalSun: this.scene.totalSun, // Access totalSun from the scene
            totalWater: this.scene.totalWater, // Access totalWater from the scene
        };

        this.undoStack.push(gameState); // Push the current state to the undo stack
        this.redoStack = []; // Clear the redo stack
        console.log(this.undoStack);
        console.log('Game state saved.');
        console.log('undoStack after save:', this.undoStack.length);
    }

    // Undo the last action
    public undo(): void {
        if (this.undoStack.length === 0) {
            console.log('No more undos available.');
            return;
        }

        // Save the current state to the redo stack
        const currentState = this.getCurrentState();
        this.redoStack.push(currentState);

        // Restore the last state from the undo stack
        const previousState = this.undoStack.pop();
        if (previousState) {
            this.restoreState(previousState); // Pass in the previous state
            console.log('Undo successful.');
        }
    }

    // Redo the last undone action
    public redo(): void {
        if (this.redoStack.length === 0) {
            console.log('No more redos available.');
            return;
        }

        // Save the current state to the undo stack
        this.undoStack.push(this.getCurrentState());

        // Restore the last state from the redo stack
        const nextState = this.redoStack.pop();
        if (nextState) {
            this.restoreState(nextState);
            console.log('Redo successful.');
        } else {
            console.log('Unexpected error: Redo stack returned undefined.');
        }
    }

    // Get the current game state as a snapshot
    public getCurrentState(): SavedGameState {
        return {
            gridState: this.gridState.getRawState(),
            playerPosition: { x: this.player.position.x, y: this.player.position.y },
            plants: this.plantManager.plants.map(plant => plant.clone()),
            zombies: this.zombies.map(zombie => zombie.clone()),
            totalSun: this.scene.totalSun,
            totalWater: this.scene.totalWater,
        };
    }

    // Restore the game to a given state
    public restoreState(state: SavedGameState): void {
        if (!state) return;

        // Restore grid state
        this.gridState.loadRawState(state.gridState);

        // Restore player position
        this.player.setPosition(state.playerPosition.x, state.playerPosition.y);

        // Restore plants
        this.plantManager.plants = state.plants.map(plant => plant.clone());
        this.plantManager.redrawPlants(); // Ensure visual updates for plants

        // Restore zombies
        this.zombies.forEach(zombie => zombie.destroy()); // Remove current zombies
        this.zombies = state.zombies.map(zombie => zombie.clone());
        this.zombies.forEach(zombie => zombie.redraw()); // Redraw zombies at correct positions

        // Restore resources
        this.scene.totalSun = state.totalSun;
        this.scene.totalWater = state.totalWater;
        this.scene.updateSunAndWaterUI(state.totalSun, state.totalWater); // Update the UI

        console.log('Game state restored.');
    }
}
