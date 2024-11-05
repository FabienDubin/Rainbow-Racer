class Rainbow {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.height = 5;
    this.width = 5;
    this.left = 100;
    this.top = Math.floor(Math.random() * 100);
    this.points = 50;
    this.element = document.createElement("img");

    this.element.src = "../assets/img/Rainbow.png";
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
    this.left -= 0.7;
    this.updatePosition();
  }
}
