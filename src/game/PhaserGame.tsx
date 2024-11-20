import Phaser from 'phaser';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import DefaultScene from './scenes/DefaultScene';

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

export const PhaserGame = forwardRef<IRefPhaserGame>((props, ref) => {
    const [game, setGame] = useState<Phaser.Game | null>(null);
    const [currentScene, setCurrentScene] = useState<Phaser.Scene | null>(null);

    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 1024,
            height: 600,
            parent: 'phaser-game',
            backgroundColor: '#87CEEB',
            scene: [DefaultScene],
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
    }));

    return <div id="phaser-game"></div>;
});
