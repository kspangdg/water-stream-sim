/**
 * Prints data to the output window
 * 
 * @class Output
 */

class Output {
    constructor(output) {
      this.output = output;
    }   
    update_output() {
        for (let i = 0; i < this.output.length; i++) {
            let output_wrapper = this.output[i];
            let output_id = output_wrapper.id.split("_output")[0];
            if (vars[output_id] !== undefined) {
                output_wrapper.querySelector("span").innerText = vars[output_id].toFixed(2);
            }
        }
    }
    update_nozzle_diameter(nozzle_diameter_in, nozzle_diameter_out) {
      let nozzle = document.getElementById("nozzle");
      let nozzle_path = nozzle.getElementsByTagName("path")[0];
      let nozzle_in_top = (100 - nozzle_diameter_in) / 2;
      let nozzle_in_bottom = nozzle_diameter_in / 2 + 50;
      let nozzle_out_top = (100 - nozzle_diameter_out) / 2;
      let nozzle_out_bottom = nozzle_diameter_out / 2 + 50;
      nozzle_path.setAttribute("d", `M 0,${nozzle_in_top} L 100,${nozzle_out_top} L 100,${nozzle_out_bottom} L 0,${nozzle_in_bottom} Z`);
    }
    update_nozzle_pressure(fluid_pressure) {
      let nozzle = document.getElementById("nozzle");
      let nozzle_path = nozzle.getElementsByTagName("path")[0];
      nozzle_path.style.fill = 'hsl(' + (216 + Math.min(fluid_pressure, 120) ) + ', 99%, 59%)';
    }
}