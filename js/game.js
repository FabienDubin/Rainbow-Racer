class Game {
  constructor() {
    this.startScreen = document.querySelector("#welcome-screen");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameEndScreen = document.querySelector("#end-screen");
    this.scoreElement = document.querySelector("#score");
    this.finalScoreElement = document.querySelector("#final-score");
    this.livesElement = document.querySelector("#lives");
    this.poopsElement = document.querySelector("#poops");
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
    this.rainbowCounter = 0;
    this.stars = [];
    this.score = 0;
    this.highScore = localStorage.getItem("highScore");
    this.lives = 3;
    this.poops = [];
    this.poop = 0;
    this.timer = null;
    this.setTimer = 90;
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
    this.progressBarColorIndex = this.backgroundColorIndex + 1;

    this.music = new Audio("assets/sound/RainbowRaceTheme.mp3");
    this.music.volume = 0.1;
    this.cloudPop = new Audio("assets/sound/Cloud.wav");
    this.cloudPop.volume = 0.2;
    this.poopPush = new Audio("assets/sound/DropPoop.wav");
    this.poopPush.volume = 0.2;
    this.getBall = new Audio("assets/sound/getBall.wav");
    this.getBall.volume = 0.2;
    this.getPoop = new Audio("assets/sound/GotPoop.wav");
    this.getPoop.volume = 0.2;
    this.getLife = new Audio("assets/sound/LifeUp.wav");
    this.getLife.volume = 0.2;
    this.shootStar = new Audio("assets/sound/StarShoot.wav");
    this.shootStar.volume = 0.2;
    this.flappingWings = new Audio("assets/sound/Flapping.wav");
    this.shootStar.volume = 0.2;
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
    this.updatePoops(1);
    //Create the countdown
    this.updateCountdown();

    //🎵----Music---- //
    this.music.play();

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
    if (this.frames % 90 === 0) {
      this.clouds.push(new Cloud(this.gameScreen));
    }

    //🎈 generating balls 🎈
    if (this.frames % 120 === 0) {
      this.balls.push(new Ball(this.gameScreen));
    }

    //🌈 generating rainbows 🌈CHANGE VALUE TO 1800
    if (this.frames % 500 === 0) {
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
      oneCloud.move(0.5);

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

        //Increment in the poop counter
        this.rainbowCounter++;
        if (this.rainbowCounter === 3) {
          this.poop++;
          console.log("poop++", this.poop);
          this.updatePoops(1);
          this.rainbowCounter = 0;
        }

        // //Add one extra live
        // this.lives++;
        // this.updateLives(1);

        //Full fill remainingTime
        this.remainingTime += this.setTimer;
        this.updateCountdown();

        //Adds points to the score
        this.score += oneRainbow.points;
        this.scoreElement.innerText = this.score;

        //looping over the background colors animation
        console.log("before the loop");
        this.changeBackground("rainbow", 100, 9);

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

    //💩--------------POOP------------------💩//
    this.poops.forEach((onePoop, onePoopIndex) => {
      onePoop.move();
      this.updatePoops(-1);
      //Full fill remainingTime
      this.remainingTime = this.setTimer * 2;
      this.clouds.forEach((oneCloud, oneCloudIndex) => {
        //XXXX Stop the cloud
        oneCloud.move(0);
        oneCloud;
        console.log(this.clouds);
        console.log(this.clouds.length);
        //Remove all the clouds
        this.clouds.splice(oneCloudIndex, 1);
        oneCloud.element.remove();
      });
      // Remove the poop from the array and the DOM

      if (onePoop.top > 85) {
        onePoop.element.classList.add("hidden");
        this.poops.splice(onePoopIndex, 1);
        onePoop.element.remove();
        //Add 0ne live
        this.lives++;
        this.updateLives(1);
        this.updateCountdown();
        //Add points and update the DOM score element
        this.score += onePoop.points;
        this.scoreElement.innerText = this.score;
      }
    });

    //🔥--------------HIGHSCORE------------🔥//
    //Display HighScore if it exists
    this.highScoreElement.innerText = this.highScore;

    if (this.highScore < this.score) {
      this.highScore = this.score;
    }

    //💔-------Remove a life when remaingtime = 0-------💔//
    if (this.remainingTime === 0) {
      if (this.poop < 0) {
        this.poop--;
        this.updatePoops(-1);
        this.remainingTime += 20;
      }

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

  //🆙---Update lives depending on argument (1 or -1)--🆙//
  updateLives(arg) {
    //----If loose a live---//
    if (arg === -1) {
      this.livesElement.innerHTML = "";
      for (let i = 0; i < this.lives; i++) {
        const newLife = document.createElement("img");
        newLife.src = "Assets/img/Life.png";
        newLife.alt = "live";

        this.livesElement.appendChild(newLife);
        //--Player blink---/
        this.player.element.classList.add("blink");
        setTimeout(() => {
          this.player.element.classList.remove("blink");
        }, 1000);
      }
      //----If get an extra life---//
    } else if (arg === 1) {
      this.livesElement.innerHTML = "";
      for (let i = 0; i < this.lives; i++) {
        const newLife = document.createElement("img");
        newLife.src = "Assets/img/Life.png";
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

  //🆙---Update poops bonus depending on argument (1 or -1)--🆙//
  updatePoops(arg) {
    //----If player drop a poop---//
    if (arg === -1) {
      this.poopsElement.innerHTML = "";
      for (let i = 0; i < this.poop; i++) {
        const newLife = document.createElement("img");
        newLife.src = "Assets/img/Poop.png";
        newLife.alt = "poop";
        this.poopsElement.appendChild(newPoop);
        //--Player blink---/
        this.changeBackground("poop", 100, 15);
      }
      //----If player gets a poop---//
    } else if (arg === 1) {
      // console.log("get new poop in updatePoop!", this.poop);
      this.poopsElement.innerHTML = "";
      for (let i = 0; i < this.poop; i++) {
        const newPoop = document.createElement("img");
        newPoop.src = "Assets/img/Poop.png";
        newPoop.alt = "poop";

        this.poopsElement.appendChild(newPoop);
        //--Backgroung blink---/
        this.changeBackground("poop", 100, 9);
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
  changeBackground(arg, speed, times) {
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

        if (this.progressBarColorIndex < this.backgroundColorArray.length - 1) {
          this.progressBarColorIndex++;
        } else {
          this.progressBarColorIndex = 0;
        }

        this.progressBarElement.style.setProperty(
          "background",
          `var(${this.backgroundColorArray[this.progressBarColorIndex]}`
        );
        break;

      //Bonus as argument
      case "poop":
        let index = 0;
        const colorLoop = setInterval(() => {
          //-- Changing the background color
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

          //-- Changing the progress bar color
          if (
            this.progressBarColorIndex <
            this.backgroundColorArray.length - 1
          ) {
            this.progressBarColorIndex++;
          } else {
            this.progressBarColorIndex = 0;
          }

          this.progressBarElement.style.setProperty(
            "background",
            `var(${this.backgroundColorArray[this.progressBarColorIndex]}`
          );
          index++;

          // stopping the colorLoop
          if (index === times) clearInterval(colorLoop);
        }, speed);
    }
  }

  //addPoints
  addPoints(pts) {
    this.score += pts;
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
