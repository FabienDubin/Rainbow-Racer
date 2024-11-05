window.onload = function () {
  const startButton = document.getElementById("start-btn");
  const restartButton = document.getElementById("restart-btn");
  let myGame;

  startButton.addEventListener("click", function () {
    startGame();
  });

  function startGame() {
    console.log("start game");
    // create the new game
    myGame = new Game();
    // starts the new game (via method )
    myGame.start();
    console.log(myGame);
  }

  //Keyboard listening to control the player
  //When a key is pressed
  document.addEventListener("keydown", (event) => {
    console.log("key pressed!", event.code);

    switch (event.code) {
      case "ArrowUp":
        myGame.player.directionY = -1;
        break;
      case "ArrowDown":
        myGame.player.directionY = 1;
        break;
      case "ArrowLeft":
        myGame.player.directionX = -1;
        console.log(myGame.player.left);
        break;
      case "ArrowRight":
        myGame.player.directionX = 1;
        break;

      // !!!!Extra features!!!!
      //   case "Space" :
      //   case "KeyP" :
    }
  });

  //When a key is released
  document.addEventListener("keyup", (event) => {
    console.log("key released!", event.code);
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

    // !!!!Extra features!!!!
    //   case "Space" :
    //   case "KeyP" :
  });
};
