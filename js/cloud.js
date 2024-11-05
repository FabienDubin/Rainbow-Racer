class Cloud {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.height = 25;
    this.width = 30;
    this.left = 90;
    this.top = Math.floor(Math.random() * 100);

    this.element = document.createElement("img");

    this.element.src = "../assets/img/NaughtyCloud.png";
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
    this.left -= 0.5;
    this.updatePosition();
  }
}
