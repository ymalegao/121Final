import Phaser from 'phaser';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

// Scenes
import MenuScene from './scenes/MenuScene';
import DefaultScene from './scenes/DefaultScene';

export const PhaserGame = forwardRef((_, ref) => {
  const [game, setGame] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      margin: 100,
      parent: 'phaser-game',
      backgroundColor: '#87CEEB',
      scene: [MenuScene, DefaultScene],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
    };

    const gameInstance = new Phaser.Game(config);
    setGame(gameInstance);

    gameInstance.events.on('poststep', () => {
      setCurrentScene(gameInstance.scene.getAt(0));
    });

    return () => {
      gameInstance.destroy(true);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    game,
    scene: currentScene,
    getGameState() {
      console.log('currentScene:', currentScene);
      return currentScene;
    },
  }));

  return (
    <div
      id="phaser-game"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'block',
        width: '1280px', // Same width as your Phaser game
        height: '720px', // Same height as your Phaser game
      }}
    />
  );
});