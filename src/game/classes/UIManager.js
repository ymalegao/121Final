export default class UIManager {
    constructor(scene, sunText, waterText) {
        this.scene = scene;
        this.sunText = sunText;
        this.waterText = waterText;
        this.createResourceDisplay();
    }

    createResourceDisplay() {
        // Text for Sun and Water
        this.sunText = this.scene.add.text(16, 16, 'Sun: 0', {
            fontSize: '16px',
            color: '#fff',
        });
        this.waterText = this.scene.add.text(16, 40, 'Water: 0', {
            fontSize: '16px',
            color: '#fff',
        });

        // Progress bars for Sun and Water
        this.sunBar = this.scene.add.graphics();
        this.sunBar.fillStyle(0xffff00, 1); // Yellow for sun
        this.sunBar.fillRect(100, 10, 200, 20);

        this.waterBar = this.scene.add.graphics();
        this.waterBar.fillStyle(0x1e90ff, 1); // Blue for water
        this.waterBar.fillRect(100, 34, 200, 20);
    }

    updateResources(totalSun, totalWater, maxSun, maxWater) {
        // Update the text displays
        this.sunText.setText(`Sun: ${totalSun}`);
        this.waterText.setText(`Water: ${totalWater}`);
    
        // Calculate progress percentages
        const sunPercentage = Phaser.Math.Clamp(totalSun / maxSun, 0, 1);
        const waterPercentage = Phaser.Math.Clamp(totalWater / maxWater, 0, 1);
    
        // Update the sun bar
        this.sunBar.clear();
        this.sunBar.fillStyle(0xffff00, 1); // Yellow for sun
        this.sunBar.fillRect(100, 10, 200 * sunPercentage, 20); // Scale bar by percentage
    
        // Update the water bar
        this.waterBar.clear();
        this.waterBar.fillStyle(0x1e90ff, 1); // Blue for water
        this.waterBar.fillRect(100, 34, 200 * waterPercentage, 20); // Scale bar by percentage
    }

    showGameOver() {
        this.scene.add
            .text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY - 30, 'Game Over!', {
                fontFamily: '"Press Start 2P", sans-serif',
                fontSize: '24px',
                color: '#FF0000',
            })
            .setOrigin(0.5);

        this.scene.add
            .text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + 20, 'Press R to Restart', {
                fontFamily: '"Press Start 2P", sans-serif',
                fontSize: '16px',
                color: '#FFFFFF',
            })
            .setOrigin(0.5);
    }
}