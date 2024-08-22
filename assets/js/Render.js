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
    }) {
      this.position = position;
      this.size = size;
    }
    draw() {
         _Window.context.beginPath();
         _Window.context.fillStyle = "blue"; 
         _Window.context.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
    }
    update() {
      this.draw()
    }
  }