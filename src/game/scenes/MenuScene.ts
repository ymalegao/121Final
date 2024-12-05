export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {}

  create() {
    // Add title
    const titleStyle = {
      fontFamily: 'Arial',
      fontSize: '48px',
      color: '#FFFFFF',
      align: 'center',
    };
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 150,
        'Plant vs Zombies Grid Game',
        titleStyle,
      )
      .setOrigin(0.5);

    // Add instructions
    const instructionsStyle = {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#FFFFFF',
      align: 'center',
    };
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
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        instructions,
        instructionsStyle,
      )
      .setOrigin(0.5);

    // Add "Press SPACE to Start" text
    const startStyle = {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#FFFF00',
      align: 'center',
    };
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 150,
        'Press SPACE to Start',
        startStyle,
      )
      .setOrigin(0.5);

    // Define key input for starting the game
    if (this.input && this.input.keyboard) {
      const spaceKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      );

      // Start DefaultScene on SPACE press
      spaceKey.once('down', () => {
        console.log('test');
        this.scene.start('DefaultScene'); // Replace with your game scene
      });
    }
  }
}
