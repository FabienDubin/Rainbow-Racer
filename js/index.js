window.onload = function () {
  const startButton = document.getElementById("start-btn");
  const restartButton = document.getElementById("restart-btn");
  let game;

  startButton.addEventListener("click", function () {
    startGame();
  });

  function startGame() {
    console.log("start game");
    // create the new game
    game = new Game();
    // starts the new game (via method )
    game.start();
  }
};
