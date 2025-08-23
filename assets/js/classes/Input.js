/**
 * Handles the input from the user
 * 
 * @class Input
 */

class Input {
    constructor(inputs = []) {
        this.inputs = inputs;
        this.set_inputs();
      }
    set_inputs() {
        for (let i = 0; i < this.inputs.length; i++) {
            let input_wrapper = this.inputs[i];
            const input = input_wrapper.querySelector("input");
            const label = input_wrapper.querySelector("label span");
            input.addEventListener("input", (event) => {
                vars[event.target.id] = parseFloat(event.target.value);
                label.innerText = vars[event.target.id];
            });
        }
    }
}