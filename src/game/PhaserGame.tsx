// import Phaser from 'phaser';
// import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
// import DefaultScene from './scenes/DefaultScene';

// export interface IRefPhaserGame {
//     game: Phaser.Game | null;
//     scene: Phaser.Scene | null;
// }

// export const PhaserGame = forwardRef<IRefPhaserGame>((props, ref) => {
//     const [game, setGame] = useState<Phaser.Game | null>(null);
//     const [currentScene, setCurrentScene] = useState<Phaser.Scene | null>(null);

//     useEffect(() => {
//         const config: Phaser.Types.Core.GameConfig = {
//             type: Phaser.AUTO,
//             width: 1024,
//             height: 600,
//             parent: 'phaser-game',
//             backgroundColor: '#87CEEB',
//             scene: [DefaultScene],
//             physics: {
//                 default: 'arcade',
//                 arcade: {
//                     debug: false,
//                 },
//             },
//         };

//         const gameInstance = new Phaser.Game(config);
//         setGame(gameInstance);

//         gameInstance.events.on('poststep', () => {
//             setCurrentScene(gameInstance.scene.getAt(0) as Phaser.Scene);
//         });

//         return () => {
//             gameInstance.destroy(true);
//         };
//     }, []);

//     useImperativeHandle(ref, () => ({
//         game,
//         scene: currentScene,
//     }));

//     return <div id="phaser-game"></div>;
// });

import Phaser from 'phaser';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

// Scenes
import MenuScene from './scenes/MenuScene';
import DefaultScene from './scenes/DefaultScene';

// Classes
// import GameState from './classes/GameState';
// import GridManager from './classes/GridManager';
// import Player from './classes/Player';
// import PlantManager from './classes/PlantManager';
// import ZombieManager from './classes/ZombieManager';
// import GridState from './classes/GridState';

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
  getGameState: () => any | null;
}

export const PhaserGame = forwardRef<IRefPhaserGame>((_, ref) => {
  // Removed 'props' since it is not used
  const [game, setGame] = useState<Phaser.Game | null>(null);
  const [currentScene, setCurrentScene] = useState<Phaser.Scene | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1024,
      height: 600,
      // width: 800,
      // height: 400,
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
      setCurrentScene(gameInstance.scene.getAt(0) as Phaser.Scene);
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

  return <div id="phaser-game"></div>;
});
