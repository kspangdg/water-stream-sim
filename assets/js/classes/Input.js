/**
 * Handles the input from the user
 * 
 * @class Input
 */

class Input {
    constructor({
        inputs,
      }) {
        this.inputs = inputs;
        this.set_inputs();
      }   
    set_inputs() {
        for (let input of this.inputs) {
            input.addEventListener("input", (event) => {
                _Window.meta[event.target.id] = parseFloat(event.target.value);
                let span = event.target.id + "_value";
                document.getElementById(span).innerText = _Window.meta[event.target.id];
            });
        }
    }
}