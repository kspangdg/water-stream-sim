/**
 * Prints data to the output window
 * 
 * @class Output
 */

class Output {
    constructor({
        output,
      }) {
        this.output = output;
      }   
    update_output(text) {
        this.output.innerHTML = text;
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
      let colors = [
        "rgba(0, 255, 242, 0.2)",
        "rgba(0, 204, 255, 0.2)",
        "rgba(0, 100, 255, 0.2)",
        "rgba(0, 42, 255, 0.2)",
        "rgba(68, 0, 255, 0.2)",
        "rgba(153, 0, 255, 0.2)",
        "rgba(221, 0, 255, 0.2)",
        "rgba(255, 0, 144, 0.2)",
        "rgba(255, 0, 93, 0.2)",
        "rgba(255, 0, 0, 0.2)"
      ];
      let index = fluid_pressure / 3;
      index = Math.round(index) / 10;
      console.log('index', index);
      
      nozzle_path.style.fill = colors[index];
    }
}