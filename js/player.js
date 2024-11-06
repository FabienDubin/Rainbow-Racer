class Player {
  constructor(gameScreen, left, top, width, height) {
    this.gameScreen = gameScreen;
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.directionX = 0;
    this.directionY = 0;
    this.playerImg = [
      "assets/img/Unicorn-wings-up.png",
      "assets/img/Unicorn-wings-middle.png",
      "assets/img/Unicorn-wings-down.png",
    ];
    this.currentPlayerImgIndex = 0;
    this.element = document.createElement("img");

    // src to be updated to have animated wings
    // !!!!!!!!!! POSSIBLE BUG ON POSITIONING DUE TO VH VW
    this.element.src = this.playerImg[this.currentPlayerImgIndex];
    this.element.style.position = "absolute";
    this.element.style.left = `${left}vw`;
    this.element.style.top = `${top}vh`;
    this.element.style.width = `${width}vw`;
    this.element.style.height = `${height}vh`;

    this.gameScreen.appendChild(this.element);

    this.flappingWings();
  }

  //methods
  move() {
    // update player's position when move
    this.left += this.directionX;
    this.top += this.directionY;

    // Setting boundaries to the border of the screen
    // Horizontally
    // Left side
    if (this.left < -5) {
      this.left = -5;
    }
    //Right side
    if (this.left > 95) {
      this.left = 95;
    }

    //Vertically
    //top side
    if (this.top < 0) {
      this.top = 0;
    }
    //bottom side
    if (this.top > 97) {
      this.top = 97;
    }

    this.updatePosition();
  }
  // update player's position
  updatePosition() {
    this.element.style.left = `${this.left}vw`;
    this.element.style.top = `${this.top}vh`;
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

  flappingWings() {
    setInterval(() => {
      if (this.currentPlayerImgIndex === this.playerImg.length - 1) {
        this.currentPlayerImgIndex = 0;
        this.element.src = this.playerImg[this.currentPlayerImgIndex];
      } else {
        this.currentPlayerImgIndex++;
        this.element.src = this.playerImg[this.currentPlayerImgIndex];
      }
    }, 200);
  }
}
