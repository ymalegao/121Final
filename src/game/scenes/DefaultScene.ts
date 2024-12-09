import * as PIXI from 'pixi.js';
import GridManager from '../classes/GridManager';
import Player from '../classes/Player';
import PlantManager from '../classes/PlantManager';
import ZombieManager from '../classes/ZombieManager';
import GameState from '../classes/GameState';
import { parseDSL, applyScenarioToGame } from '../../DSL/DSLParser';

export default class DefaultScene {
  public container: PIXI.Container;
  public gridManager: GridManager;
  public player: Player;
  public plantManager: PlantManager;
  public zombieManager: ZombieManager;
  public gameState: GameState;
  public totalSun: number = 0;
  public totalWater: number = 0;
  public sunText: PIXI.Text;
  public waterText: PIXI.Text;
  public sunBar: PIXI.Graphics;
  public waterBar: PIXI.Graphics;
  public isGameOver: boolean = false;

  constructor(public app: PIXI.Application) {
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    // Initialize game grid and managers
    const cellSize = 64;
    const gridWidth = 16;
    const gridHeight = 16;

    this.gridManager = new GridManager(this.container, cellSize, gridWidth, gridHeight);
    this.player = new Player(this.container, this.gridManager, 0, 0);
    this.plantManager = new PlantManager(this.container, this.gridManager);
    this.zombieManager = new ZombieManager(this.container, this.gridManager);
    this.gameState = new GameState(
      this.gridManager.gridState,
      this.player,
      this.plantManager,
      this.zombieManager
    );

    this.setupUI();
    this.setupInput();
    this.loadScenario('./src/DSL/gameplayscenario.dsl');
  }

  async loadScenario(scenarioPath: string): Promise<void> {
    const scenario = await parseDSL(scenarioPath);
    applyScenarioToGame(
      scenario,
      this.gameState,
      this.gridManager,
      this.plantManager,
      this.zombieManager
    );
    console.log('Scenario applied properly', scenario);
  }

  setupUI(): void {
    // Initialize text for Sun and Water
    this.sunText = new PIXI.Text('Sun: 0', { fontSize: 16, fill: '#fff' });
    this.sunText.position.set(16, 16);
    this.container.addChild(this.sunText);

    this.waterText = new PIXI.Text('Water: 0', { fontSize: 16, fill: '#fff' });
    this.waterText.position.set(16, 40);
    this.container.addChild(this.waterText);

    // Initialize progress bars for Sun and Water
    this.sunBar = new PIXI.Graphics();
    this.sunBar.beginFill(0xffff00); // Yellow for Sun
    this.sunBar.drawRect(100, 10, 200, 20); // Placeholder bar
    this.sunBar.endFill();
    this.container.addChild(this.sunBar);

    this.waterBar = new PIXI.Graphics();
    this.waterBar.beginFill(0x1e90ff); // Blue for Water
    this.waterBar.drawRect(100, 34, 200, 20); // Placeholder bar
    this.waterBar.endFill();
    this.container.addChild(this.waterBar);
  }

  setupInput(): void {
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          this.gameState.saveState();
          this.player.move('up');
          break;
        case 'ArrowDown':
          this.gameState.saveState();
          this.player.move('down');
          break;
        case 'ArrowLeft':
          this.gameState.saveState();
          this.player.move('left');
          break;
        case 'ArrowRight':
          this.gameState.saveState();
          this.player.move('right');
          break;
        case 'N':
            console.log('Advancing turn');
          this.gameState.saveState();
          this.advanceTurn();
          this.gameState.autoSave();
          break;
        case 'Z':
          this.gameState.undo();
          break;
        case 'Y':
          this.gameState.redo();
          break;
        case 'S': {
          const slotName = prompt('Enter a save slot name:');
          if (slotName) this.gameState.saveToSlot(`saveSlot-${slotName}`);
          break;
        }
        case 'L': {
          const slotName = prompt('Enter a save slot name to load:');
          if (slotName) {
            const loadedState = GameState.loadFromSlot(
              `saveSlot-${slotName}`,
              this.gridManager.gridState,
              this.player,
              this.plantManager,
              this.zombieManager
            );
            if (loadedState) this.gameState = loadedState;
          }
          break;
        }
        case 'P':
          this.plantSunPlant();
          break;
        case 'A':
          this.plantAttackPlant();
          break;
      }
    });
  }

  plantSunPlant(): void {
    if (
      this.player.position.x % 2 === 0 &&
      this.player.position.y % 2 === 0 &&
      this.totalSun >= 100 &&
      this.totalWater >= 75
    ) {
      const costMultiplier = this.plantManager.getAdjacentPlants(
        this.player.position.x,
        this.player.position.y
      ).length > 0
        ? 0.5
        : 1;

      this.totalSun -= 100 * costMultiplier;
      this.totalWater -= 75 * costMultiplier;
      this.updateResourceDisplay();

      this.plantManager.plant('sun', this.player.position.x, this.player.position.y);
    } else {
      console.log('Not enough resources or invalid tile for planting!');
    }
  }

  plantAttackPlant(): void {
    if (this.totalSun >= 100 && this.totalWater >= 75) {
      const adjacentPlants = this.plantManager.getAdjacentPlants(
        this.player.position.x,
        this.player.position.y
      );

      if (adjacentPlants.length > 0) {
        console.log('Cannot plant attack plant next to any other plant!');
        return;
      }

      this.totalSun -= 100;
      this.totalWater -= 75;
      this.updateResourceDisplay();

      this.plantManager.plant('attack', this.player.position.x, this.player.position.y);
    } else {
      console.log('Not enough resources for attack plant!');
    }
  }

  advanceTurn(): void {
    if (this.isGameOver) return;

    this.gridManager.updateSunAndWaterLevels();
    this.plantManager.updatePlants();
    this.zombieManager.updateZombies();
    this.updateResourceDisplay();
  }

  updateResourceDisplay(): void {
    this.totalSun = 0;
    this.totalWater = 0;

    for (let y = 0; y < this.gridManager.gridHeight; y++) {
      for (let x = 0; x < this.gridManager.gridWidth; x++) {
        const cellData = this.gridManager.getCellResources(x, y);
        if (cellData) {
          this.totalSun += cellData.sun;
          this.totalWater += cellData.water;
        }
      }
    }

    this.sunText.text = `Sun: ${this.totalSun}`;
    this.waterText.text = `Water: ${this.totalWater}`;

    const sunPercentage = Math.min(this.totalSun / 100, 1);
    const waterPercentage = Math.min(this.totalWater / 100, 1);

    this.sunBar.clear().beginFill(0xffff00).drawRect(100, 10, 200 * sunPercentage, 20).endFill();
    this.waterBar.clear().beginFill(0x1e90ff).drawRect(100, 34, 200 * waterPercentage, 20).endFill();
  }
}
