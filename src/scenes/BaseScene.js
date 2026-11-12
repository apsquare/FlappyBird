import Phaser from "phaser";

// Other classes will use this Base scene for things that can be reused
class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.fintSize = 34;
    this.lineHeight = 60;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontFamily = '"Press Start 2P", "Courier New", monospace';
    this.textShadow = {
      offsetX: 0,
      offsetY: 4,
      color: "#0c1a3f",
      blur: 0,
      stroke: true,
      fill: true,
    };
    this.fontOptions = {
      fontFamily: this.fontFamily,
      fontSize: "32px",
      fill: "#FFFFFF",
      stroke: "#0c1a3f",
      strokeThickness: 8,
      shadow: this.textShadow,
      padding: { x: 4, y: 6 },
    };
    this.hudFontOptions = {
      fontFamily: this.fontFamily,
      fill: "#FFFFFF",
      stroke: "#0c1a3f",
      strokeThickness: 6,
      shadow: { ...this.textShadow, offsetY: 3 },
      padding: { x: 4, y: 4 },
    };
  }

  create() {
    this.add.image(0, 0, "sky").setOrigin(0);
    if (this.config.canGoBack) {
      const backButton = this.add
        .image(this.config.width - 10, this.config.height - 10, "back")
        .setOrigin(1)
        .setScale(2)
        .setInteractive();

      backButton.on("pointerup", () => {
        this.scene.start("MenuScene");
      });
    }
  }
  createMenu(menu, setUpMenuEvents) {
    let lastMenuPositionY = 0;
    menu.forEach((menuItem) => {
      const menuPosition = [
        this.screenCenter[0],
        this.screenCenter[1] + lastMenuPositionY,
      ];
      lastMenuPositionY += this.lineHeight;
      menuItem.textGO = this.add
        .text(...menuPosition, menuItem.text, this.fontOptions)
        .setOrigin(0.5, 1);

      setUpMenuEvents(menuItem);
    });
  }
}

export default BaseScene;
