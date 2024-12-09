import * as PIXI from 'pixi.js';

export default class UIManager {
    private app: PIXI.Application;
    public sunText: PIXI.Text;
    public waterText: PIXI.Text;
    private sunBar: PIXI.Graphics;
    private waterBar: PIXI.Graphics;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.createResourceDisplay();
    }

    public createResourceDisplay() {
        // Text for Sun and Water
        const textStyle = new PIXI.TextStyle({
            fontSize: 16,
            fill: '#ffffff',
        });

        this.sunText = new PIXI.Text('Sun: 0', textStyle);
        this.sunText.position.set(16, 16);
        this.app.stage.addChild(this.sunText);

        this.waterText = new PIXI.Text('Water: 0', textStyle);
        this.waterText.position.set(16, 40);
        this.app.stage.addChild(this.waterText);

        // Progress bars for Sun and Water
        this.sunBar = new PIXI.Graphics();
        this.sunBar.beginFill(0xffff00); // Yellow for sun
        this.sunBar.drawRect(100, 10, 200, 20);
        this.sunBar.endFill();
        this.app.stage.addChild(this.sunBar);

        this.waterBar = new PIXI.Graphics();
        this.waterBar.beginFill(0x1e90ff); // Blue for water
        this.waterBar.drawRect(100, 34, 200, 20);
        this.waterBar.endFill();
        this.app.stage.addChild(this.waterBar);
    }

    public updateResources(totalSun: number, totalWater: number, maxSun: number, maxWater: number): void {
        // Update the text displays
        this.sunText.text = `Sun: ${totalSun}`;
        this.waterText.text = `Water: ${totalWater}`;

        // Calculate progress percentages
        const sunPercentage = Math.max(0, Math.min(totalSun / maxSun, 1));
        const waterPercentage = Math.max(0, Math.min(totalWater / maxWater, 1));

        // Update the sun bar
        this.sunBar.clear();
        this.sunBar.beginFill(0xffff00); // Yellow for sun
        this.sunBar.drawRect(100, 10, 200 * sunPercentage, 20); // Scale bar by percentage
        this.sunBar.endFill();

        // Update the water bar
        this.waterBar.clear();
        this.waterBar.beginFill(0x1e90ff); // Blue for water
        this.waterBar.drawRect(100, 34, 200 * waterPercentage, 20); // Scale bar by percentage
        this.waterBar.endFill();
    }

    public showGameOver() {
        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;

        const gameOverStyle = new PIXI.TextStyle({
            fontFamily: 'Press Start 2P, sans-serif',
            fontSize: 24,
            fill: '#FF0000',
            align: 'center',
        });

        const restartStyle = new PIXI.TextStyle({
            fontFamily: 'Press Start 2P, sans-serif',
            fontSize: 16,
            fill: '#FFFFFF',
            align: 'center',
        });

        const gameOverText = new PIXI.Text('Game Over!', gameOverStyle);
        gameOverText.anchor.set(0.5);
        gameOverText.position.set(centerX, centerY - 30);
        this.app.stage.addChild(gameOverText);

        const restartText = new PIXI.Text('Press R to Restart', restartStyle);
        restartText.anchor.set(0.5);
        restartText.position.set(centerX, centerY + 20);
        this.app.stage.addChild(restartText);
    }
}
