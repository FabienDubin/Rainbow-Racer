class Ball {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.height = 3;
    this.width = 2;
    this.left = 100;
    this.top = Math.floor(Math.random() * 100);
    this.imgArray = [
      "assets/img/YellowBall.png",
      "assets/img/GreenBall.png",
      "assets/img/PurpleBall.png",
      "assets/img/PinkBall.png",
    ];
    this.randomImgIndex = Math.floor(Math.random() * this.imgArray.length);
    this.points = 10;
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
    this.element.style.top = `${this.top}vh`;
  }

  // move the component from right to left
  move() {
    this.left -= 0.3;
    this.updatePosition();
  }
}
