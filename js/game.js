class Game {
  constructor() {
    this.startScreen = document.querySelector("#welcome-screen");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameEndScreen = document.querySelector("#end-screen");
    this.scoreElement = document.querySelector("#score");
    this.finalScoreElement = document.querySelector("#final-score");
    this.livesElement = document.querySelector("#lives");
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
    this.lives = 3;
    this.gameIsOver = false;
    this.gameIntervalId;
    this.gameloopFrequency = Math.round(1000 / 60);
    this.frames = 0;
  }

  start() {
    // set the viewport of the game
    this.gameScreen.style.height = `${this.height}vh`;
    this.gameScreen.style.width = `${this.width}vw`;

    // hide the welcome screen
    this.startScreen.style.display = "none";
    // display the game screen
    this.gameScreen.style.display = "block";
    //Create the lives
    this.updateLives();
    // run the game loop
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameloopFrequency);
  }

  gameLoop() {
    // console.log("in game loop");
    this.frames++;
    this.update();

    //stops the loop if this.gameIsOver = true
    if (this.gameIsOver) {
      clearInterval(this.gameIntervalId);
    }

    //generating clouds
    if (this.frames % 100 === 0) {
      this.clouds.push(new Cloud(this.gameScreen));
    }
  }
  update() {
    // console.log("in the update");

    //continous update of the player's position
    this.player.move();

    ////---------CLOUDS-----------------///
    //Checking collision with a cloud if the wloud is on screen
    this.clouds.forEach((oneCloud, oneCloudIndex) => {
      oneCloud.move();

      if (this.player.didCollide(oneCloud)) {
        //Remove cloud from the DOM
        oneCloud.element.remove();
        this.clouds.splice(oneCloudIndex, 1);
        this.lives--;
        this.updateLives();
        // LOOK FOR UDATING THE DOM !!!!

        // if the cloud did not collide
      } else if (oneCloud.left < -100) {
        oneCloud.element.remove();
        this.clouds.splice(oneCloudIndex, 1);
        // TO BE REMOVED WHEN Ball are implemented
        this.score++;
        console.log(this.score);
        this.scoreElement.innerText = this.score;
      }
    });

    //Ending game if no more lives
    if (this.lives === 0) {
      this.endGame();
    }
  }

  updateLives() {
    this.livesElement.innerHTML = "";
    for (let i = 0; i < this.lives; i++) {
      const newLife = document.createElement("img");
      newLife.src = "../Assets/img/Life.png";
      newLife.alt = "live";

      this.livesElement.appendChild(newLife);
    }
  }

  //Ending game when lives = 0
  endGame() {
    // removes the player from the game screen
    this.player.element.remove();
    // removes the clouds from the game screen
    this.clouds.forEach((cloud) => {
      cloud.element.remove();
    });

    //set gameIsOver to true
    this.gameIsOver = true;

    // Displays player's score
    this.finalScoreElement.innerText = this.score;
    console.log(this.score);

    // hidez the game screen
    this.gameScreen.style.display = "none";
    // displays the end screen
    this.gameEndScreen.style.display = "flex";
  }
}
