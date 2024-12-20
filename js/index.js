window.onload = function () {
  const startButton = document.getElementById("start-btn");
  const restartButton = document.getElementById("restart-btn");
  let myGame;

  //start button on startScreen
  startButton.addEventListener("click", function () {
    startGame();
  });

  //restart button on endScreen
  restartButton.addEventListener("click", function () {
    window.location.reload();
  });

  function startGame() {
    console.log("start game");
    // create the new game
    myGame = new Game();
    // starts the new game (via method )

    myGame.start();
    // console.log(myGame);
  }

  //Keyboard listening to control the player
  //When a key is pressed
  document.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "ArrowUp":
        myGame.player.directionY = -1;
        myGame.player.flappingSound.play();

        break;
      case "ArrowDown":
        myGame.player.directionY = 1;
        myGame.player.flappingSound.play();

        break;
      case "ArrowLeft":
        myGame.player.directionX = -1;
        myGame.player.flappingSound.play();
        break;
      case "ArrowRight":
        myGame.player.directionX = 1;
        myGame.player.flappingSound.play();
        break;

      case "Space":
        if (myGame.score > 5) {
          const starLeft = myGame.player.left + 6;
          const starTop = myGame.player.top + 2;
          myGame.stars.push(new Star(starLeft, starTop));
          myGame.addPoints(-5);
          myGame.shootStar.play();
        }
        break;
      case "KeyP":
        if (myGame.poop > 0) {
          myGame.poopPush.play();
          myGame.poop--;
          // const starLeft = myGame.player.left - 6;
          // const starTop = myGame.player.top + 3;
          myGame.poops.push(new Poop(50, 0));
          myGame.addPoints(100);
          myGame.poopPush.addEventListener("ended", (event) => {
            // myGame.music.play();
          });
        }
        break;
    }
  });

  //When a key is released
  document.addEventListener("keyup", (event) => {
    // console.log("key released!", event.code);
    switch (event.code) {
      case "ArrowUp":
      case "ArrowDown":
        myGame.player.directionY = 0;
        break;

      case "ArrowLeft":
      case "ArrowRight":
        myGame.player.directionX = 0;
        break;
    }
  });
};
