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
  }

  // Update component position
  updatePosition() {
    this.element.style.left = `${this.left}vw`;
    this.element.style.top = `${this.top}vh`;
  }

  // move the component from right to left
  move(speed) {
    this.left -= speed;
    this.updatePosition();
  }
}
