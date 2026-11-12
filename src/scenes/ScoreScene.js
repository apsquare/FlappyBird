import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
  constructor(config) {
    super("ScoreScene", { ...config, canGoBack: true });
  }

  create() {
    super.create();
    const bestScore = localStorage.getItem("bestScore");
    this.add
      .text(
        ...this.screenCenter,
        `BestScore: ${bestScore}` || 0,
        this.fontOptions,
      )
      .setOrigin(0.5);
  }
}

export default ScoreScene;

// Create Score Scene
// Display the best score you can get form the local storage
