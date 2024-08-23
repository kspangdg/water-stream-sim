// VARIABLES
const _Window = new Window(document.createElement("canvas"), 1000, 500, {
    air_pressure: 14.6959, // Air pressure in pascal
    air_density: 1.225, // Air density in kg/m^3
    air_temperature: 20, // Air temperature in celsius
    fluid_pressure: 10, // Fluid pressure in pascal
    fluid_density: 1005, // Water density in kg/m^3
    fluid_temperature: 20, // Water temperature in celsius
    nozzle_diameter_in: 10, // Nozzle diameter in millimeters
    nozzle_diameter_out: 10, // Nozzle diameter out in millimeters
});
const _Helper = new Helper();
const _Physics = new Physics();
const _Input = new Input({ inputs: document.querySelectorAll("input")});
const _Output = new Output({ output: document.querySelector(".output_container") });
const nozzle = new Render({
    position: { x: 0, y: 240 },
    size: { w: 10, h: 2 },
    color: "black",
    shape: "rectangle"
});
const range_marker = new Render({
    position: { x: 0, y: 450 },
    size: { w: 2, h: 50 },
    color: "black",
    shape: "rectangle"
});
const marker_text = new Render({
    position: { x: 0, y: 450 },
    size: { w: "20px", h: "Arial" },
    color: "Range",
    shape: "text",
    text: "Range: 0m"
});
let waterdrops = [];

// MAIN LOOP
const update = () => {
    _Window.clear();

    // Calculate flow velocity and volumetric flow rate leaving the nozzle
    let P = _Helper.psi_to_pa(_Window.meta.fluid_pressure);
    let p = _Window.meta.fluid_density;
    let a1 = Math.PI * Math.pow(_Window.meta.nozzle_diameter_in / 1000.0, 2.0);
    let a2 = Math.PI * Math.pow(_Window.meta.nozzle_diameter_out / 1000.0, 2.0); 
    let Ap = _Helper.psi_to_pa(_Window.meta.air_pressure);

    let V = _Physics.flow_velocity(P, p, a1, a2);
    let Q = _Physics.volumetric_flow_rate(V, a2);

    // Calculate air resistance
    let R = _Physics.air_resistance(V, a1, p, Ap);

    // Calculate fluid mass and Gravity
    let m = _Physics.fluid_mass(V, a1, p);
    let Fg = _Physics.gravity_force(m);

    _Output.update_output(`Flow velocity: ${V} m/s <br> Volumetric flow rate: ${Q} m^3/s <br> Air resistance: ${R} pascal <br> Fluid mass: ${m} kg <br> Gravity force: ${Fg} N`);



    //convert to pixels
    V = _Helper.m_to_ft(V);
    V = _Helper.ft_to_px(V) / 1000; // account for frame rate

    //convert to pixels
    Q = _Helper.m_to_ft(Q);
    Q = _Helper.ft_to_px(Q);

    //convert to pixels
    R = _Helper.m_to_ft(R);
    R = _Helper.ft_to_px(R) / 100000; // account for frame rate

    //convert to pixels
    Fg = _Helper.newton_to_drop_velocity(Fg);
    Fg = _Helper.ft_to_px(Fg) / 10000; // account for frame rate

    



    waterdrops.push(new Render(
        {
            position: { x: 10, y: 240},
            size: { w: _Window.meta.nozzle_diameter_in / 5, h: _Window.meta.nozzle_diameter_in / 5 },
            color: "blue",
            shape: "rectangle"
        }
    ));

    for (let drop of waterdrops) {
        drop.velocity = V * 2;
        drop.resistance = R;
        drop.position.x += drop.velocity - drop.resistance;
        drop.position.x += Math.random() - 0.5;
        drop.position.y += drop.gravity;
        drop.gravity += Fg;
        drop.update();
        if (drop.position.x > _Window.width || drop.position.y > _Window.height - 10) {
            // update range marker
            range_marker.position.x = drop.position.x;
            marker_text.position.x = drop.position.x;
            marker_text.text = `Range: ${_Helper.px_to_m(drop.position.x).toFixed(2)}m`;
            waterdrops.splice(waterdrops.indexOf(drop), 1);
            drop = null;
        }
    }
    nozzle.size.h = _Window.meta.nozzle_diameter_in / 5;
    nozzle.update();
    range_marker.update();
    marker_text.update();

};


// START
_Window.start();

// END
function kill_sim() {
    clearInterval(_Window.interval_frames);
}

