import * as PIXI from 'pixi.js';
import GridManager from './GridManager';

export default class Player {
  private container: PIXI.Container; // Parent container for the player
  private graphics: PIXI.Graphics; // Represents the player's rectangle
  private gridManager: GridManager;
  public position: { x: number; y: number };

  constructor(
    container: PIXI.Container,
    gridManager: GridManager,
    startX: number,
    startY: number,
  ) {
    this.container = container;
    this.gridManager = gridManager;
    this.position = { x: startX, y: startY };

    // Create and position the player's rectangle
    const { x, y } = gridManager.getCellWorldPosition(startX, startY);
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0x00ff00); // Green color
    this.graphics.drawRect(
      -gridManager.cellSize / 4, // Center the rectangle
      -gridManager.cellSize / 4,
      gridManager.cellSize / 2,
      gridManager.cellSize / 2,
    );
    this.graphics.endFill();
    this.graphics.position.set(x, y);
    this.container.addChild(this.graphics); // Add to the container
  }

  public move(direction: 'up' | 'down' | 'left' | 'right'): void {
    let newX = this.position.x;
    let newY = this.position.y;

    if (direction === 'up') newY--;
    if (direction === 'down') newY++;
    if (direction === 'left') newX--;
    if (direction === 'right') newX++;

    if (this.gridManager.isWithinBounds(newX, newY)) {
      this.position = { x: newX, y: newY };
      const { x, y } = this.gridManager.getCellWorldPosition(newX, newY);
      this.graphics.position.set(x, y);
    }
  }

  public setPosition(x: number, y: number): void {
    this.position = { x, y };
    const { x: worldX, y: worldY } = this.gridManager.getCellWorldPosition(x, y);
    this.graphics.position.set(worldX, worldY);
  }
}
