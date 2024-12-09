import * as PIXI from 'pixi.js';

export default class MenuScene {
  private app: PIXI.Application;
  public container: PIXI.Container;
  private startGameCallback: () => void;

  constructor(app: PIXI.Application, startGameCallback: () => void) {
    this.app = app;
    this.startGameCallback = startGameCallback;

    // Create a container for the menu scene
    this.container = new PIXI.Container();

    // Initialize the menu
    this.create();
  }

  private create(): void {
    // Add title
    const titleStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 48,
      fill: '#FFFFFF',
      align: 'center',
    });
    const titleText = new PIXI.Text('Plant vs Zombies Grid Game', titleStyle);
    titleText.anchor.set(0.5);
    titleText.position.set(
      this.app.renderer.width / 2,
      this.app.renderer.height / 2 - 150
    );
    this.container.addChild(titleText);

    // Add instructions
    const instructionsStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#FFFFFF',
      align: 'center',
    });
    const instructions = `
        Instructions:
        - Use Arrow Keys to Move.
        - Press P to Plant a Sun Plant.
        - Press A to Plant an Attack Plant.
        - Press N to Advance a Turn.
        - Press Z to Undo.
        - Press Y to Redo.
        - Defend your grid and grow your plants!
        `;
    const instructionsText = new PIXI.Text(instructions, instructionsStyle);
    instructionsText.anchor.set(0.5);
    instructionsText.position.set(
      this.app.renderer.width / 2,
      this.app.renderer.height / 2
    );
    this.container.addChild(instructionsText);

    // Add "Press SPACE to Start" text
    const startStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 32,
      fill: '#FFFF00',
      align: 'center',
    });
    const startText = new PIXI.Text('Press SPACE to Start', startStyle);
    startText.anchor.set(0.5);
    startText.position.set(
      this.app.renderer.width / 2,
      this.app.renderer.height / 2 + 150
    );
    this.container.addChild(startText);

    // Setup keyboard input to start the game
    window.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  private handleKeyPress(event: KeyboardEvent): void {
    if (event.key === ' ') {
      this.startGame();
    }
  }

  private startGame(): void {
    window.removeEventListener('keydown', this.handleKeyPress.bind(this));
    this.startGameCallback();
  }

  public destroy(): void {
    this.container.destroy({ children: true });
    window.removeEventListener('keydown', this.handleKeyPress.bind(this));
  }
}
