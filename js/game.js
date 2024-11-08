class Game {
  constructor() {
    //____DOM ELEMENTS-----///
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
    this.progressBarBGElement = document.querySelector("#progress");
    this.toastElement = document.querySelector("#toast");

    //---IN GAME OBJECTS------///
    this.player = new Player(this.gameScreen, 2, 50, 6, 8);
    this.height = 100;
    this.width = 100;
    this.clouds = [];
    this.cloudSpeedArray = [0.6, 0.9, 1.2];
    this.cloudSpeed = this.cloudSpeedArray[0];
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
    this.setTimer = 120;
    this.delay = 1000;
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
    //-----SOUNDS-----//
    this.music = new Audio("assets/sound/RainbowRaceTheme.mp3");
    this.music.volume = 0.1;
    this.music.loop = true;
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
    this.removeLive = new Audio("assets/sound/LiveDown.wav");
    this.removeLive.volume = 0.2;
    this.gameOver = new Audio("assets/sound/GameOver.mp3");
    this.gameOver.volume = 0.2;
    this.timesUp = new Audio("assets/sound/NoMoreTime.wav");
    this.timesUp.volume = 0.1;
    this.rainbowSound = new Audio("assets/sound/Rainbows.mp3");
    this.rainbowSound.volume = 0.2;
    this.notificationSound = new Audio("assets/sound/Notification.mp3");
    this.notificationSound.volume = 0.2;

    //------MESSAGE MGMT-------//
    this.toastOffStatus = false;
    this.toastArrowStatus = false;
    this.toastSpaceStatus = false;
    this.toastRainbowStatus = false;
    this.toastPoopStatus = false;
    this.toastDisplay = false;
  }

  //-----METHODS-----//
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

    // // show toast Arrows
    // if (!this.toastArrowStatus) {
    //   setTimeout(() => {
    //     this.showToast("arrow");
    //   }, 500);
    // }

    //stops the loop if this.gameIsOver = true
    if (this.gameIsOver) {
      clearInterval(this.gameIntervalId);
    }

    //🌩️ generating clouds 🌩️
    if (this.remainingTime > this.setTimer * 3) {
      if (this.frames % 60 === 0) {
        this.clouds.push(new Cloud(this.gameScreen));
        this.cloudSpeed = this.cloudSpeedArray[2];
        console.log("####################HIGH CLOUD SPEED###################");
      }
    } else if (this.remainingTime > this.setTimer * 2) {
      if (this.frames % 60 === 0) {
        console.log("new cloud");
        this.clouds.push(new Cloud(this.gameScreen));
        this.cloudSpeed = this.cloudSpeedArray[1];
      }
    } else {
      if (this.frames % 90 === 0) {
        console.log("new cloud");
        this.clouds.push(new Cloud(this.gameScreen));
        this.cloudSpeed = this.cloudSpeedArray[0];
        //show Space Toast on first cloud
        if (!this.toastSpaceStatus) {
          setTimeout(() => {
            this.showToast("space");
          }, 3000);
        }
      }
    }

    //🎈 generating balls 🎈
    if (this.frames % 60 === 0) {
      this.balls.push(new Ball(this.gameScreen));
    }

    //🌈 generating rainbows 🌈CHANGE VALUE TO 1800
    if (this.frames % 700 === 0) {
      this.rainbows.push(new Rainbow(this.gameScreen));
      //show Space Toast on first cloud
    }
  }

  update() {
    //continous update of the player's position
    this.player.move();

    ////🌩️---------CLOUDS----------------🌩️///
    //Checking collision with a cloud if the wloud is on screen
    this.clouds.forEach((oneCloud, oneCloudIndex) => {
      oneCloud.move(this.cloudSpeed);

      if (this.player.didCollide(oneCloud)) {
        //Remove cloud from the DOM
        oneCloud.element.remove();
        this.clouds.splice(oneCloudIndex, 1);
        this.lives--;
        this.updateLives(-1);

        //Reduce timer if remaing time is > the setTimer
        if (this.remainingTime > this.setTimer) {
          this.remainingTime = this.setTimer;
          // Reduce timer delay
          this.delay -= 300;
          this.updateCountdown();
        }

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
        //Play sound
        this.getBall.play();

        //Adds points to the score
        this.score += oneBall.points;
        this.scoreElement.innerText = this.score;

        //Adds time to remainingTime
        this.remainingTime += 15;
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
        //Play Sound
        this.rainbowSound.play();
        //Adjust the countdown delay
        if (this.delay < 1000) {
          this.delay = 1000;
        }

        //Rainbow Toast
        if (!this.toastRainbowStatus) this.showToast("rainbow");

        //Increment in the poop counter
        this.rainbowCounter++;
        if (this.rainbowCounter === 3) {
          this.poop++;
          this.getPoop.play();
          this.updatePoops(1);
          this;
          this.rainbowCounter = 0;
          setTimeout(() => {
            if (!this.toastPoopStatus) this.showToast("poop");
          }, 2000);
        }

        // //Add one extra live
        // this.lives++;
        // this.updateLives(1);

        //Full fill remainingTime and more...
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

    ///⭐️----------SHOOTING STARS----------------⭐️//
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
          //Play sound
          this.cloudPop.play();
          //Adds time to remainingTime depending on the cloud speed
          if (this.cloudSpeed === this.cloudSpeedArray[2]) {
            this.remainingTime += 45;
            this.updateCountdown();
            //Add extra points
            this.score += oneStar.points;
            this.scoreElement.innerText = this.score;
          } else if (this.cloudSpeed === this.cloudSpeedArray[1]) {
            this.remainingTime += 30;
            this.updateCountdown();
          } else this.remainingTime += 20;
          this.updateCountdown();
        }
      });
    });

    //💩--------------POOP------------------💩//
    this.poops.forEach((onePoop, onePoopIndex) => {
      onePoop.move();
      this.changeBackground("poop", 100, 5);
      this.updatePoops(-1);
      //Full fill remainingTime
      this.remainingTime += this.setTimer;
      this.updateCountdown();
      this.clouds.forEach((oneCloud, oneCloudIndex) => {
        //XXXX Stop the cloud
        oneCloud.move(0);
        oneCloud;
        console.log(this.clouds);
        console.log(this.clouds.length);
        //Remove all the clouds
        this.clouds.splice(oneCloudIndex, 1);
        oneCloud.element.remove();
        //Play sound
        this.cloudPop.play();
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
      if (this.poop > 0) {
        this.poop--;
        this.updatePoops(-1);
        this.remainingTime += this.setTimer;
      } else {
        this.lives--;
        this.updateLives(-1);
        this.remainingTime += this.setTimer * 2;
      }
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
        newLife.src = "assets/img/Life.png";
        newLife.alt = "live";

        this.livesElement.appendChild(newLife);
        //--Player blink and play sound---/
        this.player.element.classList.add("blink");
        this.removeLive.play();
        setTimeout(() => {
          this.player.element.classList.remove("blink");
        }, 1000);
      }
      //----If get an extra life---//
    } else if (arg === 1) {
      this.livesElement.innerHTML = "";
      for (let i = 0; i < this.lives; i++) {
        const newLife = document.createElement("img");
        newLife.src = "assets/img/Life.png";
        newLife.alt = "live";

        this.livesElement.appendChild(newLife);
        //--Live blink and play sound---/
        this.livesElement.classList.add("blink");
        this.getLife.play();
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
        const newPoop = document.createElement("img");
        newPoop.src = "assets/img/Poop.png";
        newPoop.alt = "poop";
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
        newPoop.src = "assets/img/Poop.png";
        newPoop.alt = "poop";

        this.poopsElement.appendChild(newPoop);
        //--Backgroung blink---/
        this.changeBackground("poop", 100, 9);
      }
    } else {
      console.log("!!!!!!!!!!!Argument not set");
    }
  }

  //⏱️---Countdown and progressBar----⏱️//
  updateCountdown() {
    //--Check if interval is running when update
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.remainingTime--;
      // this.timerElement.innerHTML = this.remainingTime;
      let remaininTimeCoef = (this.remainingTime / this.setTimer) * 100;

      this.progressBarElement.style.width = `${remaininTimeCoef}%`;
      if (this.remainingTime > 30) {
        this.music.play;
        this.timesUp.pause();
        this.progressBarElement.classList.remove("blink");
        this.progressBarBGElement.classList.remove("blink");
        this.progressBarElement.style.setProperty(
          "background",
          `var(${this.backgroundColorArray[this.progressBarColorIndex]}`
        );
      } else if (this.remainingTime < 30 && this.remainingTime > 0) {
        this.progressBarElement.classList.add("blink");
        this.progressBarBGElement.classList.add("blink");
        this.progressBarElement.style.setProperty("background", `red`);
        this.music.pause();
        this.timesUp.play();
      } else if (this.remainingTime === 0) {
        clearInterval(this.timer);
        this.timesUp.pause();
        this.music.play();
      }
    }, this.delay);
  }

  //🎇--------Change Background color------🎇//
  //-Dependiing on the game event (rainbow, poop), -----//
  //-speed of the change and number of loop iterations -//
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

  //🎉-----Add point on game event----🎉//
  addPoints(pts) {
    this.score += pts;
    this.scoreElement.innerHTML = this.score;
  }
  //🥪---Display toast to help the player--🥪//
  showToast(msg) {
    if (this.toastOffStatus) return;

    // //Check if a toast is already displayed
    // if (this.toastElement.firstChild) {
    //   this.toastElement.removeChild(this.toastElement.firstChild);
    // }

    const newToast = document.createElement("img");
    switch (msg) {
      case "arrow":
        if (this.toastArrowStatus) return;
        newToast.src = "assets/img/arrowToast.png";
        newToast.alt = "Arrows";
        this.toastArrowStatus = true;
        break;
      case "space":
        if (this.toastSpaceStatus) return;
        newToast.src = "assets/img/spaceToast.png";
        newToast.alt = "rainbow";
        this.toastSpaceStatus = true;
        break;
      case "rainbow":
        if (this.toastRainbowStatus) return;
        console.log("ask for rainbow");
        newToast.src = "assets/img/rainbowToast.png";
        newToast.alt = "rainbow";
        this.toastRainbowStatus = true;
        break;
      case "poop":
        if (this.toastPoopStatus) return;
        newToast.src = "assets/img/poopToast.png";
        newToast.alt = "Poop";
        this.toastPoopStatus = true;
        break;
    }
    this.toastElement.appendChild(newToast);
    this.toastElement.style.visibility = "visible";
    this.notificationSound.play();
    setTimeout(() => {
      this.toastElement.style.visibility = "hidden";
      this.toastElement.removeChild(newToast);
      // this.toastDisplay = false;
    }, 5000);
  }

  //💀----Ending game when lives = 0---💀/
  endGame() {
    // removes the player from the game screen
    this.player.element.remove();
    // removes the clouds from the game screen
    this.clouds.forEach((cloud) => {
      cloud.element.remove();
    });

    //Stops the countdown
    this.remainingTime = 1;
    this.updateCountdown();

    //Play Sound
    this.gameOver.play();
    //set gameIsOver to true
    this.gameIsOver = true;
    //Ends the music =
    this.music.loop = false;

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
