class Cloud {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.height = 15;
    this.width = 20;
    this.left = 180;
    this.top = Math.floor(Math.random() * 100);
    this.sizeCoef = Math.ceil(Math.random() * 3);
    this.element = document.createElement("img");

    this.element.src = "assets/img/NaughtyCloud.png";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width * this.sizeCoef}vw`;
    this.element.style.height = `${this.height * this.sizeCoef}vh`;
    this.element.style.left = `${this.left}vw`;
    this.element.style.top = `${this.top}vh`;

    this.gameScreen.appendChild(this.element);

    this.speedArr = [
      0.5, 0.3, 0.7, 1.5, 0.5, 0.3, 0.4, 1, 0.5, 0.5, 0.5, 0.3, 0.1, 0.5, 1,
      0.7, 0.8, 0.9,
    ];
    this.speedArrIndex = Math.ceil(Math.random() * this.speedArr.length - 1);
  }

  // Update component position
  updatePosition() {
    this.element.style.left = `${this.left}vw`;
    this.element.style.top = `${this.top}vh`;
  }

  // move the component from right to left
  move(speedCoef) {
    this.left -= this.speedArr[this.speedArrIndex] * speedCoef;
    this.updatePosition();
  }
}
