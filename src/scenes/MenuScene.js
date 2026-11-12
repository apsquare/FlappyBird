import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);
    this.menu = [
      { scene: "PlayScene", text: "Play" },
      { scene: "ScoreScene", text: "Score" },
      { scene: null, text: "Exit" },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, (menuItem) => this.setUpMenuEvents(menuItem));
  }

  setUpMenuEvents(menuItem) {
    const textGO = menuItem.textGO;
    textGO.setInteractive();
    textGO.on("pointerover", () => {
      textGO.setStyle({ fill: "#ffd45c" });
    });
    textGO.on("pointerout", () => {
      textGO.setStyle({ fill: "#fff" });
    });

    textGO.on("pointerup", () => {
      menuItem.scene && this.scene.start(menuItem.scene);
      if (menuItem.text === "Exit") {
        // This shuts the entire phaser game
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;

// Create Score Scene
// Display the best score you can get form the local storage
