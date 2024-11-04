class Player {
  constructor(gameScreen, left, top, width, height, playerImage) {
    this.gameScreen = gameScreen;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.directionX = 0;
    this.directionY = 0;
    this.element = document.createElement("img");

    // src to be updated to have animated wings
    // !!!!!!!!!! POSSIBLE BUG ON POSITIONING DUE TO VH VW
    this.element.src = playerImage;
    this.element.style.position = "absolute";
    this.element.style.left = `${left}vw`;
    this.element.style.top = `${top}vh`;
    this.element.style.width = `${width}vw`;
    this.element.style.height = `${height}vh`;

    this.gameScreen.appendChild(this.element);
  }

  //methods
  move() {
    // update player's position when move
    this.directionX += this.left;
    this.directionY += this.top;

    // Setting boundaries to the border of the screen
    // Horizontally
    // Left side
    if (this.left < 10) {
      this.left = 10;
    }
    //Right side
    if (this.left > this.gameScreen.offsetWidth - this.width - 10) {
      this.left = this.gameScreen.offsetWidth - this.width - 10;
    }

    //Vertically
    //top side
    if (this.top < 10) {
      this.top = 10;
    }
    //bottom side
    if (this.top > this.gameScreen.offsetWidth - this.height - 10) {
      this.top = this.gameScreen.offsetWidth - this.height - 10;
    }
  }
  // update player's position
  updatePosition() {
    this.element.style.left = `${left}vw`;
    this.element.style.top = `${top}vh`;
  }

  didCollide(obstacle) {
    const playerRect = this.element.getBoundingClientRect();
    const obstacleRect = obstacle.element.getBoundingClientRect();

    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      return true;
    } else {
      return false;
    }
  }
}
