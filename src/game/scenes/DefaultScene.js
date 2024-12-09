import Phaser from 'phaser';
import GridManager from '../classes/GridManager';
import Player from '../classes/Player';
import PlantManager from '../classes/PlantManager';
import ZombieManager from '../classes/ZombieManager';
import GameState from '../classes/GameState';
import GridState from '../classes/GridState';
import { parseDSL, applyScenarioToGame } from '../../DSL/DSLParser';

export default class DefaultScene extends Phaser.Scene {
  gridManager = null;
  isGameOver = false;
  player = null;
  plantManager = null;
  zombieManager = null;
  sunText = null;
  waterText = null;
  sunBar = null;
  waterBar = null;
  baseCostSun = 100;
  baseCostWater = 100;
  gameState = null;
  totalSun = 0;
  totalWater = 0;

  constructor() {
    super({ key: 'DefaultScene' });
  }

  preload() {
    this.load.image('sunflower', '../assets/Sunflower.png');
    this.load.image('Zombie', '../assets/Chomper.png');
    this.load.image('attackPlant', '../assets/attackPlant.png');
  }

  async create() {
    const cellSize = 64;
    const gridWidth = 16;
    const gridHeight = 16;
    const scenario = await parseDSL('./src/DSL/gameplayscenario.dsl');

    this.isGameOver = false;

    this.gridManager = new GridManager(this, cellSize, gridWidth, gridHeight);
    this.player = new Player(this, this.gridManager, 0, 0);
    this.plantManager = new PlantManager(this, this.gridManager);
    this.zombieManager = new ZombieManager(this, this.gridManager);
    this.gameState = new GameState(
      this.gridManager.gridState,
      this.player,
      this.plantManager,
      this.zombieManager,
      this
    );

    applyScenarioToGame(
      scenario,
      this.gameState,
      this.gridManager,
      this.plantManager,
      this.zombieManager
    );

    console.log('Scenario applied properly', scenario);

    this.setupInputHandlers();
    this.createResourceDisplay();

    const autoSaveExists = localStorage.getItem('autoSaveSlot') !== null;
    if (autoSaveExists) {
      const continueGame = confirm(
        'An auto-save is available. Continue where you left off?'
      );
      if (continueGame) {
        const loadedState = GameState.loadFromSlot(
          'autoSaveSlot',
          this.gridManager?.gridState ?? [],
          this.player,
          this.plantManager,
          this.zombieManager,
          this
        );
        if (loadedState) {
          this.gameState = loadedState;
        }
      }
    }
  }

  setupInputHandlers() {
    document.addEventListener('keydown', (event) => {
      // Player movement
      if (event.key === 'ArrowUp') this.player?.move('up');
      if (event.key === 'ArrowDown') this.player?.move('down');
      if (event.key === 'ArrowLeft') this.player?.move('left');
      if (event.key === 'ArrowRight') this.player?.move('right');

      //save and load


      // Planting "sun" plants
      if (event.key === 'P' || event.key === 'p') {
        const { x, y } = this.player.position;

        if (x % 2 === 0 && y % 2 === 0) {
          if (this.totalSun >= 100 && this.totalWater >= 75) {
            const adjacentPlants = this.plantManager.getAdjacentPlants(x, y);

            if (adjacentPlants.length > 0) {
              this.totalSun -= this.baseCostSun * 0.5;
              this.totalWater -= this.baseCostWater * 0.5;
            } else {
              this.totalSun -= this.baseCostSun;
              this.totalWater -= this.baseCostWater;
            }

            this.updateSunAndWaterUI(this.totalSun, this.totalWater);
            this.plantManager.plant('sun', x, y);
            this.gridManager.sunPlants += 1;
          } else {
            console.log('Not enough resources to plant!');
          }
        } else {
          console.log('Plant can only be placed on even tiles!');
        }
      }

      // Planting "attack" plants
      if (event.key === 'A' || event.key === 'a') {
        const { x, y } = this.player.position;

        if (this.totalSun >= 100 && this.totalWater >= 75) {
          const adjacentPlants = this.plantManager.getAdjacentPlants(x, y);

          if (adjacentPlants.length > 0) {
            console.log('Cannot plant attack plant next to any other plant!');
            return;
          }

          this.totalSun -= this.baseCostSun;
          this.totalWater -= this.baseCostWater;
          this.updateSunAndWaterUI(this.totalSun, this.totalWater);
          this.plantManager.plant('attack', x, y);
        } else {
          console.log('Not enough resources to plant attack plant!');
        }
      }

      // Advance turn
      if (event.key === 'N' || event.key === 'n') {
        this.gameState?.saveState();
        this.advanceTurn();
        this.gameState?.autoSave();
      }
    });
  }

  createResourceDisplay() {
    this.sunText = this.add.text(16, 16, 'Sun: 0', {
      fontSize: '16px',
      color: '#fff',
    });
    this.waterText = this.add.text(16, 40, 'Water: 0', {
      fontSize: '16px',
      color: '#fff',
    });

    this.sunBar = this.add.graphics();
    this.sunBar.fillStyle(0xffff00, 1);
    this.sunBar.fillRect(100, 10, 200, 20);

    this.waterBar = this.add.graphics();
    this.waterBar.fillStyle(0x1e90ff, 1);
    this.waterBar.fillRect(100, 34, 200, 20);
  }

  advanceTurn() {
    if (this.isGameOver) {
      return;
    }

    this.gridManager?.updateSunAndWaterLevels();
    this.plantManager?.updatePlants();
    this.zombieManager?.updateZombies();

    this.updateResourceDisplay();
  }

  updateResourceDisplay() {
    this.totalSun = 0;
    this.totalWater = 0;

    for (let y = 0; y < this.gridManager?.gridHeight ?? 0; y++) {
      for (let x = 0; x < this.gridManager?.gridWidth ?? 0; x++) {
        const cellData = this.gridManager?.getCellResources(x, y);
        if (cellData) {
          this.totalSun += cellData.sun;
          this.totalWater += cellData.water;
        }
      }
    }

    this.updateSunAndWaterUI(this.totalSun, this.totalWater);
  }

  updateSunAndWaterUI(totalSun, totalWater) {
    this.sunText?.setText(`Sun: ${totalSun}`);
    this.waterText?.setText(`Water: ${totalWater}`);

    const sunPercentage = Phaser.Math.Clamp(
      totalSun /
        (this.gridManager?.gridWidth *
          this.gridManager?.gridHeight *
          5 || 1),
      0,
      1
    );
    const waterPercentage = Phaser.Math.Clamp(
      totalWater /
        (this.gridManager?.gridWidth *
          this.gridManager?.gridHeight *
          10 || 1),
      0,
      1
    );

    this.sunBar?.clear();
    this.sunBar?.fillStyle(0xffff00, 1);
    this.sunBar?.fillRect(100, 10, 200 * sunPercentage, 20);

    this.waterBar?.clear();
    this.waterBar?.fillStyle(0x1e90ff, 1);
    this.waterBar?.fillRect(100, 34, 200 * waterPercentage, 20);
  }

  gameOver() {
    console.log('Game Over!');
    this.isGameOver = true;

    this.zombieManager?.destroyAllZombies();
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 30,
        'Game Over!',
        {
          fontFamily: '"Press Start 2P", sans-serif',
          fontSize: '24px',
          color: '#FF0000',
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 20,
        'Press R to Restart',
        {
          fontFamily: '"Press Start 2P", sans-serif',
          fontSize: '16px',
          color: '#FFFFFF',
        }
      )
      .setOrigin(0.5);

    const rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    rKey.once('down', () => {
      console.log('Restarting game...');
      this.scene.restart();
    });
  }
}
