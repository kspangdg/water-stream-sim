// VARIABLES
const _Window = new Window(document.createElement("canvas"), 1000, 250, {});
const _Helper = new Helper();

// Output data
const _Output = new Output({ output: document.querySelector(".output") });


let ds = [];
let t = 0.0;

// MAIN LOOP (speed set in Window.js fps)
const update = () => {
    _Window.clear();


    // Numerical parameters
    const dt = 0.0001; // s, time step
    const n_d = 1000; // number of droplets
    // physical parameters
    const D_max_s = 0.7; // D_max/d_0, trettel_turbulent_2020 p. 198 (corrected)
    const C_d = 0.42; // drag coefficient, loth_quasi-steady_2008
    const alpha = 0.05; // entrainment coefficient, trettel_turbulent_2020 p. 179
    const sigma_b = 0.13190; // breakup length standard deviation (conductivity_plots.m, trettel_turbulent_2020 p. 177)

    const rho_w = 1000.0; // kg/m3, mass density of water
    const sigma = 0.0728; // N/m, surface tension of water
    const rho_g = 1.293; // kg/m3, mass density of air
    const g = 9.81; // m/s2, gravitational acceleration

    const h_0 = _Window.height - _Helper.ft_to_px(_Helper.m_to_ft(1.5)); // firing height (1.5 m)
    
    const theta_0 = (35.0 * Math.PI) / 180.0; // radians, firing angle above horizontal
    const Tubar_0 = 0.01; // dimensionless, turbulence intensity
    const d_0 = 0.00635; // m, nozzle diameter
    const Q = 100; // mL/s, flow rate

    const A_0 = (Math.PI / 4.0) * Math.pow(d_0, 2); // m2, nozzle area
    const Ubar_0 = (Q * 0.0000010) / A_0; // m/s, jet velocity
    

    ds.push(new Droplet(rho_w, Ubar_0, d_0, sigma, sigma_b, Tubar_0, D_max_s, h_0, theta_0));

    for (let d of ds) {
        let drag_x;
        let drag_y;
        t = t + dt;
        
        if (t < d.t_b) {
          const u_g = alpha * d.velocity.u; // estimate of gas x velocity
          const v_g = alpha * d.velocity.v; // estimate of gas y velocity
          const rel_u = d.velocity.u - u_g;
          const rel_v = d.velocity.v - v_g;
          const rel_vel = Math.sqrt(Math.pow(rel_u, 2) + Math.pow(rel_v, 2));
          drag_x = (-0.5 * rho_g * C_d * d.a_d * rel_vel * rel_u) / d.m_d;
          drag_y = (-0.5 * rho_g * C_d * d.a_d * rel_vel * rel_v) / d.m_d;
        } else {
          drag_x = 0.0;
          drag_y = 0.0;
        }
  
        d.velocity.u = d.velocity.u + dt * drag_x;
        d.velocity.v = d.velocity.v + dt * ((g * -1) + drag_y);

        d.position.x = d.position.x + dt * d.velocity.u;
        d.position.y = d.position.y + dt * d.velocity.v;
        
        
        

        d.update(); // This just draws the droplet on the canvas.

        // Remove droplets that are out of bounds.
        if (d.position.x > _Window.width || d.position.y > _Window.height - 10) {
            ds.splice(ds.indexOf(d), 1);
            d = null;
        }
    }

};


// START
_Window.start();

// END
function kill_sim() {
    clearInterval(_Window.interval_frames);
}

