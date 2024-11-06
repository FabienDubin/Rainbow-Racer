class Game {
  constructor() {
    this.startScreen = document.querySelector("#welcome-screen");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameEndScreen = document.querySelector("#end-screen");
    this.scoreElement = document.querySelector("#score");
    this.finalScoreElement = document.querySelector("#final-score");
    this.livesElement = document.querySelector("#lives");
    this.backgroundElement = document.querySelector("#background");
    this.highScoreElement = document.querySelector("#high-score");

    this.player = new Player(this.gameScreen, 2, 50, 6, 8);
    // Check if height and width in % are ok
    this.height = 100;
    this.width = 100;

    this.clouds = [];
    this.balls = [];
    this.rainbows = [];
    this.stars = [];
    this.score = 0;
    this.highScore = localStorage.getItem("highScore");
    this.lives = 3;
    this.remainingTime = 60;
    this.gameIsOver = false;
    this.gameIntervalId;
    this.gameloopFrequency = Math.round(1000 / 60);
    this.frames = 0;

    this.backgroundColorArray = [
      "--pinkGra",
      "--purpleGra",
      "--greenGra",
      "--yellow",
    ];
    this.backgroundColorIndex = 0;
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

    //generating clouds 🌩️
    if (this.frames % 100 === 0) {
      this.clouds.push(new Cloud(this.gameScreen));
    }

    //generating balls 🎈
    if (this.frames % 180 === 0) {
      this.balls.push(new Ball(this.gameScreen));
    }

    //generating rainbows 🌈 CHANGE VALUE TO 1800
    if (this.frames % 1000 === 0) {
      this.rainbows.push(new Rainbow(this.gameScreen));
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

        // Player blinks when collide cloud
        this.player.element.classList.add("blink");
        setTimeout(() => {
          this.player.element.classList.remove("blink");
        }, 1000);

        // if the cloud did not collide
      } else if (oneCloud.left < -100) {
        oneCloud.element.remove();
        this.clouds.splice(oneCloudIndex, 1);
        // TO BE REMOVED WHEN Balls are implemented
        // this.score++;
        // console.log(this.score);
        // this.scoreElement.innerText = this.score;
      }
    });

    ///----------BALLS----------------//
    this.balls.forEach((oneBall, oneBallIndex) => {
      oneBall.move();

      if (this.player.didCollide(oneBall)) {
        //Remove ball from the DOM
        oneBall.element.remove();
        this.balls.splice(oneBallIndex, 1);

        //Adds points to the score
        this.score += oneBall.points;
        this.scoreElement.innerText = this.score;

        // if the ball did not collide
      } else if (oneBall.left < -5) {
        oneBall.element.remove();
        this.balls.splice(oneBallIndex, 1);
      }
    });

    ///----------RAINBOWS----------------//
    this.rainbows.forEach((oneRainbow, oneRainbowIndex) => {
      oneRainbow.move();

      if (this.player.didCollide(oneRainbow)) {
        //Remove rainbow from the DOM
        oneRainbow.element.remove();
        this.rainbows.splice(oneRainbowIndex, 1);

        //Adds points to the score
        this.score += oneRainbow.points;
        this.scoreElement.innerText = this.score;

        //looping over the background colors
        if (this.backgroundColorIndex < this.backgroundColorArray.length - 1) {
          this.backgroundColorIndex++;
        } else {
          this.backgroundColorIndex = 0;
        }
        this.backgroundElement.style.setProperty(
          "background",
          `var(${this.backgroundColorArray[this.backgroundColorIndex]}`
        );

        // if the rainbow did not collide
      } else if (oneRainbow.left < -5) {
        oneRainbow.element.remove();
        this.rainbows.splice(oneRainbowIndex, 1);
      }
    });

    ///----------STARS----------------//
    this.stars.forEach((oneStar, oneStarIndex) => {
      oneStar.move();
      this.clouds.forEach((oneCloud, oneCloudIndex) => {
        // If a star hit a cloud
        if (oneStar.didCollide(oneCloud)) {
          //Add points and update the DOM score element
          this.score += oneStar.points;
          this.scoreElement.innerText = this.score;
          // Remove the star from the DOM and the array of stars
          this.stars.splice(oneStarIndex, 1);
          oneStar.element.remove();
          // Remove the cloud from the DOM and the array of clouds
          this.clouds.splice(oneCloudIndex, 1);
          oneCloud.element.remove();
        }
      });
    });

    //--------------HIGHSCORE-------------//
    //Display HighScore if it exists
    this.highScoreElement.innerText = this.highScore;

    if (this.highScore < this.score) {
      this.highScore = this.score;
    }

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

  countdown() {}

  //Remove 5 points when shoot a star
  removePoint() {
    this.score -= 5;
    this.scoreElement.innerHTML = this.score;
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
    // console.log(this.score);

    // hidez the game screen
    this.gameScreen.style.display = "none";
    // displays the end screen
    this.gameEndScreen.style.display = "flex";

    //Storing high score
    this.highScore = localStorage.getItem("highScore");
    console.log("get ls hs", this.highScore);
    if (this.highScore) {
      // conditional if score is high than the previous
      if (this.highScore < this.score) {
        this.highScore = this.score;
        localStorage.setItem("highScore", this.score);
        console.log("new high score");
      }
    } else {
      localStorage.setItem("highScore", this.score);
    }
    console.log("highScore a the end", this.highScore);
  }
}
