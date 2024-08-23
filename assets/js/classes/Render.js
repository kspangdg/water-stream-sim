/**
 * A class for rendering a sprite on the canvas.
 * 
 * @class Render
 * @param {object} position - The position of the sprite in X and Y coordinates
 * @param {object} size - The size of the sprite in width and height
 */

class Render {
    constructor({
      position = {x: 0, y: 0},
      size = {w: 0, h: 0},
      color = "black",
      shape = "circle",
      text = "0m",
    }) {
      this.position = position;
      this.size = size;
      this.gravity = 0.1;
      this.velocity = 0;
      this.resistance = 0.1;
      this.color = color;
      this.shape = shape;
      this.text = text;
    }
    draw() {
         if (this.shape !== "text") {
          _Window.context.beginPath();
          _Window.context.fillStyle = this.color; 
 
          //circle
          if (this.shape === "circle") {
           _Window.context.arc(this.position.x, this.position.y, this.size.w, 0, 2 * Math.PI);
           _Window.context.fill();
          } else if (this.shape === "rectangle") {
           //rectangle
           _Window.context.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
          }
         } else {
          _Window.context.font = this.size.w + " " + this.size.h;
          _Window.context.fillText(this.text, this.position.x, this.position.y);
         }
    }
    update() {
      this.draw()
    }
  }