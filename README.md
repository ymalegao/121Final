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

We chose Phaser and hosting on GitHub Pages as the platform we chose to first
build on. We decided to use Phaser because we all have experience with it having
taken 120, and to build small video game systems it is ideal. We also are
planning on switching platforms later to use raw Typescript and a framework like
Vite or maybe something like P5.js, but that is going to be used because they
are also other TS and JS frameworks so it will be easier to switch when the time
comes.

### Programming and Data Languages

For our programming language, we plan to use Typescript, along with other
languages like JSON to maintain the dependencies of our project.

### Authoring Tools

Our IDE is expected to be Visual Studio Code, as it is the best option for
supporting whatever engine or platform we decide to use. By using Visual Studio
Code we can use many developer-friendly extensions like Live Share which allows
us to work simultaneously. Our image editor options consist of pixilart.com,
Paint 3D, Adobe Photoshop or Illustrator. Our primary art style is currently
planned to be pixel art, so pixilart.com would likely come in handy for this.
Pixilart is also free to use and requires a fairly low skill-level, making it
fairly easy to get the hang of.

**Code Formatting**: Prettier and ESLint extension and packages.

### Alternate Platform

For our alternate platform choice, we have decided on using raw JavaScript and
P5. We all have experience working with JS, and JavaScript would allow us to
collaborate more easily on files.

## Outlook

We would like to have some kind of plants versus zombies fighting mechanic in
our game that will follow the requirements that we need. The sun generation and
turn-based simulation will make it so the player will be farming and then be
able to fight an incoming wave so that they can collect materials to improve and
level up their plants. This will create a solid game loop that feeds into itself
and will task the player to manage resource management and battle planning.

Switching platforms will be the most challenging part of this project because it
will require us to pivot into something unfamiliar to us. We might need to
rebuild different parts of the game because platforms handle movement and grid
interactions differently. Testing everything might take time, so adapting to a
new development method while keeping the game’s scope the same will be tough.

We hope to learn a lot by making a fun game and improving our design skills,
whether pixel art, Photoshop, Paint 3D, Illustrator, or TypeScript with Phaser
while also implementing our knowledge of effective game systems. Using these
tools, we want to figure out how to build things like resource management, enemy
waves, and player progression to keep our players engaged. We also want to learn
how to use class abstractions so everyone can work together on different files
and classes, making it easy to call them in the main game loop. This way, we can
collaborate better and switch platforms without any problems. By keeping
everything organized, we’ll improve our coding skills, understand how to keep
the game engaging, and design systems that keep players interested.

Our team hopes to learn how to have class abstractions so everyone can work
together on different files and classes. All we must do is call them in the main
game loop. This way, we can switch platforms quickly and collaborate better. By
having everything abstracted and organized well, we can implement everything
quickly. We hope to learn and utilize software design patterns we were taught in
class, such as Facade, Memento, and Flyweight, and how to better optimize
(refactor) our code.

# Devlog Entry - [11/27/2024]

## How We Satisfied the Software Requirements

### F0.a: You control a character moving over a 2D grid.

When you press the WASD keys or the arrow keys, the player (represented by a
green square) moves in the direction pressed. The character can only move one
grid space at a time, ensuring movement over a structured 2D grid.

### F0.b: You advance time manually in the turn-based simulation.

Pressing the `N` key advances the turn. Each turn, the player gains Sun and
Water resources to place more plants. Zombies are also intended to progress
closer to the player during each turn, keeping the turn-based gameplay in focus.

### F0.c: You can reap or sow plants on grid cells only when you are near them.

To plant crops, the player must be on the specific grid square where they want
to plant. It is not possible to place crops on squares the player is not
standing on or on squares that already contain a plant, ensuring strategic
placement.

### F0.d: Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.

Sun and water levels are visually represented using progress bars. These levels
are tied to each grid cell, which is implemented as an interface in the code.
Sun levels are consumed immediately, while water accumulates over multiple
turns.

### F0.e: Each plant on the grid has a distinct type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).

Plants can achieve three growth levels. Each growth level influences the
multiplier for the plant's production. For example, a Sun Plant at level 2
produces resources at twice the base rate (product \* 2).

### F0.f: Simple spatial rules govern plant growth based on sun, water, and nearby plants (satisfying conditions unlock growth).

When plants of the same type are placed next to each other, their future
planting costs decrease. For example, two Sunflower Plants placed adjacent to
each other reduce the cost of placing a third Sunflower Plant in proximity.

### F0.g: A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).

The player loses when a Zombie reaches the leftmost column of the grid,
providing a clear win/loss condition for the game.

---

## Reflection

Looking back on how we achieved the F0 requirements, our team’s plan changed
significantly. Initially, we planned to have separate "grow" and "fight" phases
like in games such as _Clash of Clans_. However, we decided to combine these
phases into a continuous game loop where combat and growth happen
simultaneously. This change simplified our workflow and reduced the complexity
of the game.

Additionally, we had to adapt our tools. Initially, we planned to host the game
using a simple live server setup. However, due to the nature of the Phaser
project and the React-based repo we cloned, we had to integrate Vite as a build
tool. This required us to build the game using `npm run build` and deploy the
`dist/index.html` to GitHub Pages. While this made the setup process more
challenging, it allowed us to optimize the game for deployment.

Overall, these adjustments helped us streamline development, focus on core
mechanics, and meet the F0 requirements effectively while learning valuable
lessons about game design and deployment.

## Commands to install and run EsLint Linter and Prettier Code Formatter

Run the two commands below to install the packages and dependencies:
`npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier prettier eslint-plugin-prettier`

`npm install --save-dev --global prettier`

To run the linter use this command: `npx eslint .`

To fix the errors in your code using the linter use this command:
`npx eslint --fix .`

To run the code formatter use this command: `npx prettier --write .`

# F1 Devlog - [12/06/2024]

## F1.a: The important state of your game's grid must be backed by a single contiguous byte array in AoS or SoA format.

**Implementation:**\
The grid state is managed in the `GridState.ts` and `GridManager.ts` files.\
The game uses a Structure of Arrays (SoA) format where each property (e.g.,
plant type, growth level, sun level, water level) is stored as a separate array.
This ensures efficient memory access and allows updates without redundant data
copying.\
For example, an array `gridCells` is indexed such that `gridCells[i]`
corresponds to the state of the i-th cell.

**Diagram:**\
Here is a visualization of this memory layout showing the separate arrays for
different properties aligned by indices.

![Memory Layout Diagram](./public/Memory%20Layout%20Diagram.png)

## F1.b: The player must be able to manually save their progress in the game.

**Implementation:**\
The manual save/load functionality is handled through `GameState.ts` and
integrated with `GridState.ts` to persist the grid layout, player position,
plant data, and other game parameters.\
Save files are serialized as JSON objects and stored in local storage. The
player can manage multiple save files through a menu implemented in
`MenuScene.ts`.

**UI Design:**\
The `MenuScene.ts` file provides a list of save slots and options to save or
load progress. Slots are labeled for user clarity (e.g., "Slot 1: Day 3, Turn
5").

## F1.c: The game must implement an implicit auto-save system to support recovery from unexpected quits.

**Implementation:**\
The auto-save system is integrated within `GameState.ts`. After every
significant action (e.g., advancing turns, planting, combat), the current state
is auto-saved to a separate slot in local storage.\
Upon launching the game, `MenuScene.ts` checks for the presence of an auto-save
file. If found, the game prompts the player with:\
_"Do you want to continue from where you left off?"_\
Auto-save does not interfere with manual save slots, maintaining clear
separation for user-controlled saves.

## F1.d: The player must be able to undo every major choice.

**Implementation:**

- **Undo Stack:** In `GameState.ts`, each significant action (e.g., planting,
  advancing turns, moving) creates a snapshot of the grid and player state.
  These snapshots are stored in an undo stack.
- **Redo Stack:** When an undo is performed, the previous state is saved in a
  redo stack. This allows redoing undone actions as needed.
- **Modules Involved:** The `Player.ts` and `GridManager.ts` files are
  responsible for handling undoable actions related to player movements and grid
  interactions, respectively.
- **UI Feedback:** Undo/redo buttons are prominently displayed on the game UI,
  implemented in `MenuScene.ts`.

## Reflection

### Looking back on how we achieved the F1 requirements:

### Evolving the Save/Load System:

Initially, manual saving was considered sufficient, but playtesting revealed the
importance of auto-save and recovery features. Integrating these features in
`GameState.ts` added robustness and improved user experience.

### Memory Management Challenges:

Representing the grid state in a Structure of Arrays (SoA) format required
careful synchronization between arrays. For example, updating a cell’s sun level
required ensuring consistency with water levels and plant data in other arrays.

### Player Feedback:

Undo/redo and on-screen notifications (e.g., "Planted a Sunflower at [3, 2]")
improved player understanding. These features were developed iteratively, based
on playtesting feedback.

### Cross-Module Collaboration:

The modular design ensured seamless integration across files like
`GridManager.ts`, `PlantManager.ts`, and `GameState.ts`. This structure allowed
efficient implementation of requirements like F1.b and F1.c without duplication
of effort.

# F2 Devlog - [12/08/2024]

## F2 Video

Check out the F2 Video showcasing our project:
[F2 Video](https://drive.google.com/file/d/103XJ3PZEzDyoxrAjUahvowpHr21lq39F/view?usp=sharing)

## F0 + F1: Determine if the previous F0 and F1 requirements remain satisfied in the latest version of your software

The latest version of our project fulfills the F0 and F1 requirements. As a
group, we have emphasized and focused on completing the upcoming requirements
and attempted to improve our code structure and make sure it’s clear and
concise.

## F2.a: External DSL for Scenario Design

Our external DSL for scenario design facilitates intuitive gameplay definitions
for designers. We utilize a structured format based on readable text files,
allowing easy modifications to game scenarios without needing to access the
underlying code.

Below is a brief example showcasing the format used in our
`gameplayscenario.dsl`:

![External DSL for Scenario Design Visualization](./public/External%20DSL.png)

**Natural Language Explanation:** This scenario outlines a default gameplay
setting where the grid size is 10x10, the initial sun and water resources are
defined, plant placements are specified, and zombie spawn rates are outlined.
The defeat condition adds a layer of urgency to gameplay.

### Technical Details:

- The `SCENARIO` keyword defines the context of the gameplay.
- `GRID_SIZE` determines the game area dimensions, allowing flexibility in
  designing larger or smaller maps.
- `START_SUN` and `START_WATER` initialize the resources for gameplay
  engagement.
- The `PLANTS` and `ZOMBIES` sections specify game elements, allowing for
  precise placements and functionalities.
- The `EVENTS` section introduces time-based actions within the gameplay,
  allowing us to dynamically manipulate the game state based on game progress.

With the parsing logic we’ve implemented in `DSLParser.js`, each of these
keywords is interpreted and converted into structured data, which the game can
utilize to create an engaging player experience.

## F2.b: Internal DSL for Plants and Growth Conditions

Our internal DSL, developed in TypeScript, enables detailed definitions of plant
types and their growth conditions. The structure ensures that each plant's
unique requirements are articulated, allowing for versatile gameplay mechanics.

An example from our `PlantDSL.dsl` file is:

![Internal DSL for Plant and Growth Conditions Visualization](./public/Internal%20DSL.png)

**Natural Language Explanation:** This internal DSL illustrates the structure
for defining plant types and their respective growth conditions in a
straightforward manner. The ability to implement complex conditions enhances the
depth of gameplay and encourages strategic planning.

### Technical Details:

- The `PLANT_TYPES` header signals the start of our plant definitions.
- Each `TYPE` definition specifies the plant's unique name, followed by
  `GROWTH_CONDITION`, which includes specific requirements for growth.
- For instance, the "sun" plant requires a minimum of 100 sunlight and 100 water
  to thrive, emphasizing resource management within the game.
- The `ABILITY` property defines the plant's functionality, adding layers to
  gameplay strategies. For example, the "sun" plant's ability to generate sun
  can support other plant types, while the "attack" plant's ability allows it to
  engage zombies directly.

This level of detail allows for the creation of complex scenarios where players
must consider plant placement and resource management strategically. By
leveraging TypeScript's capabilities, we ensure that our internal DSL can
accommodate additional features in the future, such as synergistic effects
between different plant types or interactions with other game elements.

## F2.c: Switch to Alternate Platform

We successfully moved our project from TypeScript to JavaScript. This change
provided greater compatibility and accessibility across diverse platforms. While
core components were largely transferable, we refined our game logic to
accommodate JavaScript's dynamic capabilities, improving both performance and
the developer experience. Initially, we aimed to switch from the Phaser
framework to the Pixi.js framework, but we ultimately decided to keep our
current framework due to its capabilities and what it offers for our game
regarding collision detection, physics, and more.

## Reflection

Looking back on how we achieved the F2 requirements:

- **Technical Adaptations:** We successfully devised a structured external DSL
  format using plain text for scenario definitions, enabling designers to
  articulate gameplay scenarios without delving into the codebase.
- **Parsing Logic:** Implemented robust parsing logic in `DSLParser.js` to read
  and interpret the external DSL files, transforming them into structured game
  scenarios that could dynamically affect game state.
- **Internal DSL Implementation:** Leveraged TypeScript to define plant growth
  conditions and abilities, creating an expressive internal DSL that captures
  complex growth dynamics while maintaining ease of use within the main game
  framework.
- **Event Scheduling:** Designed a preliminary event scheduling system that
  integrates with the game state, allowing us to introduce timed actions that
  enhance gameplay strategy and interactivity.
- **Platform Transition:** Implemented the migration from TypeScript to
  JavaScript, adjusting our code structure to fit JavaScript’s capabilities
  while ensuring that core functionalities and game mechanics were preserved.

# F3 Devlog - [12/09/2024]

## F3 Video

Check out the F3 Video showcasing our project: 

## F0 + F1 + F2: Determine if the previous F0 and F1 requirements remain satisfied in the latest version of your software

The latest version of our project fulfills the F0, F1, and F2 requirements, with significant improvements to core mechanics. We implemented a win condition where players must survive 20 turns and a loss condition triggered if a zombie reaches the leftmost column. Collision functionality was added, allowing Attack Plants to destroy both themselves and zombies upon contact, while Sun Plants are destroyed by zombies, reducing resource production and adding strategic depth.

## F3.a: Internationalization

Our internationalization system ensures that all text visible to the player can be translated into different written languages. We structured the implementation to make adding new languages straightforward and scalable.

**Natural Language Explanation:** All player-visible text, such as titles, instructions, and prompts, is extracted into external JSON files. This approach allows developers or translators to update or add new languages without modifying the game logic. The selected language dynamically determines which file is loaded, ensuring a seamless user experience.

### Technical Details:

- The JSON structure organizes strings in key-value pairs, where keys represent the text's purpose, and values are the translated text. For example:
{
  "gameOverMessage": "Game Over!",
  "instructions": "Use Arrow Keys to Move."
}
- The t object is used to reference strings in the code, such as t.gameOverMessage. This abstraction ensures no hard-coded text exists in the game logic.
- The currentLanguage parameter is passed between scenes to persist the user's language choice across the session.
- A fallback mechanism logs warnings for missing translations, helping developers quickly identify and resolve untranslated keys.

By centralizing text in JSON files and dynamically loading the appropriate file, we provide a robust foundation for supporting any written language.

## F3.b: Localization

We localized the game into three distinct languages: English (default), Arabic (right-to-left script), and Simplified Chinese (logographic script). Each language was carefully integrated to ensure proper functionality and cultural accuracy.

**Natural Language Explanation:** Localization involves adapting the game for players who speak different languages. This includes translating visible text and adjusting the UI for language-specific nuances, such as right-to-left alignment for Arabic or concise phrasing for Chinese. Language selection is accessible through the MenuScene, allowing players to choose their preferred language before starting the game.

### Technical Details:

- English (Default): English is the base language and requires no additional changes. Example string:
{
  "gameOverMessage": "Game Over!"
}
- Arabic (RTL): Text alignment was adjusted using Phaser's text rendering properties to support right-to-left layouts. UI elements were mirrored to maintain readability.
- Example string:
{
  "gameOverMessage": "انتهت اللعبة!"
}
- Simplified Chinese (Logographic): Google Noto fonts were used to render complex Chinese characters without clipping or distortion. Text was carefully phrased to fit within UI constraints.
- Example string: 
{
  "gameOverMessage": "游戏结束！"
}
- Translation Workflow: Initial translations were generated using ChatGPT with prompts like: "Translate 'Game Over' into Arabic and ensure it is suitable for a gaming context."
- Language selection: Players select their language in the MenuScene via interactive buttons, and the currentLanguage persists across scenes.
- Example:
this.translations = {
  en: this.cache.json.get('en'),
  zh: this.cache.json.get('zh'),
  ar: this.cache.json.get('ar')
};
this.t = this.translations[this.currentLanguage];

Localization ensures the game is accessible to a global audience while respecting cultural and linguistic nuances.

## F3.c: Mobile Installation
To ensure our game is installable on smartphone-class mobile devices, we utilized a Progressive Web App (PWA) approach. This allows our game to behave like a native application while leveraging existing web technologies, facilitating easier installation and updates.

Here are some examples of images for the mobile implementation on a smart-phone device:

<img src="./public/Add%20To%20Home%20Screen.PNG" alt="Add to the Home Screen" width="300" />  <!-- Adjust the width as needed -->
<img src="./public/Garden%20Defense%20on%20Mobile.PNG" alt="Garden Defense on Mobile" width="300" />  <!-- Adjust the width as needed -->

**Natural Language Explanation:** The PWA is created by implementing a service worker and a web app manifest, which enables the game to be added to the home screen of mobile devices. This process mimics the installation experience of standard applications, ensuring players can launch the game directly rather than navigating to a browser.

### Technical Details:
- **Service Worker (sw.js)**: 
  - We registered a service worker that handles caching of assets to improve performance and allow offline access. The `CACHE_NAME` and the `urlsToCache` array define the resources that are stored.
  - The service worker automatically caches essential files upon installation:
    ```javascript
    self.addEventListener("install", (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          console.log("Opened cache");
          return cache.addAll(urlsToCache);
        })
      );
    });
    ```
- **Web App Manifest (site.webmanifest)**: 
  - The manifest file defines the name, icons, theme color, and display properties of the PWA. This information is utilized by mobile devices to create a standalone app-like experience.
    ```json
    {
      "name": "Garden Defense",
      "icons": [
        {
          "src": "./sunflower-favicon/web-app-manifest-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./sunflower-favicon/web-app-manifest-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
      "display": "standalone"
    }
    ```
- Players can install the game by visiting the website on a mobile device and selecting the "Add to Home Screen" option, which provides easy access akin to native applications.

## F3.d: Mobile Play (Offline)
To achieve satisfactory offline playability, the design of our game was adapted to ensure that it functions properly without requiring an active internet connection. 

**Natural Language Explanation:** By utilizing the caching capabilities of our service worker, we allow the game to preload necessary assets, enabling users to play even when they are not connected to the internet. This enhances user experience, particularly in environments with unstable or absent internet access.

### Technical Details:
- The service worker caches all essential game assets and loads them from the cache when the game is played offline.
- When a player tries to access the game without an internet connection, the service worker fetches the game files from the cache:
  ```javascript
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });


## Individual Contributions

## Our group talked to the professor before the final presentation to discuss the contributions since we primarily used liveshare. Adam suggested we find the specific commits that we individally contributed to and so that is what we did. Below you will see what everyone worked on individually and together. 

For our project we extensively used the VS Code's 

### Atri Mehta

- Added Collision Detection and Zombie Behavior. This was to initially set the zombie too move on the grid and 
enable collision to work.
    - https://github.com/ymalegao/121Final/commit/7f128591bcf173f3ff89b323b6631673474a3b88
  
- DSL Parsing and Gameplayscenario
    - https://github.com/ymalegao/121Final/commit/8e7700c3fd06ef7db19a19ead58d99f0ce61c42c
    - I developed the DSLParser and gameplay scenario system, ensuring a clean and direct coding style.

- Logographic and Right-to-Left Script Implementation
    - https://github.com/ymalegao/121Final/commit/c9bc433671b289c1e82a2888637c8951140dc424
    - I implemented support for both logographic and right-to-left (RTL) scripts, enabling text localization for  three languages: a logographic script (e.g., Chinese or Japanese), an RTL script (e.g., Arabic), and a baseline language (English).

- Worked on grid ad polishing zombies to attack properly
    - https://github.com/ymalegao/121Final/commit/c3ca83403c758f24881f1379be4d0381741c2a8a
    - I worked on making sure the grid was centered and all the loading is done properly

- I got the game to save locally when Ctrl+S was pressed and got the ground work going on how to implement in slots:
  - https://github.com/ymalegao/121Final/commit/6a170ccd3ff99f57fd373c2f5fa861061d1251f3
  - I tried to implement the slots but could not get it to work. Yash and Luc pulled my code and were able
  to figure it out from the outline of my code


### Rahamat Zaman

- Adjusted Game Canvas and UI, and Internal DSL files (structurally changing the plant types for sunflower and attack plants)
    - https://github.com/ymalegao/121Final/commit/1b8c7003798ed46c2c9813e95f5a97705be67739

    - Worked on making the plant types strucally different using the internal DSL, and adjusted the dimensions of the Canvas and UI
    
- Resource Management (Water and Sun) and Auto Code Styling Tools such as Eslint and Prettier 
    - https://github.com/ymalegao/121Final/commit/7c81888b324581108c8804f71c9986c0a4fea779

    - Created a progress bar for the sun and water to showcase the resource management, and set up auto styling tools like ESlint and Prettier
    
- Started implementing Progressive Web App (PWA) for Mobile Play using the manifest file, and began implementing Offline Mobile Play using the service worker
    - https://github.com/ymalegao/121Final/commit/c3ca83403c758f24881f1379be4d0381741c2a8a -- Not my commit (LiveShare)

    - Began working on the PWA, and the offline feature by creating the service worker file and the manifest file

- Working on F3.c and F3.d the mobile installation and offline play with Yash
    - https://github.com/ymalegao/121Final/commit/34dd94f499451e9987812e237835560a27975803#diff-705a343a1ce4e0f83d32014fee0e343315ebd2ee4f99c0202deaaf34f143566c -- Not my commit (LiveShare)

    - Tried to make progress on the service worker and the manifest file by working on the favicon and making sure that the program is able to add to the home screen, set up http server and worked with that

- Canvas and UI changes, and working on F3.c
    - https://github.com/ymalegao/121Final/commit/4c21466d51bd5bcfdc8b9b498ca4fd2fbaf295be -- Not my commit (LiveShare)

    - Worked on the F3.c mobile installation, and started to change the code in the files, and added them to public due to the files having to cache the assets and files.

### Jay Kumar
Adding the attack plant class, sprite, and spawning functionality to the play scene
 - https://github.com/ymalegao/121Final/commit/af7cad3810c083f7584ac081a77214dcf67807db
 - Created a separate class to incorporate a second plant type into the game: the attack plant. Added the sprite and incorporated spawning functionality into play scene.

Changing primary language from Typescript to Javascript, changing tsx files to jsx files
 - https://github.com/ymalegao/121Final/commit/9f514206833499a63481bfc3a7f51f7bb241f5d9
 - Iterated through current ts files to convert them to javascript (this was done via liveshare). This included the classes and class managers, phaser scenes, and the tsx files.

Canvas and UI updates, capping resource generation
 - https://github.com/ymalegao/121Final/commit/4c21466d51bd5bcfdc8b9b498ca4fd2fbaf295be
 - Organized the UI of the game to fit with the new changes that had been made (for example, display turn count, formatting the resource stats, capping resource generation to be no more than 500, correcting resource scaling)


### Yash Malegaonkar
  - Hosted the build to github pages by using the node.js.yaml and set up the project with a react and vite framework
    -https://github.com/ymalegao/121Final/commit/35e19d877fc7c30271306f8f90238c3353a55112

  - Worked on F1 A and D and made the gamestate class in order to work with the gridstate to save the player's state in a array, and worked on the undo and redo functions, but was not able to get them to fully work in this commit
    
    -F1A:
      -https://github.com/ymalegao/121Final/commit/500c240b8cceed2b4d4224100e6c5f7ada32a77d
    -F1D:
      https://github.com/ymalegao/121Final/commit/461cedcaaa014731b2b35418ae3ab4094537b3ad
  -Worked on F1D further and refactored the Zombie code from default scene to be in a new ZombieManager and then also fixed f1D after refactoring because the error was with the zombie array and creating new ones
    Zombie class refactoring:
    -https://github.com/ymalegao/121Final/commit/dda6f109049e2f9a7a618e265575ffb13497e58a

    -undo redo fix:
      https://github.com/ymalegao/121Final/commit/1a5959e2a552f11346254613ac689f6bbc3ddd1b
  -
  
  -Worked on completing the saving and loading requirments that my team had started. I got rid of their saveManagaer and instead just had the array of savedGamesates that you could save in local storage by serializing and deserialziing to load
    - https://github.com/ymalegao/121Final/commit/1fbba1d92d6d6ae6e7b927c86090b176908fabe7
  
  -Worked on autosave
    https://github.com/ymalegao/121Final/commit/e9e71a290aa8db3585fabaf6cd6084c95b7c462a
    
  -Worked on F3C and F3D which involved sw.js and the webmanifest that was worked on by Raha. I used the favicon generator to give me favicons and it gave me a manifest as well, so I changed that, and then fixed a lot of links and made them relative links:
    https://github.com/ymalegao/121Final/commit/34dd94f499451e9987812e237835560a27975803

  -Finally got F3C and f3D working and deployed successfully to github pages with the cache, and PWA thing wokring with no errors and sprites laoding and all the other commits before this are short because i dint know how to test the deployment because it worked with npx httpx but not on the github pahges so I had to keep redeploying... 
    -https://github.com/ymalegao/121Final/commit/8153a8832bb688e91523af7c81422bd7e9aad5ac
   

### Luc Harnist
 - Water Sun Resource System & Advancing Time Manually
     - https://github.com/ymalegao/121Final/commit/a98571debfe1dc6ff81f2491058d960873debf5e 
     
     - Designed and implemented the foundational resource management system for water and sunlight. Managing time and turn based gameplay which is important to take into account when balancing gameplay. Introduced manual time advancement, which allows players to progress through turns with better foresight.

 - Bug Fixing
     - https://github.com/ymalegao/121Final/commit/77a403d3ed77edd4deef2a19e153c6ef6a6906f9

     - Identified and resolved a key bug in the undoing and redoing mechanic. Fixed the bug (Zombies infinitely spawned and would not dissapear when advancing the turn)

 - Helped with Undoing and Redoing
     - https://github.com/ymalegao/121Final/commit/c9bc433671b289c1e82a2888637c8951140dc424

     - Contributed to the design and debugging of the undo/redo stacks, allowing players to reverse actions seamlessly. My involvement enhanced both usability and code maintainability.

 - Worked / helped with UI of Game & Created plant and zombie interactions
     - https://github.com/ymalegao/121Final/commit/4c21466d51bd5bcfdc8b9b498ca4fd2fbaf295be

     - https://github.com/ymalegao/121Final/commit/361ecd1a355dee7d6070c0f73b789c749879f922

     - I helped with the interface design to ensure an intuitive and visually engaging user experience. I implemented the interactions between plants and zombies, including attack mechanics and growth animations.

 - Created the PlantDSL and helped create the Parser
     - https://github.com/ymalegao/121Final/commit/8e7700c3fd06ef7db19a19ead58d99f0ce61c42c -- Not my commit (LiveShare)

     - https://github.com/ymalegao/121Final/commit/1b8c7003798ed46c2c9813e95f5a97705be67739 -- Not my commit (LiveShare)

     - I developed a domain-specific language (DSL) for defining plant behaviors and growth conditions, which helped improve modularity and helped with organization. I assisted in building the parser, translating the DSL into executable game logic. This streamlined game mechanics implementation, reducing complexity in future updates.