import GameState from '../game/classes/GameState';
import GridManager from '../game/classes/GridManager';
import PlantManager from '../game/classes/PlantManager';
import ZombieManager from '../game/classes/ZombieManager';

interface Scenario {
  scenarioName: string;
  gridSize: { width: number; height: number };
  startSun: number;
  startWater: number;
  plants: {
    type: string;
    x: number;  
    y: number;
    growthCondition: string[];
    ability: string;
  }[]; 
  zombies: { spawnRate: number; initialSpawns: { x: number; y: number }[] };
  defeat: string;
  events: { turn: number; action: string; params: Record<string, any> }[]; 
}





export async function parseDSL(fileUrl: string): Promise<Scenario> {
  const response = await fetch(fileUrl); // Fetch the file using fetch API
  const content = await response.text();  // Read the file content as text
  const lines = content.split('\n').map((line) => line.trim());
  
  const scenario: Partial<Scenario> = {
    plants: [],
    zombies: { spawnRate: 0, initialSpawns: [] },
    events: [],
  };

  let currentPlant: Partial<{
    type: string;
    growthCondition: string[];
    ability: string;
  }> = {};

  lines.forEach((line) => {
    if (line.startsWith('#') || line === '') return;

    const [key, ...rest] = line.split(' ');
    const value = rest.join(' ');

    switch (key) {
      case 'SCENARIO':
        scenario.scenarioName = value.replace(/\"/g, '');
        break;
      case 'GRID_SIZE':
        const [width, height] = value.split('x').map(Number);
        scenario.gridSize = { width, height };
        break;
      case 'START_SUN':
        scenario.startSun = Number(value);
        break;
      case 'START_WATER':
        scenario.startWater = Number(value);
        break;
      case 'PLANTS:':
        break;
      case 'TYPE':
        currentPlant = {
          type: value.replace(/\"/g, ''),
          growthCondition: [],
          ability: '',
        };
        break;
      case 'GROWTH_CONDITION:':
        break;
      case 'REQUIRES_MIN_SUNLIGHT':
      case 'REQUIRES_MIN_WATER':
        if (currentPlant.growthCondition) {
          currentPlant.growthCondition.push(`${key} ${value}`);
        }
        break;
      case 'ABILITY:':
        currentPlant.ability = value.replace(/\"/g, '');
        break;
      case 'ZOMBIES:':
        break;
      case 'SPAWN_RATE':
        scenario.zombies!.spawnRate = Number(value);
        break;
      case 'INITIAL_SPAWNS:':
        break;
      case 'AT':
        const [zx, zy] = value.match(/\d+/g)!.map(Number);
        scenario.zombies!.initialSpawns.push({ x: zx, y: zy });
        break;
      case 'DEFEAT':
        scenario.defeat = value.replace(/\"/g, '');
        break;
      case 'EVENTS:':
        break;
      case 'TURN':
        const [turn, action, ...params] = value.split(' ');
        const paramsObj = Object.fromEntries(params.map((p) => p.split('=')));
        scenario.events!.push({
          turn: Number(turn),
          action,
          params: paramsObj,
        });
        break;
      default:
        if (currentPlant.type) {
          scenario.plants!.push({
            type: currentPlant.type ?? 'unknown', 
            x: 0, 
            y: 0, 
            growthCondition: currentPlant.growthCondition ?? [], 
            ability: currentPlant.ability ?? 'none',
          });
          currentPlant = {}; 
        }
    }

    if (currentPlant.type) {
      scenario.plants!.push({
        type: currentPlant.type ?? 'unknown',
        x: 0,
        y: 0,
        growthCondition: currentPlant.growthCondition ?? [],
        ability: currentPlant.ability ?? 'none',
      });
      currentPlant = {}; 
    }
  });

  return scenario as Scenario;
}

export function applyScenarioToGame(
  scenario: Scenario,
  gameState: GameState,
  gridManager: GridManager,
  plantManager: PlantManager,
  zombieManager: ZombieManager,
): void {
  // gridManager.gridWidth = scenario.gridSize.width;
  // gridManager.gridHeight = scenario.gridSize.height;
  gridManager.gridWidth = scenario.gridSize.width;
  gridManager.gridHeight = scenario.gridSize.height;

  gameState.totalSun = scenario.startSun;
  gameState.totalWater = scenario.startWater;

  scenario.plants.forEach(({ type, x, y }) => {
    plantManager.plant(type, x, y); 
  });

  scenario.zombies.initialSpawns.forEach(({}) => {
    zombieManager.spawnZombie();
  });

  /*scenario.events.forEach(({ turn, action, params }) => {
    gameState.scheduleEvent(turn, action, params);
  });

  gameState.setDefeatCondition(scenario.defeat);*/
}
