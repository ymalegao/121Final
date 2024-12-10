PLANT_TYPES:
  - TYPE "sun":
      GROWTH_CONDITION:
        - REQUIRES_MIN_SUNLIGHT 100
        - REQUIRES_MIN_WATER 100
        - REQUIRES_TILE_EVEN true
      ABILITY: "generate_sun"

  - TYPE "attack":
      GROWTH_CONDITION:
        - REQUIRES_MIN_SUNLIGHT 100
        - REQUIRES_MIN_WATER 100
        - REQUIRES_NON_ADJACENT true
      ABILITY: "attack"

PLANT_ACTIONS:
  - ACTION "generate_sun":
      DESCRIPTION: "Generates sun points when the plant grows."
      EFFECT: "Increase sun by 10"

  - ACTION "attack":
      DESCRIPTION: "Attacks adjacent zombie"
      EFFECT: "Deal damage to zombie at closest position in range"
