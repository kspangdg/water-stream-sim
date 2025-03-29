
function avg_x_b_s(Tubar_0, We_l0) {
  // breakup length, trettel_turbulent_2020 eq. 3.28
  return 3.61 * Math.pow(Tubar_0, -0.275) * Math.pow(We_l0, 0.334);
}

class Droplet {
  constructor(rho_w, Ubar_0, d_0, sigma, Tubar_0, D_max_s, h_0, theta_0) {
    const We_l0 = (rho_w * Math.pow(Ubar_0, 2) * d_0) / sigma;

    // Each droplet has a randomly generated size and breakup time.
    // This is definitely simplified over reality but should be reasonable to start.
    this.d = D_max_s * d_0 * Math.random(); // m, droplet diameter
    this.t_b =
      (d_0 * avg_x_b_s(Tubar_0, We_l0) / Ubar_0) *
      (1.0 + sigma_b * 2.0 * (Math.random() - 0.5)); // s, breakup time

    this.x = 0.0; // m/s, droplet x location
    this.y = h_0; // m/s, droplet y location

    this.u = Ubar_0 * Math.cos(theta_0); // m/s, droplet x velocity
    this.v = Ubar_0 * Math.sin(theta_0); // m/s, droplet y velocity

    this.m_d = (Math.PI / 6.0) * rho_w * Math.pow(this.d, 3); // kg, mass of droplet
    this.a_d = (Math.PI / 4.0) * Math.pow(this.d, 2); // m2, droplet projected area
  }
}

if (typeof window === 'undefined') { //prevent global scope pollution in browser env.
    main()
}

function main() {
  // Numerical parameters
  const dt = 1.0e-4; // s, time step
  const n_d = 1000; // number of droplets
  // physical parameters
  const D_max_s = 0.7; // D_max/d_0, trettel_turbulent_2020 p. 198 (corrected)
  const C_d = 0.42; // drag coefficient, loth_quasi-steady_2008
  const alpha = 0.05; // entrainment coefficient, trettel_turbulent_2020 p. 179
  const sigma_b = 0.13190; // breakup length standard deviation (conductivity_plots.m, trettel_turbulent_2020 p. 177)

  const rho_w = 1000.0; // kg/m3, mass density of water
  const sigma = 72.8e-3; // N/m, surface tension of water
  const rho_g = 1.293; // kg/m3, mass density of air
  const g = 9.81; // m/s2, gravitational acceleration

  const h_0 = 1.5; // m, firing height
  const theta_0 = (35.0 * Math.PI) / 180.0; // radians, firing angle above horizontal
  const Tubar_0 = 0.01; // dimensionless, turbulence intensity
  const d_0 = 0.00635; // m, nozzle diameter
  const Q = 100; // mL/s, flow rate

  const A_0 = (Math.PI / 4.0) * Math.pow(d_0, 2); // m2, nozzle area
  const Ubar_0 = (Q * 1.0e-6) / A_0; // m/s, jet velocity

  // Create droplets at initial conditions
  const ds = [];
  for (let i_d = 0; i_d < n_d; i_d++) {
    ds.push(new Droplet(rho_w, Ubar_0, d_0, sigma, Tubar_0, D_max_s, h_0, theta_0));
  }

  // time stepping
  let t = 0.0;
  let any_droplets_above_ground = true;
  while (any_droplets_above_ground) {
    t = t + dt;
    any_droplets_above_ground = false;

    for (let i = 0; i < ds.length; i++) {
      const d = ds[i];
      // Update list elements in place for simplicity.
      // I will want to change that later for better time integration schemes.
      //console.log(t, d.x, d.y, d.u, d.v);

      d.x = d.x + dt * d.u;
      d.y = d.y + dt * d.v;

      let drag_x;
      let drag_y;

      if (t > d.t_b) {
        const u_g = alpha * d.u; // estimate of gas x velocity
        const v_g = alpha * d.v; // estimate of gas y velocity
        const rel_u = d.u - u_g;
        const rel_v = d.v - v_g;
        const rel_vel = Math.sqrt(Math.pow(rel_u, 2) + Math.pow(rel_v, 2));
        drag_x = (-0.5 * rho_g * C_d * d.a_d * rel_vel * rel_u) / d.m_d;
        drag_y = (-0.5 * rho_g * C_d * d.a_d * rel_vel * rel_v) / d.m_d;
      } else {
        drag_x = 0.0;
        drag_y = 0.0;
      }

      ds[i].u = d.u + dt * drag_x;
      ds[i].v = d.v + dt * (-g + drag_y);

      if (!any_droplets_above_ground) {
        if (ds[i].y > 0.0) {
          any_droplets_above_ground = true;
        }
      }
    }
  }
}