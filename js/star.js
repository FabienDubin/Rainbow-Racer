class Star {
  constructor(positionX, positionY) {
    this.gameScreen = document.querySelector("#game-screen");
    this.height = 2;
    this.width = 1;
    this.left = positionX;
    this.top = positionY;
    this.imgArray = [
      "../assets/img/StarGreen.png",
      "../assets/img/StarYellow.png",
      "../assets/img/StarPurple.png",
      "../assets/img/StarPink.png",
    ];
    this.randomImgIndex = Math.floor(Math.random() * this.imgArray.length);
    this.points = 25;
    this.element = document.createElement("img");

    this.element.src = this.imgArray[this.randomImgIndex];
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}vw`;
    this.element.style.height = `${this.height}vh`;
    this.element.style.left = `${this.left}vw`;
    this.element.style.top = `${this.top}vh`;

    this.gameScreen.appendChild(this.element);
  }

  // Update component position
  updatePosition() {
    this.element.style.left = `${this.left}vw`;
  }

  // move the component from right to left
  move() {
    this.left += 1;
    this.updatePosition();
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
