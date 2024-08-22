const _Window = new Window(document.createElement("canvas"), 2000, 1000, {
    test: "test",
});

const square = new Render(
    {
        position: { x: 100, y: 495 },
        size: { w: 10, h: 10 },
    }
);

const update = () => {
    _Window.clear(); // Clear the canvas

    //square.position.x += 1; // Move the square to the right




    square.update(); // Update the square
};


_Window.start(); // Start the window and render the canvas
