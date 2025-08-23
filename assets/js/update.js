const _Window = new Window(document.createElement("canvas"), 1000, 250);
const _Helper = new Helper();
let ds = [];
let range_interval = 0;
let vars = {
    dt: 0.1, // s, time step
    n_d: 1000, // number of droplets
    D_max_s: 0.7, // D_max/d_0, trettel_turbulent_2020 p. 198 (corrected)
    C_d: 0.42, // drag coefficient, loth_quasi-steady_2008
    alpha: 0.05, // entrainment coefficient, trettel_turbulent_2020 p. 179
    sigma_b: 0.13190, // breakup length standard deviation (conductivity_plots.m, trettel_turbulent_2020 p. 177)
    rho_w: 1000.0, // kg/m3, mass density of water
    sigma: 0.0728, // N/m, surface tension of water
    rho_g: 1.293, // kg/m3, mass density of air
    g: 9.81, // m/s2, gravitational acceleration
    h_0: (_Window.height - _Helper.m_to_px(1.5)), // firing height (1.5 m) | I updated this to get the meter distance in pixels for the bottom of the window - KS
    theta_0: (35.0 * Math.PI) / 360.0, // radians, firing angle above horizontal
    Tubar_0: 0.01, // dimensionless, turbulence intensity
    d_0: 0.00635, // m, nozzle diameter
    Q: 100, // mL/s, flow rate
    R: 0, // m, range
};


// Input handlers
const _Input = new Input(document.querySelectorAll(".input"));

// Output data
const _Output = new Output(document.querySelectorAll(".output"));



// MAIN LOOP (speed set in Window.js fps)
const update = () => {

    vars.A_0 = (Math.PI / 4.0) * Math.pow(vars.d_0, 2); // m2, nozzle area
    vars.Ubar_0 = (vars.Q * 0.0000010) / vars.A_0; // m/s, jet velocity

    _Output.update_nozzle_diameter(vars.d_0 * 5000, vars.d_0 * 5000 * 0.6); // convert to mm for display
    _Output.update_nozzle_pressure(vars.rho_w * Math.pow(vars.Ubar_0, 2) / 1000.0); // convert to bar for display

    _Window.clear();

    ds.push(new Droplet(vars.rho_w, vars.Ubar_0, vars.d_0, vars.sigma, vars.sigma_b, vars.Tubar_0, vars.D_max_s, vars.h_0, vars.theta_0));

    for (let d of ds) {
        d.t = d.t + vars.dt; // update time since start of simulation
        d.position.x = d.position.x + vars.dt * d.velocity.u;
        d.position.y = d.position.y + vars.dt * d.velocity.v;
  
        let drag_x;
        let drag_y;
  
        if (d.t < d.t_b) {
          const u_g = vars.alpha * d.velocity.u; // estimate of gas x velocity
          const v_g = vars.alpha * d.velocity.v; // estimate of gas y velocity
          const rel_u = d.velocity.u - u_g;
          const rel_v = d.velocity.v - v_g;
          const rel_vel = Math.sqrt(Math.pow(rel_u, 2) + Math.pow(rel_v, 2));
          drag_x = (-0.5 * vars.rho_g * vars.C_d * d.a_d * rel_vel * rel_u) / d.m_d;
          drag_y = (-0.5 * vars.rho_g * vars.C_d * d.a_d * rel_vel * rel_v) / d.m_d;
        } else {
          drag_x = 0.0;
          drag_y = 0.0;
        }
  
        d.velocity.u = d.velocity.u + vars.dt * drag_x;
        d.velocity.v = d.velocity.v + vars.dt * (vars.g + drag_y);
        
        // Draw droplet on canvas.
        d.update();
        _Output.update_output();

        // Remove droplets that are out of bounds.
        if (d.position.x > _Window.width || d.position.y > _Window.height - 10) {
            if (range_interval > 10) {
                vars.R = d.position.x;
                range_interval = 0;
            } else {
                range_interval += 1;
            }
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

function dark_mode() {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.getElementById("dark_mode").innerText = "Dark Mode";
    } else {
        document.body.classList.add("dark");
        document.getElementById("dark_mode").innerText = "Light Mode";
    }
}

