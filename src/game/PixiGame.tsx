import React, { forwardRef, useLayoutEffect, useImperativeHandle, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import MenuScene from './scenes/MenuScene';
import DefaultScene from './scenes/DefaultScene';

export interface IRefPixiGame {
  app: PIXI.Application | null;
  currentScene: PIXI.Container | null;
  getGameState: () => any | null;
}

export const PixiGame = forwardRef<IRefPixiGame>((_, ref) => {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const [app, setApp] = useState<PIXI.Application | null>(null);
  const [currentScene, setCurrentScene] = useState<PIXI.Container | null>(null);

  useLayoutEffect(() => {
    console.log('Initializing PIXI Application...');

    if (!pixiContainerRef.current) {
      console.error('Pixi container ref is not attached to the DOM.');
      return;
    }

    // Initialize PIXI Application with appropriate options
    const pixiApp = new PIXI.Application({
      width: 1000,
      height: 640,
      backgroundColor: 0x87ceeb, // Sky blue background
    });

    console.log('PIXI Application created:', pixiApp);

    // Append the canvas to the container
    const canvasElement = pixiApp.canvas || pixiApp.view; // Use `canvas` or fallback to `view`
    if (canvasElement) {
      pixiContainerRef.current.appendChild(canvasElement);
      console.log('PIXI canvas appended to container.');
    } else {
      console.error('Canvas is not defined in PIXI Application.');
      return;
    }

    // Create and display the MenuScene
    const menuScene = new MenuScene(pixiApp, () => {
      console.log('Switching to DefaultScene...');
      pixiApp.stage.removeChild(menuScene.container);
      const defaultScene = new DefaultScene(pixiApp);
      pixiApp.stage.addChild(defaultScene.container);
      setCurrentScene(defaultScene.container);
    });
    pixiApp.stage.addChild(menuScene.container);
    setCurrentScene(menuScene.container);

    setApp(pixiApp);

    return () => {
      console.log('Cleaning up PIXI Application...');
      pixiApp.destroy(true, { children: true });
      setApp(null);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    app,
    currentScene,
    getGameState: () => {
      console.log('Current scene:', currentScene);
      return currentScene; // Placeholder: Replace with game state retrieval logic
    },
  }));

  return (
    <div
      ref={pixiContainerRef}
      id="pixi-game"
      style={{ width: '100%', height: '100%' }}
    ></div>
  );
});
