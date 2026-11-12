import BaseScene from "./BaseScene";

const PIPES_TO_RENDER = 4;
const FLAPVELOCITY = 300;

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);

    this.bird = null;
    this.pipes = null;
    this.isPaused = false;

    this.FLAPVELOCITY = 300;
    this.score = 0;
    this.scoreText = "";
    this.bestScore = 0;
    this.bestScoreText = "";
    this.currentDifficulty = "easy";
    // Bird is ~48px tall, a flap lifts it ~75px, pipes move at 200px/s.
    // horizontal: gap between pipe pairs (÷200 = seconds to react)
    // vertical: opening the bird flies through (÷48 = bird heights)
    this.difficulties = {
      easy: {
        horizotalPipeDistanceRange: [420, 470], // ~2.1–2.35s
        pipeVerticalDistanceRange: [215, 245], // ~4.5–5 birds
      },
      normal: {
        horizotalPipeDistanceRange: [370, 420], // ~1.85–2.1s
        pipeVerticalDistanceRange: [180, 210], // ~3.75–4.4 birds
      },
      hard: {
        horizotalPipeDistanceRange: [330, 375], // ~1.65–1.9s
        pipeVerticalDistanceRange: [150, 175], // ~3.1–3.6 birds
      },
    };
  }

  create() {
    super.create();
    this.currentDifficulty = "easy";
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.handleInputs();
    this.createPause();
    this.increaseBestScore();
    this.listentoEvent();

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 8, end: 15 }),
      // Since we have total 8 frames here - all these will play once in 1 sec
      frameRate: 8,
      // Repeat infinitely
      repeat: -1,
    });

    this.bird.play("fly");
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  listentoEvent() {
    if (this.pauseEvent) {
      return;
    }

    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countDownText = this.add
        .text(
          ...this.screenCenter,
          "Fly In : " + this.initialTime,
          this.fontOptions,
        )
        .setOrigin(0.5);

      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.initialTime--;
    this.countDownText.setText("Fly in : " + this.initialTime);
    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createBG() {
    this.add.image(0, 0, "sky").setOrigin(0);
  }

  createPause() {
    this.isPaused = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setScale(3)
      .setOrigin(1);

    pauseButton.setInteractive();
    pauseButton.on("pointerdown", () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }

  createScore() {
    this.score = 0;
    this.bestScore = Number(localStorage.getItem("bestScore")) || 0;
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
      ...this.hudFontOptions,
      fontSize: "24px",
    });
    this.bestScoreText = this.add.text(16, 52, `BestScore: ${this.bestScore}`, {
      ...this.hudFontOptions,
      fontSize: "16px",
      fill: "#ffd45c",
    });
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setScale(3)
      .setFlip(true)
      .setOrigin(0);
    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds();
  }

  createPipes() {
    this.pipes = this.physics.add.group();
    // 0,1 of the pipe should be at (400,100)

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      // We provide the pipes with a temporary locaiton of (0,0)
      const uPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable()
        .setOrigin(0, 1);
      const lPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable()
        .setOrigin(0, 0);

      this.placePipe(uPipe, lPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown-W", this.flap, this);
  }

  checkGameStatus() {
    if (
      this.bird.getBounds().bottom >= this.config.height ||
      this.bird.y <= 0
    ) {
      this.gameOver();
    }
  }

  recyclePipes() {
    let tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        // It means that both the upper and the lower pipes have been collected so we can place them
        if (tempPipes.length == 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty() {
    if (this.score === 10) {
      this.currentDifficulty = "normal";
    }

    if (this.score === 25) {
      this.currentDifficulty = "hard";
    }
  }

  placePipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    let rightMostX = this.getRightMostPipe();

    let pipVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVerticalDistanceRange,
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipVerticalDistance,
    );
    let pipeHorizontalDiatance = Phaser.Math.Between(
      ...difficulty.horizotalPipeDistanceRange,
    );

    uPipe.x = rightMostX + pipeHorizontalDiatance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipVerticalDistance;
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xff0000);
    this.increaseBestScore();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  flap() {
    if (this.isPaused) return;
    this.bird.body.velocity.y = -FLAPVELOCITY;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
    this.increaseBestScore();
  }

  increaseBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem("bestScore", this.bestScore);
    }
    this.bestScoreText.setText(`BestScore: ${this.bestScore}`);
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach((pi) => {
      rightMostX = Math.max(pi.x, rightMostX);
    });

    return rightMostX;
  }
}

export default PlayScene;
