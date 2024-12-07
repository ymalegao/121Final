// Define the Direction type
type Direction = 'up' | 'down' | 'left' | 'right';

export default class InputManager {
  constructor(scene: Phaser.Scene) {
    this.initializeKeyBindings(scene);
  }

  private initializeKeyBindings(scene: Phaser.Scene): void {
    const keyboard = scene.input.keyboard;

    if (keyboard) {
      // Emit strictly typed direction events
      keyboard.on('keydown-UP', () =>
        scene.events.emit('playerMove', 'up' as Direction),
      );
      keyboard.on('keydown-DOWN', () =>
        scene.events.emit('playerMove', 'down' as Direction),
      );
      keyboard.on('keydown-LEFT', () =>
        scene.events.emit('playerMove', 'left' as Direction),
      );
      keyboard.on('keydown-RIGHT', () =>
        scene.events.emit('playerMove', 'right' as Direction),
      );

      keyboard.on('keydown-N', () => scene.events.emit('advanceTurn'));
      keyboard.on('keydown-P', () => scene.events.emit('plantSun'));
      keyboard.on('keydown-A', () => scene.events.emit('plantAttack'));
    }
  }
}
