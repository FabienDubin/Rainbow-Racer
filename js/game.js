class Game {
  constructor() {
    this.startScreen = document.querySelector("#welcome-screen");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameEndScreen = document.querySelector("#end-screen");
    this.player = new Player(
      this.gameScreen,
      2,
      50,
      6,
      8,
      "../assets/img/Unicorn-wings-up.png"
    );
    // Check if height and width in % are ok
    this.height = 100;
    this.width = 100;
    this.clouds = [];
    this.score = 0;
    this.lives = 0;
    this.gameIsOver = false;
    this.gameIntervalId;
    this.gameloopFrequency = Math.round(1000 / 60);
  }

  start() {
    // set the viewport of the game
    this.gameScreen.style.height = `${this.height}vh`;
    this.gameScreen.style.width = `${this.width}vw`;

    // hide the welcome screen
    this.startScreen.style.display = "none";
    // display the game screen
    this.gameScreen.style.display = "block";
    // run the game loop
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameloopFrequency);
  }

  gameLoop() {
    console.log("in game loop");
    this.update();

    //stops the loop if this.gameIsOver = true
    if (this.gameIsOver) {
      clearInterval(this.gameIntervalId);
    }
  }
  update() {
    console.log("in the update");

    //continous update of the player's position
    this.player.move();
  }
}
