import GameState from '../../src/game/classes/GameState';
import GridManager from '../../src/game/classes/GridManager';
import PlantManager from '../../src/game/classes/PlantManager';
import ZombieManager from '../../src/game/classes/ZombieManager';

export async function parseDSL(fileUrl) {
  
  const response = await fetch(fileUrl); // Fetch the file using fetch API
  const content = await response.text(); // Read the file content as text
  const lines = content.split('\n').map((line) => line.trim());

  const scenario = {
    scenarioName: '',
    gridSize: { width: 0, height: 0 },
    startSun: 0,
    startWater: 0,
    plants: [],
    zombies: { spawnRate: 0, initialSpawns: [] },
    defeat: '',
    events: [],
  };

  let currentPlant = {
    type: '',
    growthCondition: [],
    ability: '',
  };

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
        scenario.zombies.spawnRate = Number(value);
        break;
      case 'INITIAL_SPAWNS:':
        break;
      case 'AT':
        const [zx, zy] = value.match(/\d+/g).map(Number);
        scenario.zombies.initialSpawns.push({ x: zx, y: zy });
        break;
      case 'DEFEAT':
        scenario.defeat = value.replace(/\"/g, '');
        break;
      case 'EVENTS:':
        break;
      case 'TURN':
        const [turn, action, ...params] = value.split(' ');
        const paramsObj = Object.fromEntries(params.map((p) => p.split('=')));
        scenario.events.push({
          turn: Number(turn),
          action,
          params: paramsObj,
        });
        break;
      default:
        if (currentPlant.type) {
          scenario.plants.push({
            type: currentPlant.type || 'unknown',
            x: 0,
            y: 0,
            growthCondition: currentPlant.growthCondition || [],
            ability: currentPlant.ability || 'none',
          });
          currentPlant = {};
        }
    }

    if (currentPlant.type) {
      scenario.plants.push({
        type: currentPlant.type || 'unknown',
        x: 0,
        y: 0,
        growthCondition: currentPlant.growthCondition || [],
        ability: currentPlant.ability || 'none',
      });
      currentPlant = {};
    }
  });

  return scenario;
}

export function applyScenarioToGame(
  scenario,
  gameState,
  gridManager,
  plantManager,
  zombieManager
) {
  gridManager.gridWidth = scenario.gridSize.width;
  gridManager.gridHeight = scenario.gridSize.height;

  gameState.totalSun = scenario.startSun;
  gameState.totalWater = scenario.startWater;

  scenario.plants.forEach(({ type, x, y }) => {
    plantManager.plant(type, x, y);
  });

  scenario.zombies.initialSpawns.forEach(() => {
    zombieManager.spawnZombie();
  });

  // Uncomment and implement if event scheduling and defeat condition logic are ready
  /*
  scenario.events.forEach(({ turn, action, params }) => {
    gameState.scheduleEvent(turn, action, params);
  });

  gameState.setDefeatCondition(scenario.defeat);
  */
}
