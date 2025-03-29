/**
 * Configures canvas and basic meta.
 *
 * @class Window
 * @param {dom element} canvas - Create or point to canvas element (e.g. document.createElement("canvas"))
 * @param {int} width - Width of the canvas
 * @param {int} height - Height of the canvas
 * @param {object} meta - Additional metadata for the window (optional)
 */

class Window {
    constructor(canvas, width, height, meta = {}) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.context = this.canvas.getContext("2d");
        this.meta = meta;
        this.fps = 10; // milliseconds between frames
    }
    start() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        let root = document.getElementById("root");
        root.appendChild(this.canvas);
        this.context.fillRect(0, 0, this.width, this.height);
        this.interval_frames = setInterval(update, this.fps);  
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}