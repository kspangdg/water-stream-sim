/**
 * A class representing a droplet in a simulation.
 * 
 * @class Droplet
 * @author Ben Trettel
 * @date 2025
 * @param {number} rho_w - Mass density of water (kg/m3)
 * @param {number} Ubar_0 - Average jet velocity (m/s)
 * @param {number} d_0 - Nozzle diameter (m)
 * @param {number} sigma - Surface tension of water (N/m)
 * @param {number} sigma_b - Breakup time scaling factor (dimensionless)
 * @param {number} Tubar_0 - Turbulence intensity (dimensionless)
 * @param {number} D_max_s - Maximum droplet size scaling factor (dimensionless)
 * @param {number} h_0 - Initial height of droplets (m)
 * @param {number} theta_0 - Initial angle of droplets (radians)
 *              
 */

class Droplet {
    constructor(
        rho_w, // kg/m3, mass density of water
        Ubar_0, // m/s, average jet velocity 
        d_0, // m, nozzle diameter 
        sigma, // N/m, surface tension of water 
        sigma_b, // dimensionless, breakup time scaling factor 
        Tubar_0, // dimensionless, turbulence intensity 
        D_max_s, // dimensionless, maximum droplet size scaling factor 
        h_0,
        theta_0,
    ) {
      this.We_l0 = (rho_w * Math.pow(Ubar_0, 2) * d_0) / sigma;
  
      // Each droplet has a randomly generated size and breakup time.
      // This is definitely simplified over reality but should be reasonable to start.
      this.d = D_max_s * d_0 * Math.random(); // m, droplet diameter
      this.t_b = (d_0 * this.avg_x_b_s(Tubar_0, this.We_l0) / Ubar_0) * (1.0 + sigma_b * 2.0 * (Math.random() - 0.5)); // s, breakup time
      
      this.position = {x: 10.0, y: h_0}; // m/s, droplet x location & y location
      this.velocity = {u: Ubar_0 * Math.cos(theta_0), v: Ubar_0 * Math.sin(theta_0)}; // m/s, droplet x and y velocity 
  
      this.m_d = (Math.PI / 6.0) * rho_w * Math.pow(this.d, 3); // kg, mass of droplet
      this.a_d = (Math.PI / 4.0) * Math.pow(this.d, 2); // m2, droplet projected area
      this.size = 10;

      //debug
      //console.log(h_0);
      
    }

    avg_x_b_s(Tubar_0, We_l0) {
        // breakup length, trettel_turbulent_2020 eq. 3.28
        return 3.61 * Math.pow(Tubar_0, -0.275) * Math.pow(We_l0, 0.334);
    }
    draw() {
        _Window.context.beginPath();
        _Window.context.fillStyle = '#00D9FF';
        _Window.context.arc(this.position.x, this.position.y, 2, 0, 2 * Math.PI);
        _Window.context.fill();
    }
    update() {
        // console.log('this.u', this.velocity.u);
        // console.log('this.v', this.velocity.v);
        
        this.draw();
    }
}