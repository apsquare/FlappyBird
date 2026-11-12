# 🐦 Flappy Bird Clone — Phaser 3

A pixel-art, Flappy Bird–style arcade game built with [Phaser 3](https://phaser.io/) and bundled with webpack.
Guide the little blue bird through the gaps between the pipes. The longer you survive, the harder it gets.

---

## ✨ Features

- **Animated pixel-art bird** with an 8-frame flap cycle, drawn with hard pixel edges
- **Endless pipes**: pipe pairs are recycled and repositioned at random heights
- **Three difficulty tiers** that ramp up as your score grows
- **Score and best score**: your best score is saved in the browser (`localStorage`)
- **Pause and resume** with a 3-second "Fly in" countdown before play continues
- **Menus**: Play, Score (best score screen) and Exit
- **Retro typography** using the *Press Start 2P* pixel font with outlined, shadowed text

## 🎮 Controls

| Action | Input |
| --- | --- |
| Flap | Mouse click / tap, <kbd>Space</kbd>, or <kbd>W</kbd> |
| Pause | Click the gold pause button (bottom-right) |
| Menu selection | Click a menu item |

You lose if the bird hits a pipe, the top of the screen, or the ground. The game restarts automatically after one second.

## 📈 Difficulty

You score a point every time a pipe pair leaves the screen. Difficulty changes at fixed scores:

| Tier | Starts at score | Space between pipes | Opening to fly through |
| --- | --- | --- | --- |
| Easy | 0 | 420–470 px | 215–245 px |
| Normal | 10 | 370–420 px | 180–210 px |
| Hard | 25 | 330–375 px | 150–175 px |

The ranges are in `this.difficulties` and the switch points are in `increaseDifficulty()`, both in [`src/scenes/PlayScene.js`](src/scenes/PlayScene.js).

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) **14.6.0 or newer**
- npm (bundled with Node.js)

### Install and run

```bash
# 1. Clone or download this repository, then move into it
cd flappbird-clone

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:8080** in your browser.

### Production build

```bash
npm run build
```

This creates an optimized, minified build in the `build/` folder (the folder is cleaned first). Serve that folder with any static web server to host the game.

## 📁 Project Structure

```
flappbird-clone/
├── assets/                 # Images, sprite sheets and fonts (copied into build/)
│   ├── birdSprite.png      # 128×48 bird sprite sheet (16×16 frames)
│   ├── pause.png           # Pause button icon
│   ├── back.png            # Back button icon
│   ├── pipe.png            # Pipe image
│   ├── sky.png             # Background
│   └── fonts/              # Press Start 2P font + license
├── src/
│   ├── index.js            # Game config and scene registration
│   └── scenes/
│       ├── BaseScene.js    # Shared background, back button, menu builder, text styles
│       ├── PreloadScene.js # Loads assets and waits for the font
│       ├── MenuScene.js    # Main menu: Play / Score / Exit
│       ├── PlayScene.js    # Gameplay: bird, pipes, score, difficulty, pause
│       ├── PauseScene.js   # Pause menu: Continue / Exit
│       └── ScoreScene.js   # Best score screen
├── index.html              # HTML template (also declares the web font)
├── webpack.common.js       # Dev config (dev server on port 8080)
└── webpack.prod.js         # Production config (minify + clean build/)
```

### Scene flow

```
PreloadScene ──► MenuScene ──► PlayScene ◄──► PauseScene
                     │              │
                     ▼              └── game over → restart
                 ScoreScene
```

## 🛠️ Tweaking the Game

| What | Where |
| --- | --- |
| Screen size, bird start position | `WIDTH`, `HEIGHT`, `BIRD_POSITION` in `src/index.js` |
| Flap strength | `FLAPVELOCITY` in `src/scenes/PlayScene.js` |
| Gravity | `this.bird.body.gravity.y` in `createBird()` |
| Pipe speed | `this.pipes.setVelocityX(-200)` in `createPipes()` |
| Font, text colors, outline, shadow | `fontOptions` / `hudFontOptions` in `src/scenes/BaseScene.js` |

`pixelArt: true` is turned on in the game config, so sprites stay sharp when scaled. If you add new pixel-art images, keep their edges hard (no anti-aliasing or semi-transparent pixels) so they don't look blurry.

## 🧰 Tech Stack

- [Phaser 3](https://phaser.io/) with Arcade Physics
- [webpack 5](https://webpack.js.org/) + webpack-dev-server
- [Babel](https://babeljs.io/) for JS transpilation

## 📜 Credits

- **Font:** [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) by CodeMan38, licensed under the [SIL Open Font License 1.1](assets/fonts/OFL.txt)
- Inspired by the original *Flappy Bird*. This is a fan-made learning project and isn't affiliated with the original game.
