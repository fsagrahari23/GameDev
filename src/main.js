import kaplay from "kaplay";

const k = kaplay({
  width: window.innerWidth,  // Initial canvas width
  height: window.innerHeight,  // Initial canvas height
  global: true,
  debug: true,
});
k.setBackground(k.rgb(0, 100, 200));
// Resize the canvas dynamically when the window size changes
window.addEventListener("resize", () => {
  k.width(window.innerWidth);
  k.height(window.innerHeight);
});

// Background music setup
const music = new Audio('m1.mp3');
const gameOverMusic = new Audio('m2.mp3');
music.loop = true;  // Set to loop for background music
k.color(k.rgb(0, 0, 255));
k.loadBean();
k.setGravity(2000);

// Menu Scene
k.scene("menu", () => {
  k.add([k.text("Monu Game", { size: Math.min(window.innerWidth / 15, 48) }), k.pos(k.center().sub(0, 100)), k.color(k.rgb(1, 1, 1))]);

  const startButton = k.add([
    k.text("Start Game", { size: Math.min(window.innerWidth / 20, 32) }),
    k.pos(k.center()),
    k.area(),
    k.color(k.rgb(0, 1, 0)),
  ]);

  const highScoreButton = k.add([
    k.text("High Scores", { size: Math.min(window.innerWidth / 20, 32) }),
    k.pos(k.center().add(0, 60)),
    k.area(),
    k.color(k.rgb(0, 1, 0)),
  ]);

  startButton.onClick(() => {
    music.play();  // Play the background music when starting the game
    k.go("game");
  });

  highScoreButton.onClick(() => k.go("highscore"));
});

// Game Scene
let score = 0;
k.scene("game", () => {

  const player = k.add([
    k.sprite("bean"),
    k.pos(window.innerWidth / 2, window.innerHeight / 2),
    k.area(),
    k.body(),
    k.offscreen(),
  ]);

  const scoreUI = k.add([k.text(`Score: ${score}`, { size: Math.min(window.innerWidth / 20, 24) }), k.pos(20, 20), k.color(k.rgb(1, 1, 1))]);

  player.onKeyPressRepeat("space", () => {
    if (player.isGrounded()) {
      player.jump(600);
    }
  });

  player.onKeyPressRepeat("left", () => {
    player.move(-1200, 0);
  });

  player.onKeyPressRepeat("right", () => {
    player.move(1200, 0);
  });

  player.onExitScreen(() => k.go("endgame", { finalScore: score }));

  k.add([k.rect(k.width(), 300), k.pos(0, window.innerHeight - 200), k.area(), k.outline(3), k.body({ isStatic: true })]);

  let currspeed = 300;
  k.loop(1, () => {
    const isCoin = Math.random() > 0.5;

    currspeed += 10;

    k.add([
      k.circle(20),
      k.pos(Math.random() * window.innerWidth, 0),
      k.color(k.rgb(230, 234, 25)), // Gold color
      k.area(),
      k.move(k.vec2(0, 1), currspeed),
      "coin",
    ]);

    k.add([
      k.rect(50, 50),
      k.pos(Math.random() * window.innerWidth, 0),
      k.color(k.rgb(1, 0, 0)), // Red color
      k.area(),
      k.move(k.vec2(0, 1), currspeed),
      "obstacle",
    ]);
  });

  player.onCollide("coin", (coin) => {
    score++;
    scoreUI.text = `Score: ${score}`;
    k.destroy(coin);
  });

  player.onCollide("obstacle", () => {
    k.go("endgame", { finalScore: score });
  });
});

// End Game Scene
k.scene("endgame", ({ finalScore }) => {
  music.pause(); // Stop the background music
  gameOverMusic.play();  // Play the game over music
  if (localStorage.getItem("highscore") < finalScore) {
    localStorage.setItem("highscore", finalScore);
  }
  k.add([k.text(`Game Over`, { size: Math.min(window.innerWidth / 15, 48) }), k.pos(k.center().sub(0, 100)), k.color(k.rgb(1, 1, 1))]);
  k.add([k.text(`Score: ${finalScore}`, { size: Math.min(window.innerWidth / 20, 32) }), k.pos(k.center()), k.color(k.rgb(1, 0, 0))]);

  const restartButton = k.add([
    k.text("Restart", { size: Math.min(window.innerWidth / 20, 32) }),
    k.pos(k.center().add(0, 60)),
    k.area(),
    k.color(k.rgb(0, 1, 0)),
  ]);
  const menuButton = k.add([
    k.text("Menu", { size: Math.min(window.innerWidth / 20, 32) }),
    k.pos(k.center().add(0, 120)),
    k.area(),
    k.color(k.rgb(0, 1, 0)),
  ]);

  restartButton.onClick(() => {
    gameOverMusic.pause();  // Stop the game over music
    music.play();  // Start background music again
    k.go("game");
  });
  menuButton.onClick(() => {
    gameOverMusic.pause();  // Stop the game over music
    music.play();  // Start background music again
    k.go("menu");
  });
});

// High Score Scene
k.scene("highscore", () => {
  k.add([k.text("High Scores", { size: Math.min(window.innerWidth / 15, 48) }), k.pos(k.center().sub(0, 100)), k.color(k.rgb(1, 1, 1))]);

  const highscore = localStorage.getItem("highscore") || 0;
  k.add([
    k.text(`High Score: ${highscore}`, { size: Math.min(window.innerWidth / 20, 32) }),
    k.pos(k.center().add(0, 6)),
    k.area(),
    k.color(k.rgb(0, 1, 0)),
  ]);

  const backButton = k.add([
    k.text("Back to Menu", { size: Math.min(window.innerWidth / 20, 32) }),
    k.pos(k.center().add(0, 110)),
    k.area(),
    k.color(k.rgb(0, 1, 0)),
  ]);

  backButton.onClick(() => k.go("menu"));
});

// Start the Game
k.go("menu");
