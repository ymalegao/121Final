
import Phaser from 'phaser';
import GridManager from '../classes/GridManager';
import Player from '../classes/Player';
import PlantManager from '../classes/PlantManager';
import ZombieManager from '../classes/ZombieManager';
import GameState from '../classes/GameState';
import GridState from '../classes/GridState';
import MenuScene from './MenuScene';
import { parseDSL, applyScenarioToGame } from '../../DSL/DSLParser';
import Zombie from '../classes/Zombie';
import AttackPlant from '../classes/AttackPlant';
import SunPlant from '../classes/SunPlant';


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
    this.translations = {}; // Store translations
    this.currentLanguage = 'en'; // Default language
    this.t = 0;
    
  }

  init(data) {
    if (data.selectedLanguage) {
      this.currentLanguage = data.selectedLanguage;
    }
  }


  preload() {
    

    this.load.image('sunflower', './assets/Sunflower.png');
    this.load.image('Zombie', './assets/zombie.png');
    this.load.image('attackPlant', './assets/attackPlant.png');

    //Loading Languages
    this.load.json('English', './game/languagejson/en.json');
    this.load.json('Chinese', './game/languagejson/zh.json');
    this.load.json('Arabic', './game/languagejson/ar.json');  
  }
  
  async create() {
    if(this.currentLanguage){

      console.log("This is current Language: ", this.currentLanguage);
    }
    this.translations = {
      en: this.cache.json.get('en'),
      zh: this.cache.json.get('zh'),
      ar: this.cache.json.get('ar'),
    };
    this.t = this.translations[this.currentLanguage];

    // Handle missing translations gracefully
    if (!this.t) {
      console.error(`Missing translations for language: ${this.currentLanguage}`);
      return;
    }
  
    
    const cellSize = 64;
    const gridWidth = 16;
    const gridHeight = 16;
    const dslURL = './DSL/gameplayscenario.dsl';
    const scenario = await parseDSL(dslURL);

    this.isGameOver = false;

    this.winCounter = 0;
    this.winNumber = 20;

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
        this.t.autosavePrompt
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
        this.zombieManager.findZombies();
        this.gameState?.saveState();
        this.advanceTurn();
        this.gameState?.autoSave();
        this.winCounter += 1;

        if(this.winCounter > this.winNumber){
              this.zombieManager?.destroyAllZombies();
              this.add
              .text(
              this.cameras.main.centerX,
              this.cameras.main.centerY - 30,
              this.t.gameWinMessage,
              {
                fontFamily: '"Press Start 2P", sans-serif',
                fontSize: '24px',
                color: '#FFF44F',
              }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 20,
        this.t.restartPrompt,
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

      if (event.key === 'Z' || event.key === 'z') {
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
      };

      if (event.key === 'Y' || event.key === 'y') {
        this.gameState.redo();
      };
    });
    
    this.input.keyboard.on('keydown-S', () => {
      const slotName = prompt(this.t.savePrompt);
      if (slotName) {
        this.gameState.saveToSlot(`saveSlot-${slotName}`);
      }
    });

    // Load game from a slot
    this.input.keyboard.on('keydown-L', () => {
      const slotName = prompt(this.t.loadPrompt);
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
  }

  createResourceDisplay() {
    this.sunText = this.add.text(1030, 16, this.t.sun + ': 0', {
      fontSize: '16px',
      color: '#fff',
    });
    this.waterText = this.add.text(1030, 40, this.t.water + ': 0', {
      fontSize: '16px',
      color: '#fff',
    });
    this.winText = this.add.text(1030, 65, this.t.turns + ': ' + this.winCounter + '/' + this.winNumber, {
      fontSize: '16px',
      color: '#fff',
    });

    this.sunBar = this.add.graphics();
    this.sunBar.fillStyle(0xffff00, 1);
    this.sunBar.fillRect(1125, 10, 200, 20);

    this.waterBar = this.add.graphics();
    this.waterBar.fillStyle(0x1e90ff, 1);
    this.waterBar.fillRect(1125, 34, 200, 20);
  }

  advanceTurn() {
    if (this.isGameOver) {
      return;
    }

    this.gridManager?.updateSunAndWaterLevels();
    this.plantManager?.updatePlants();
    this.zombieManager?.updateZombies();
    this.checkZombieCollisions();
    this.updateResourceDisplay();
  }

  checkZombieCollisions() {

    
    // Loop through all zombies
    this.zombieManager.zombies.forEach((zombie) => {
      // Check for collision with any plant
      this.plantManager.plants.forEach((plant) => {
        if (this.checkCollision(zombie, plant)) {
          // Destroy the plant on collision
          this.plantManager.removePlant(plant);
          console.log('A plant has been destroyed by a zombie!');
        }
      });
    });
  }
  
  // Check for collision between zombie and plant (you can modify this based on the specific collision logic you need)
  checkCollision() {
    if (!this.zombieManager || !this.plantManager) {
      console.error('ZombieManager or PlantManager is not initialized.');
      return;
    }
  
    const zombies = this.zombieManager.zombies; // Use zombies from the ZombieManager
    const plants = this.plantManager.plants; // Use plants from the PlantManager
  
    if (!zombies || !plants) {
      console.error('Zombies or Plants arrays are undefined.');
      return;
    }
  
    zombies.forEach((zombie, zombieIndex) => {
      plants.forEach((plant, plantIndex) => {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            zombie.getBounds(),
            plant.getBounds()
          )
        ) {
          if (plant instanceof AttackPlant) {
            // If it's an AttackPlant, destroy both the zombie and the plant
            zombie.destroy();
            zombies.splice(zombieIndex, 1);
  
            plant.destroy();
            plants.splice(plantIndex, 1);
  
            console.log(
              `Zombie and AttackPlant destroyed at (${zombie.i}, ${zombie.j})`
            );
          }
          else if (plant instanceof SunPlant){
            plant.destroy();
            plants.splice(plantIndex, 1);
            this.gridManager.sunPlants -= 1;
          }
        }
      });
    });
  }

  updateResourceDisplay() {
    this.totalSun = 0;
    this.totalWater = 0;

    for (let y = 0; y < this.gridManager?.gridHeight ?? 0; y++) {
      for (let x = 0; x < this.gridManager?.gridWidth ?? 0; x++) {
        const cellData = this.gridManager?.getCellResources(x, y);
        if (cellData) {
          this.totalSun += cellData.sun;
          if (this.totalSun > 500) {
            this.totalSun = 500
          }
          this.totalWater += cellData.water;
          if (this.totalWater > 500) {
            this.totalWater = 500
          }
        }
      }
    }

    this.updateSunAndWaterUI(this.totalSun, this.totalWater);
  }

  updateSunAndWaterUI(totalSun, totalWater) {
    this.sunText?.setText(`${this.t.sun}: ${totalSun}`);
    this.waterText?.setText(`${this.t.water}: ${totalWater}`);
    this.winText.setText(`${this.t.turns}: ${this.winCounter}/20`);

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
    this.sunBar?.fillRect(1125, 10, 200 * sunPercentage, 20);

    this.waterBar?.clear();
    this.waterBar?.fillStyle(0x1e90ff, 1);
    this.waterBar?.fillRect(1125, 34, 200 * waterPercentage, 20);
  }

  gameOver() {
    console.log('Game Over!');
    this.isGameOver = true;

    this.zombieManager?.destroyAllZombies();
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 30,
        this.t.gameOverMessage,
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
        this.t.restartPrompt,
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
