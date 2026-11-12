import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor(config) {
    super("PreloadScene");
  }
  preload() {
    this.load.image("sky", "./assets/sky.png");
    this.load.spritesheet("bird", "./assets/birdSprite.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("pipe", "./assets/pipe.png");
    this.load.image("pause", "./assets/pause.png");
    this.load.image("back", "./assets/back.png");
  }
  create() {
    this.textures.get("bird").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get("pause").setFilter(Phaser.Textures.FilterMode.NEAREST);
    // Wait for the UI font so the first text drawn isn't in a fallback font
    const startMenu = () => this.scene.start("MenuScene");
    if (document.fonts && document.fonts.load) {
      document.fonts.load('16px "Press Start 2P"').then(startMenu, startMenu);
    } else {
      startMenu();
    }
  }
  update() {}
}

export default PreloadScene;
