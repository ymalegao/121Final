import Phaser from 'phaser';
import GridManager from '../classes/GridManager';
import Player from '../classes/Player';
import PlantManager from '../classes/PlantManager';
import ZombieManager from '../classes/ZombieManager';
import GameState from '../classes/GameState';
// import InputManager from './InputManager';
import { parseDSL, applyScenarioToGame } from '../../DSL/DSLParser';

export default class DefaultScene extends Phaser.Scene {
  public gridManager: GridManager;
  public isGameOver: boolean = false;
  public player: Player;
  public plantManager: PlantManager;
  public zombieManager: ZombieManager;
  public sunText: Phaser.GameObjects.Text;
  public waterText: Phaser.GameObjects.Text;
  public sunBar: Phaser.GameObjects.Graphics;
  public waterBar: Phaser.GameObjects.Graphics;
  public baseCostSun: number = 100;
  public baseCostWater: number = 100;
  public gameState: GameState;
  public totalSun: number;
  public totalWater: number;

  constructor() {
    super('DefaultScene');
  }

  public preload() {
    //IF YOU ARE PUSHING TO GITHUB USE /121Final//assets/... INSTEAD OF ../assets/... IDK WHY
    //THIS IS FOR THE GITHUB PAGES
    // this.load.image('sunflower', '/121Final//assets/Sunflower.png');
    // this.load.image('Zombie', '/121Final//assets/Chomper.png');
    // this.load.image('attackPlant', '/121Final//assets/attackPlant.png');

    // THIS IS FOR LOCAL TESTING
    this.load.image('sunflower', '../assets/Sunflower.png');
    this.load.image('Zombie', '../assets/Chomper.png');
    this.load.image('attackPlant', '../assets/attackPlant.png');
  }

  async create() {
    const cellSize = 64;
    const gridWidth = 10;
    const gridHeight = 10;
    const scenario = await parseDSL('./src/DSL/gameplayscenario.dsl')
    //let baseCostSun = 100;
    //let baseCostWater = 75;

    this.isGameOver = false; // Reset the game-over flag

    this.gridManager = new GridManager(this, cellSize, gridWidth, gridHeight);
    this.player = new Player(this, this.gridManager, 0, 0);
    this.plantManager = new PlantManager(this, this.gridManager);
    this.zombieManager = new ZombieManager(this, this.gridManager);
    this.gameState = new GameState(
      this.gridManager.gridState,
      this.player,
      this.plantManager,
      this.zombieManager,
      this,
    );

    applyScenarioToGame(scenario, this.gameState, this.gridManager, this.plantManager, this.zombieManager);
    console.log('Scenario applied properly', scenario);


    // Player movement controls
    if (this.input && this.input.keyboard) {
      this.input.keyboard.on('keydown', (event: { key: string }) => {
        if (
          event.key === 'ArrowUp' ||
          event.key === 'ArrowDown' ||
          event.key === 'ArrowLeft' ||
          event.key === 'ArrowRight'
        ) {
          this.gameState.saveState();
        }
        if (event.key === 'ArrowUp') this.player.move('up');
        if (event.key === 'ArrowDown') this.player.move('down');
        if (event.key === 'ArrowLeft') this.player.move('left');
        if (event.key === 'ArrowRight') this.player.move('right');
      });

      this.input.keyboard.on('keydown-Z', () => {
        console.log(
          'sun and water resource before undo: ' +
            this.totalSun +
            ' ' +
            this.totalWater,
        );
        this.gameState.undo();
        console.log(
          'sun and water resource after undo: ' +
            this.totalSun +
            ' ' +
            this.totalWater,
        );
      });

      this.input.keyboard.on('keydown-Y', () => {
        this.gameState.redo();
      });

      // Progress turn -> Receive Sun and Water
      this.input.keyboard.on('keydown-N', () => {
        this.gameState.saveState(); // Save the current state
        this.advanceTurn();
        this.gameState.autoSave();
        console.log('water ', this.totalWater);
        console.log(' state ', this.gameState);
        this.gameState.saveState();
        console.log(' new state ', this.gameState);
      });

      // Create UI elements for sun and water
      this.createResourceDisplay();
    }

    const autoSaveExists = localStorage.getItem("autoSaveSlot") !== null;
        console.log("Auto-save exists: ", autoSaveExists);
    if (autoSaveExists) {
        const continueGame = confirm("An auto-save is available. Continue where you left off?");
        if (continueGame) {
            const loadedState = GameState.loadFromSlot(
                "autoSaveSlot",
                this.gridManager.gridState,
                this.player,
                this.plantManager,
                this.zombieManager,
                this,
            );
            if (loadedState) {
                this.gameState = loadedState;
            }
        } else {
            // Start fresh: do nothing or initialize a new GameState as normal.
        }
    } else {
        // No auto-save available, just start fresh as usual.
    }


    this.input.keyboard.on('keydown-S', () => {
        const slotName = prompt('Enter a save slot name:');
        if (slotName) {
          this.gameState.saveToSlot(`saveSlot-${slotName}`);
        }
      });
  
      // Load game from a slot
      this.input.keyboard.on('keydown-L', () => {
        const slotName = prompt('Enter a save slot name to load:');
        if (slotName) {
          const loadedState = GameState.loadFromSlot(
            `saveSlot-${slotName}`,
            this.gridManager.gridState,
            this.player,
            this.plantManager,
            this.zombieManager,
            this,
          );
          if (loadedState) {
            this.gameState = loadedState;
          }
        }
      });
  
      // List available slots
      this.input.keyboard.on('keydown-B', () => {
        console.log(GameState.getAvailableSaveSlots());
      });

    // Method to get the current game state
  }
  
  // Method to load a saved game state
  // public loadGameState() {
  //     this.gameState.restoreState(this.gameState.undoStack.pop());
  // }

  private createResourceDisplay() {
    // Text for Sun and Water
    this.sunText = this.add.text(16, 16, 'Sun: 0', {
      fontSize: '16px',
      color: '#fff',
    });
    this.waterText = this.add.text(16, 40, 'Water: 0', {
      fontSize: '16px',
      color: '#fff',
    });

    // Progress bars for Sun and Water
    this.sunBar = this.add.graphics();
    this.sunBar.fillStyle(0xffff00, 0); // Yellow for sun
    this.sunBar.fillRect(100, 10, 200, 20); // Create a placeholder bar

    this.waterBar = this.add.graphics();
    this.waterBar.fillStyle(0x1e90ff, 0); // Blue for water
    this.waterBar.fillRect(100, 34, 200, 20); // Create a placeholder bar
  }

  private advanceTurn(): void {
    console.log('Advancing time...');

    // Stop advancing if the game is over
    if (this.isGameOver) {
      return;
    }

    // Update grid resources and plants
    this.gridManager.updateSunAndWaterLevels();
    this.plantManager.updatePlants();
    this.zombieManager.updateZombies();

    // Update UI resources
    this.updateResourceDisplay();
  }

  //reverse turn
  // private reverseTurn(): void {
  //     console.log(could not reverse turn);
  // }

  public updateResourceDisplay() {
    // Sum up the sun and water values for all cells
    for (let y = 0; y < this.gridManager.gridHeight; y++) {
      for (let x = 0; x < this.gridManager.gridWidth; x++) {
        const cellData = this.gridManager.getCellResources(x, y);
        if (cellData) {
          this.totalSun = cellData.sun;
          this.totalWater = cellData.water;
        }
      }
    }

    // Update the counters and progress bars once, after summing up
    this.updateSunAndWaterUI(this.totalSun, this.totalWater);

    // Add event listener for planting with the 'P' key (Calculating how much plant costs)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'P' || event.key === 'p') {
        // Check if 'P' (or lowercase 'p') is pressed
        if (this.totalSun >= 100 && this.totalWater >= 75) {
          // Ensure sufficient resources
          if (
            this.plantManager.getAdjacentPlants(
              this.player.position.x,
              this.player.position.y,
            ).length > 0
          ) {
            // changed to > 0, used to be == 1
            // Discount for adjacency
            this.totalSun -= this.baseCostSun * 0.5;
            this.totalWater -= this.baseCostWater * 0.5;
            this.updateSunAndWaterUI(this.totalSun, this.totalWater);
          } else {
            this.totalSun -= this.baseCostSun;
            this.totalWater -= this.baseCostWater;
            this.updateSunAndWaterUI(this.totalSun, this.totalWater);
          }
          this.plantManager.plant(
            'sun',
            this.player.position.x,
            this.player.position.y,
          );
          this.gridManager.sunPlants += 1;
        } else {
          console.log('Not enough resources to plant!');
        }
      }

      if (event.key === 'A' || event.key === 'a') {
        // plant attack plant
        if (this.totalSun >= 100 && this.totalWater >= 75) {
          // check if enough resources
          if (
            this.plantManager.getAdjacentPlants(
              this.player.position.x,
              this.player.position.y,
            ).length > 0
          ) {
            this.totalSun -= this.baseCostSun * 0.5; // discount for adjacent positioning
            this.totalWater -= this.baseCostWater * 0.5;
            this.updateSunAndWaterUI(this.totalSun, this.totalWater);
          } else {
            this.totalSun -= this.baseCostSun;
            this.totalWater -= this.baseCostWater;
            this.updateSunAndWaterUI(this.totalSun, this.totalWater);
          }
          this.plantManager.plant(
            'attack',
            this.player.position.x,
            this.player.position.y,
          );
        }
      }
    });
  }

  // Helper method to update both sun and water UI components
  public updateSunAndWaterUI(totalSun: number, totalWater: number): void {
    // Update the text displays

    console.log('sun and water resource: ' + totalSun + ' ' + totalWater);
    if (this.totalSun == undefined || this.totalWater == undefined) {
      totalSun = 0;
      totalWater = 0;
    }
    this.sunText.setText(`Sun: ${totalSun}`);
    this.waterText.setText(`Water: ${totalWater}`);

    // Calculate progress percentages
    const sunPercentage = Phaser.Math.Clamp(
      totalSun / (this.gridManager.gridWidth * this.gridManager.gridHeight * 5),
      0,
      1,
    );
    const waterPercentage = Phaser.Math.Clamp(
      totalWater /
        (this.gridManager.gridWidth * this.gridManager.gridHeight * 10),
      0,
      1,
    );

    // Update the sun bar
    this.sunBar.clear();
    this.sunBar.fillStyle(0xffff00, 1); // Yellow for sun
    this.sunBar.fillRect(100, 10, 200 * sunPercentage, 20);

    // Update the water bar
    this.waterBar.clear();
    this.waterBar.fillStyle(0x1e90ff, 1); // Blue for water
    this.waterBar.fillRect(120, 34, 200 * waterPercentage, 20);
  }

  public gameOver(): void {
    console.log('Game Over!');
    this.isGameOver = true; // Set the game-over flag

    this.zombieManager.destroyAllZombies(); // Destroy all zombies
    // Display "Game Over" message
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 30,
        'Game Over!',
        {
          fontFamily: '"Press Start 2P", sans-serif',
          fontSize: '24px',
          color: '#FF0000',
        },
      )
      .setOrigin(0.5);

    // Display "Press R to Restart" message
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 20,
        'Press R to Restart',
        {
          fontFamily: '"Press Start 2P", sans-serif',
          fontSize: '16px',
          color: '#FFFFFF',
        },
      )
      .setOrigin(0.5);

    // Restart game on "R" key press
    if (this.input && this.input.keyboard) {
      const rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      rKey.once('down', () => {
        console.log('Restarting game...');
        this.scene.restart(); // Restart the current scene
      });
    }
  }
}
