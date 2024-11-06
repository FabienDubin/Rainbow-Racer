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
    this.timerElement = document.querySelector("#timer");
    this.progressBarElement = document.querySelector("#progressBar");

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
    this.timer = null;
    this.setTimer = 100;
    this.remainingTime = this.setTimer;
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
    this.backgroundInterval = 0;
  }

  start() {
    // set the viewport of the game
    this.gameScreen.style.height = `${this.height}vh`;
    this.gameScreen.style.width = `${this.width}vw`;

    // hide the welcome screen
    this.startScreen.style.display = "none";
    // display the game screen
    this.gameScreen.style.display = "flex";
    //Create the lives
    this.updateLives(1);
    //Create the countdown
    this.updateCountdown();

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

    //🌩️ generating clouds 🌩️
    if (this.frames % 100 === 0) {
      this.clouds.push(new Cloud(this.gameScreen));
    }

    //🎈 generating balls 🎈
    if (this.frames % 180 === 0) {
      this.balls.push(new Ball(this.gameScreen));
    }

    //🌈 generating rainbows 🌈CHANGE VALUE TO 1800
    if (this.frames % 400 === 0) {
      this.rainbows.push(new Rainbow(this.gameScreen));
    }
  }

  update() {
    // console.log("in the update");

    //continous update of the player's position
    this.player.move();

    ////🌩️---------CLOUDS----------------🌩️///
    //Checking collision with a cloud if the wloud is on screen
    this.clouds.forEach((oneCloud, oneCloudIndex) => {
      oneCloud.move();

      if (this.player.didCollide(oneCloud)) {
        //Remove cloud from the DOM
        oneCloud.element.remove();
        this.clouds.splice(oneCloudIndex, 1);
        this.lives--;
        this.updateLives(-1);

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

    ///🎈----------BALLS----------------🎈//
    this.balls.forEach((oneBall, oneBallIndex) => {
      oneBall.move();

      if (this.player.didCollide(oneBall)) {
        //Remove ball from the DOM
        oneBall.element.remove();
        this.balls.splice(oneBallIndex, 1);

        //Adds points to the score
        this.score += oneBall.points;
        this.scoreElement.innerText = this.score;

        //Adds time to remainingTime
        this.remainingTime += 10;
        this.updateCountdown();

        // if the ball did not collide
      } else if (oneBall.left < -5) {
        oneBall.element.remove();
        this.balls.splice(oneBallIndex, 1);
      }
    });

    ///🌈----------RAINBOWS----------------🌈//
    this.rainbows.forEach((oneRainbow, oneRainbowIndex) => {
      oneRainbow.move();

      if (this.player.didCollide(oneRainbow)) {
        //Remove rainbow from the DOM
        oneRainbow.element.remove();
        this.rainbows.splice(oneRainbowIndex, 1);

        // //Add one extra live
        // this.lives++;
        // this.updateLives(1);

        //Full fill remainingTime
        this.remainingTime = this.setTimer;
        this.updateCountdown();

        //Adds points to the score
        this.score += oneRainbow.points;
        this.scoreElement.innerText = this.score;

        //looping over the background colors animation
        console.log("before the loop");
        this.changeBackground("rainbow");

        // if the rainbow did not collide
      } else if (oneRainbow.left < -5) {
        oneRainbow.element.remove();
        this.rainbows.splice(oneRainbowIndex, 1);
      }
    });

    ///⭐️----------STARS----------------⭐️//
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
          //Adds time to remainingTime
          this.remainingTime += 15;
          this.updateCountdown();
        }
      });
    });

    //🔥--------------HIGHSCORE------------🔥//
    //Display HighScore if it exists
    this.highScoreElement.innerText = this.highScore;

    if (this.highScore < this.score) {
      this.highScore = this.score;
    }

    //💔-------Remove a life when remaingtime = 0-------💔//
    if (this.remainingTime === 0) {
      this.lives--;
      this.updateLives(-1);
      this.remainingTime += 10;

      this.updateCountdown();
    }

    //💀----Ending game if no more lives-----💀//
    if (this.lives === 0) {
      this.endGame();
    }
  }

  //🆙---Update lives depending on argument (1 or -1)--//
  updateLives(arg) {
    //----If loose a live---//
    if (arg === -1) {
      this.livesElement.innerHTML = "";
      for (let i = 0; i < this.lives; i++) {
        const newLife = document.createElement("img");
        newLife.src = "../Assets/img/Life.png";
        newLife.alt = "live";

        this.livesElement.appendChild(newLife);
        //--Player blink---/
        this.player.element.classList.add("blink");
        setTimeout(() => {
          this.player.element.classList.remove("blink");
        }, 1000);
      }
      //----If get an extro life---//
    } else if (arg === 1) {
      this.livesElement.innerHTML = "";
      for (let i = 0; i < this.lives; i++) {
        const newLife = document.createElement("img");
        newLife.src = "../Assets/img/Life.png";
        newLife.alt = "live";

        this.livesElement.appendChild(newLife);
        //--Player blink---/
        this.livesElement.classList.add("blink");
        setTimeout(() => {
          // this.livesElement.element.classList.remove("blink");
          this.livesElement.classList.remove("blink");
        }, 1000);
      }
    } else {
      console.log("!!!!!!!!!!!Argument not set");
    }
  }

  updateCountdown() {
    this.timer = setInterval(() => {
      this.remainingTime--;
      // this.timerElement.innerHTML = this.remainingTime;
      let remaininTimeCoef = (this.remainingTime / this.setTimer) * 100;

      this.progressBarElement.style.width = `${remaininTimeCoef}%`;
      if (this.remainingTime === 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  //Change Background color
  changeBackground(arg) {
    switch (arg) {
      //Rainbows as argument
      case "rainbow":
        //-- Changing the background color
        if (this.backgroundColorIndex < this.backgroundColorArray.length - 1) {
          this.backgroundColorIndex++;
        } else {
          this.backgroundColorIndex = 0;
        }
        this.backgroundElement.style.setProperty(
          "background",
          `var(${this.backgroundColorArray[this.backgroundColorIndex]}`
        );
        //-- Changing the progress bar color
        let progressBarColorIndex = this.backgroundColorIndex + 1;
        if (progressBarColorIndex < this.backgroundColorArray - 1) {
        }
        ///------------------------------------------------------
        this.progressBarElement.style.setProperty(
          "background",
          `var(${this.backgroundColorArray[colorIndex]}`
        );
        console.log(
          "BGcolor = ",
          `var(${this.backgroundColorArray[this.backgroundColorIndex]}`
        );
        console.log(
          "ProgressBcolor = ",
          `var(${this.backgroundColorArray[colorIndex]}`
        );
        break;

      //Bonus as argument
      case "poop":
        let index = 0;
        const colorLoop = setInterval(() => {
          console.log("in the setInterval ");
          if (
            this.backgroundColorIndex <
            this.backgroundColorArray.length - 1
          ) {
            this.backgroundColorIndex++;
          } else {
            this.backgroundColorIndex = 0;
          }
          this.backgroundElement.style.setProperty(
            "background",
            `var(${this.backgroundColorArray[this.backgroundColorIndex]}`
          );
          index++;

          // stopping the colorLoop
          if (index === 9) clearInterval(colorLoop);
        }, 100);
        console.log("Out of the setInterval");
    }
  }

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
