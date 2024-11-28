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
    init() {
        for (let input of this.inputs) {
            //const rangeSliderElement = rangeSlider(inputs);
        }
    }
    set_inputs() {
        for (let input of this.inputs) {
            input.addEventListener("input", (event) => {
                _Window.meta[event.target.id] = parseFloat(event.target.value);
                let span = event.target.id + "_value";
                document.getElementById(span).innerText = _Window.meta[event.target.id];
            });
        }
        let toggle_units = document.getElementById("toggle_units");
        let toggle_units_value = document.getElementById("toggle_units_value");
        toggle_units.addEventListener("click", (event) => {
            let unit = _Window.meta.units;
            if (unit === 0) {
                _Window.meta.units = 1;
                toggle_units_value.innerText = "Imperial";
                toggle_units.classList.add("active");
            } else {
                _Window.meta.units = 0;
                toggle_units_value.innerText = "Metric";
                toggle_units.classList.remove("active");
            }
        });
    }
}