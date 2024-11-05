class Component {
  constructor(width, height, ComponentImg) {
    this.left = 90;
    this.top = Math.floor(Math.random() * 100);
    this.width = width;
    this.height = height;
    this.element = document.createElement("img");

    this.element.src = ComponentImg;
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
    this.left -= 1;
    this.updatePosition();
  }
}
