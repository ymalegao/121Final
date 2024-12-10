export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
    this.translations = {}; // Store translations
    this.currentLanguage = 'en'; // Default language
  }

  preload() {
    // Load translation files
    this.load.json('en', './game/languagejson/en.json'); // Use consistent keys
    this.load.json('zh', './game/languagejson/zh.json');
    this.load.json('ar', './game/languagejson/ar.json');
  }

  create() {
    // Load translations into memory
    this.translations.en = this.cache.json.get('en');
    this.translations.zh = this.cache.json.get('zh');
    this.translations.ar = this.cache.json.get('ar');

    // Debug log to verify translations are loaded
    console.log('Loaded translations:', this.translations);

    // Create language selection buttons
    this.createLanguageButtons();

    // Render menu with default language
    this.renderMenu();
  }

  createLanguageButtons() {
    const languages = [
      { key: 'en', label: 'English' },
      { key: 'zh', label: 'Chinese' },
      { key: 'ar', label: 'Arabic' },
    ];
    const buttonStyle = {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#FFFFFF',
    };

    languages.forEach((lang, index) => {
      this.add
        .text(50, 50 + index * 40, lang.label, buttonStyle)
        .setInteractive()
        .on('pointerdown', () => {
          this.currentLanguage = lang.key;
          this.renderMenu(); // Re-render menu with the selected language
          //this.scene.start('DefaultScene', { selectedLanguage: lang.key }); // Pass language to the next scene
        });
    });
  }

  renderMenu() {
    // Clear previous menu elements
    this.children.removeAll();

    const t = this.translations[this.currentLanguage];

    // Handle missing translations gracefully
    if (!t) {
      console.error(`Missing translations for language: ${this.currentLanguage}`);
      return;
    }

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
        t.title,
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
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        t.instructions,
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
        t.start,
        startStyle,
      )
      .setOrigin(0.5);

    // Add language buttons
    this.createLanguageButtons();

    // Define key input for starting the game
    if (this.input && this.input.keyboard) {
      const spaceKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
      );

      // Start DefaultScene on SPACE press
    spaceKey.once('down', () => {
      console.log('Starting game...');
      this.scene.start('DefaultScene', { selectedLanguage: this.currentLanguage });
    });
  }
}
}
