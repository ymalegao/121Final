# Devlog Entry - [11/14/2024]

## Introducing the Team

**Tools Lead**

- Rahamat Zaman
- Atri Mehta (Assist)

**Engine Lead**

- Yash Malegaonkar
- Atri Mehta (Assist)

**Design Lead**

- Jay Kumar
- Luc (Assist)

## Tools and Materials

### Engines, Libraries, Frameworks, and Platforms

We chose Phaser and hosting on GitHub Pages as the platform we chose to first build on. We decided to use Phaser because we all have experience with it having taken 120, and to build small video game systems it is ideal. We also are planning on switching platforms later to use raw Typescript and a framework like Vite or maybe something like P5.js, but that is going to be used because they are also other TS and JS frameworks so it will be easier to switch when the time comes.

### Programming and Data Languages

For our programming language, we plan to use Typescript, along with other languages like JSON to maintain the dependencies of our project.

### Authoring Tools

Our IDE is expected to be Visual Studio Code, as it is the best option for supporting whatever engine or platform we decide to use. By using Visual Studio Code we can use many developer-friendly extensions like Live Share which allows us to work simultaneously. Our image editor options consist of pixilart.com, Paint 3D, Adobe Photoshop or Illustrator. Our primary art style is currently planned to be pixel art, so pixilart.com would likely come in handy for this. Pixilart is also free to use and requires a fairly low skill-level, making it fairly easy to get the hang of.

**Code Formatting**: Prettier and ESLint extension and packages.

### Alternate Platform

For our alternate platform choice, we have decided on using raw JavaScript and P5. We all have experience working with JS, and JavaScript would allow us to collaborate more easily on files.

## Outlook

We would like to have some kind of plants versus zombies fighting mechanic in our game that will follow the requirements that we need. The sun generation and turn-based simulation will make it so the player will be farming and then be able to fight an incoming wave so that they can collect materials to improve and level up their plants. This will create a solid game loop that feeds into itself and will task the player to manage resource management and battle planning.

Switching platforms will be the most challenging part of this project because it will require us to pivot into something unfamiliar to us. We might need to rebuild different parts of the game because platforms handle movement and grid interactions differently. Testing everything might take time, so adapting to a new development method while keeping the game’s scope the same will be tough.

We hope to learn a lot by making a fun game and improving our design skills, whether pixel art, Photoshop, Paint 3D, Illustrator, or TypeScript with Phaser while also implementing our knowledge of effective game systems. Using these tools, we want to figure out how to build things like resource management, enemy waves, and player progression to keep our players engaged. We also want to learn how to use class abstractions so everyone can work together on different files and classes, making it easy to call them in the main game loop. This way, we can collaborate better and switch platforms without any problems. By keeping everything organized, we’ll improve our coding skills, understand how to keep the game engaging, and design systems that keep players interested.

Our team hopes to learn how to have class abstractions so everyone can work together on different files and classes. All we must do is call them in the main game loop. This way, we can switch platforms quickly and collaborate better. By having everything abstracted and organized well, we can implement everything quickly. We hope to learn and utilize software design patterns we were taught in class, such as Facade, Memento, and Flyweight, and how to better optimize (refactor) our code.

# Devlog Entry - [11/27/2024]

## How We Satisfied the Software Requirements

### F0.a: You control a character moving over a 2D grid.

When you press the WASD keys or the arrow keys, the player (represented by a green square) moves in the direction pressed. The character can only move one grid space at a time, ensuring movement over a structured 2D grid.

### F0.b: You advance time manually in the turn-based simulation.

Pressing the `N` key advances the turn. Each turn, the player gains Sun and Water resources to place more plants. Zombies are also intended to progress closer to the player during each turn, keeping the turn-based gameplay in focus.

### F0.c: You can reap or sow plants on grid cells only when you are near them.

To plant crops, the player must be on the specific grid square where they want to plant. It is not possible to place crops on squares the player is not standing on or on squares that already contain a plant, ensuring strategic placement.

### F0.d: Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.

Sun and water levels are visually represented using progress bars. These levels are tied to each grid cell, which is implemented as an interface in the code. Sun levels are consumed immediately, while water accumulates over multiple turns.

### F0.e: Each plant on the grid has a distinct type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).

Plants can achieve three growth levels. Each growth level influences the multiplier for the plant's production. For example, a Sun Plant at level 2 produces resources at twice the base rate (product \* 2).

### F0.f: Simple spatial rules govern plant growth based on sun, water, and nearby plants (satisfying conditions unlock growth).

When plants of the same type are placed next to each other, their future planting costs decrease. For example, two Sunflower Plants placed adjacent to each other reduce the cost of placing a third Sunflower Plant in proximity.

### F0.g: A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).

The player loses when a Zombie reaches the leftmost column of the grid, providing a clear win/loss condition for the game.

---

## Reflection

Looking back on how we achieved the F0 requirements, our team’s plan changed significantly. Initially, we planned to have separate "grow" and "fight" phases like in games such as _Clash of Clans_. However, we decided to combine these phases into a continuous game loop where combat and growth happen simultaneously. This change simplified our workflow and reduced the complexity of the game.

Additionally, we had to adapt our tools. Initially, we planned to host the game using a simple live server setup. However, due to the nature of the Phaser project and the React-based repo we cloned, we had to integrate Vite as a build tool. This required us to build the game using `npm run build` and deploy the `dist/index.html` to GitHub Pages. While this made the setup process more challenging, it allowed us to optimize the game for deployment.

Overall, these adjustments helped us streamline development, focus on core mechanics, and meet the F0 requirements effectively while learning valuable lessons about game design and deployment.

## Commands to install and run EsLint Linter and Prettier Code Formatter

Run the two commands below to install the packages and dependencies:
`npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier prettier eslint-plugin-prettier`
`npm install --save-dev --global prettier`

To run the linter use this command:
`npx eslint .`

To fix the errors in your code using the linter use this command:
`npx eslint --fix .`

To run the code formatter use this command:
`npx prettier --write .`

# F1 Devlog - [12/06/2024]

## F1.a: The important state of your game's grid must be backed by a single contiguous byte array in AoS or SoA format.

**Implementation:**  
The grid state is managed in the `GridState.ts` and `GridManager.ts` files.  
The game uses a Structure of Arrays (SoA) format where each property (e.g., plant type, growth level, sun level, water level) is stored as a separate array. This ensures efficient memory access and allows updates without redundant data copying.  
For example, an array `gridCells` is indexed such that `gridCells[i]` corresponds to the state of the i-th cell.

**Diagram:**  
Here is a visualization of this memory layout showing the separate arrays for different properties aligned by indices.

![Memory Layout Diagram](./public/Memory%20Layout%20Diagram.png)

## F1.b: The player must be able to manually save their progress in the game.

**Implementation:**  
The manual save/load functionality is handled through `GameState.ts` and integrated with `GridState.ts` to persist the grid layout, player position, plant data, and other game parameters.  
Save files are serialized as JSON objects and stored in local storage. The player can manage multiple save files through a menu implemented in `MenuScene.ts`.

**UI Design:**  
The `MenuScene.ts` file provides a list of save slots and options to save or load progress. Slots are labeled for user clarity (e.g., "Slot 1: Day 3, Turn 5").

## F1.c: The game must implement an implicit auto-save system to support recovery from unexpected quits.

**Implementation:**  
The auto-save system is integrated within `GameState.ts`. After every significant action (e.g., advancing turns, planting, combat), the current state is auto-saved to a separate slot in local storage.  
Upon launching the game, `MenuScene.ts` checks for the presence of an auto-save file. If found, the game prompts the player with:  
_"Do you want to continue from where you left off?"_  
Auto-save does not interfere with manual save slots, maintaining clear separation for user-controlled saves.

## F1.d: The player must be able to undo every major choice.

**Implementation:**

- **Undo Stack:** In `GameState.ts`, each significant action (e.g., planting, advancing turns, moving) creates a snapshot of the grid and player state. These snapshots are stored in an undo stack.
- **Redo Stack:** When an undo is performed, the previous state is saved in a redo stack. This allows redoing undone actions as needed.
- **Modules Involved:** The `Player.ts` and `GridManager.ts` files are responsible for handling undoable actions related to player movements and grid interactions, respectively.
- **UI Feedback:** Undo/redo buttons are prominently displayed on the game UI, implemented in `MenuScene.ts`.

## Reflection

### Looking back on how we achieved the F1 requirements:

### Evolving the Save/Load System:

Initially, manual saving was considered sufficient, but playtesting revealed the importance of auto-save and recovery features. Integrating these features in `GameState.ts` added robustness and improved user experience.

### Memory Management Challenges:

Representing the grid state in a Structure of Arrays (SoA) format required careful synchronization between arrays. For example, updating a cell’s sun level required ensuring consistency with water levels and plant data in other arrays.

### Player Feedback:

Undo/redo and on-screen notifications (e.g., "Planted a Sunflower at [3, 2]") improved player understanding. These features were developed iteratively, based on playtesting feedback.

### Cross-Module Collaboration:

The modular design ensured seamless integration across files like `GridManager.ts`, `PlantManager.ts`, and `GameState.ts`. This structure allowed efficient implementation of requirements like F1.b and F1.c without duplication of effort.

# F2 Devlog - [12/09/2024]

## F0 + F1: Determine if the previous F0 and F1 requirements remain satisfied in the latest version of your software
The latest version of our project fulfills the F0 and F1 requirements. As a group, we have emphasized and focused on completing the upcoming requirements and attempted to improve our code structure and make sure it’s clear and concise.

## F2.a: External DSL for Scenario Design
Our external DSL for scenario design facilitates intuitive gameplay definitions for designers. We utilize a structured format based on readable text files, allowing easy modifications to game scenarios without needing to access the underlying code.

Below is a brief example showcasing the format used in our `gameplayscenario.dsl`:

![External DSL for Scenario Design Visualization](./public/External%20DSL.png)

**Natural Language Explanation:** This scenario outlines a default gameplay setting where the grid size is 10x10, the initial sun and water resources are defined, plant placements are specified, and zombie spawn rates are outlined. The defeat condition adds a layer of urgency to gameplay.

### Technical Details:
- The `SCENARIO` keyword defines the context of the gameplay.
- `GRID_SIZE` determines the game area dimensions, allowing flexibility in designing larger or smaller maps.
- `START_SUN` and `START_WATER` initialize the resources for gameplay engagement.
- The `PLANTS` and `ZOMBIES` sections specify game elements, allowing for precise placements and functionalities.
- The `EVENTS` section introduces time-based actions within the gameplay, allowing us to dynamically manipulate the game state based on game progress.

With the parsing logic we’ve implemented in `DSLParser.js`, each of these keywords is interpreted and converted into structured data, which the game can utilize to create an engaging player experience.

## F2.b: Internal DSL for Plants and Growth Conditions
Our internal DSL, developed in TypeScript, enables detailed definitions of plant types and their growth conditions. The structure ensures that each plant's unique requirements are articulated, allowing for versatile gameplay mechanics.

An example from our `PlantDSL.dsl` file is:

![Internal DSL for Plant and Growth Conditions Visualization](./public/Internal%20DSL.png)

**Natural Language Explanation:** This internal DSL illustrates the structure for defining plant types and their respective growth conditions in a straightforward manner. The ability to implement complex conditions enhances the depth of gameplay and encourages strategic planning.

### Technical Details:
- The `PLANT_TYPES` header signals the start of our plant definitions.
- Each `TYPE` definition specifies the plant's unique name, followed by `GROWTH_CONDITION`, which includes specific requirements for growth.
- For instance, the "sun" plant requires a minimum of 100 sunlight and 100 water to thrive, emphasizing resource management within the game.
- The `ABILITY` property defines the plant's functionality, adding layers to gameplay strategies. For example, the "sun" plant's ability to generate sun can support other plant types, while the "attack" plant's ability allows it to engage zombies directly.

This level of detail allows for the creation of complex scenarios where players must consider plant placement and resource management strategically. By leveraging TypeScript's capabilities, we ensure that our internal DSL can accommodate additional features in the future, such as synergistic effects between different plant types or interactions with other game elements.

## F2.c: Switch to Alternate Platform
We successfully moved our project from TypeScript to JavaScript. This change provided greater compatibility and accessibility across diverse platforms. While core components were largely transferable, we refined our game logic to accommodate JavaScript's dynamic capabilities, improving both performance and the developer experience. Initially, we aimed to switch from the Phaser framework to the Pixi.js framework, but we ultimately decided to keep our current framework due to its capabilities and what it offers for our game regarding collision detection, physics, and more.

## Reflection
Looking back on how we achieved the F2 requirements:
- **Technical Adaptations:** We successfully devised a structured external DSL format using plain text for scenario definitions, enabling designers to articulate gameplay scenarios without delving into the codebase.
- **Parsing Logic:** Implemented robust parsing logic in `DSLParser.js` to read and interpret the external DSL files, transforming them into structured game scenarios that could dynamically affect game state.
- **Internal DSL Implementation:** Leveraged TypeScript to define plant growth conditions and abilities, creating an expressive internal DSL that captures complex growth dynamics while maintaining ease of use within the main game framework.
- **Event Scheduling:** Designed a preliminary event scheduling system that integrates with the game state, allowing us to introduce timed actions that enhance gameplay strategy and interactivity.
- **Platform Transition:** Implemented the migration from TypeScript to JavaScript, adjusting our code structure to fit JavaScript’s capabilities while ensuring that core functionalities and game mechanics were preserved.