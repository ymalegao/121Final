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
Plants can achieve three growth levels. Each growth level influences the multiplier for the plant's production. For example, a Sun Plant at level 2 produces resources at twice the base rate (product * 2).

### F0.f: Simple spatial rules govern plant growth based on sun, water, and nearby plants (satisfying conditions unlock growth).
When plants of the same type are placed next to each other, their future planting costs decrease. For example, two Sunflower Plants placed adjacent to each other reduce the cost of placing a third Sunflower Plant in proximity.

### F0.g: A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).
The player loses when a Zombie reaches the leftmost column of the grid, providing a clear win/loss condition for the game.

---

## Reflection

Looking back on how we achieved the F0 requirements, our team’s plan changed significantly. Initially, we planned to have separate "grow" and "fight" phases like in games such as *Clash of Clans*. However, we decided to combine these phases into a continuous game loop where combat and growth happen simultaneously. This change simplified our workflow and reduced the complexity of the game.

Additionally, we had to adapt our tools. Initially, we planned to host the game using a simple live server setup. However, due to the nature of the Phaser project and the React-based repo we cloned, we had to integrate Vite as a build tool. This required us to build the game using `npm run build` and deploy the `dist/index.html` to GitHub Pages. While this made the setup process more challenging, it allowed us to optimize the game for deployment.

Overall, these adjustments helped us streamline development, focus on core mechanics, and meet the F0 requirements effectively while learning valuable lessons about game design and deployment. 
    
