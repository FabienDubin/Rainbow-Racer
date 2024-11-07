class Poop {
  constructor(positionX, positionY) {
    this.gameScreen = document.querySelector("#game-screen");
    this.height = 7;
    this.width = 5;
    this.left = positionX;
    this.top = positionY;
    this.points = 100;
    this.element = document.createElement("img");

    this.element.src = "assets/img/Poop.png";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}vw`;
    this.element.style.height = `${this.height}vh`;
    this.element.style.left = `${this.left}vw`;
    this.element.style.top = `${this.top}vh`;

    this.gameScreen.appendChild(this.element);
  }

  // Update component position
  updatePosition() {
    this.element.style.top = `${this.top}vh`;
  }

  // move the component from right to left
  move() {
    this.top += 1;
    this.updatePosition();
  }
}
