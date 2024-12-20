SCENARIO "Default Gameplay"
GRID_SIZE 10x10
START_SUN 100
START_WATER 50
PLANTS:
  - TYPE "sun" AT (2, 2)
  - TYPE "attack" AT (3, 3)
ZOMBIES:
  - SPAWN_RATE 0.5
  - INITIAL_SPAWNS:
    - AT (9, 4)
    - AT (9, 6)
DEFEAT "Zombie reaches player"
EVENTS:
  - TURN 5 SPAWN_ZOMBIE AT (8, 4)
  - TURN 10 SPAWN_PLANT TYPE "sun" AT (5, 5)
  - TURN 15 SPAWN_ZOMBIE AT (7, 3)
