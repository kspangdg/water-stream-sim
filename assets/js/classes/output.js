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
}