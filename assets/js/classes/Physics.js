/**
 * Physics calculations
 * 
 * @class Physics
 */

class Physics {

    /**
     * Calculate Flow Velocity
     * 
     * @param {number} P - Pressure in pascal
     * @param {number} p - Fluid density in kg/m^3
     * @param {number} a1 - Nozzle area in m^2
     * @param {number} a2 - Nozzle area out in m^2
     * @returns {number} - Flow velocity in m/s
     */
    flow_velocity(P, p, a1, a2) {
        return Math.sqrt((2 * (P / p)) + (Math.pow(a1, 2) / a2));
    }

    /**
     * Calculate volumetric flow rate
     * 
     * @param {number} v - Flow velocity in m/s
     * @param {number} a - Nozzle area in m^2
     * @returns {number} - Volumetric flow rate in m^3/s
     */
    volumetric_flow_rate(v, a) {
        return v * a;
    }

    /**
     * Calculate fluid mass
     * 
     * @param {number} v - Flow velocity in m/s
     * @param {number} a - Nozzle area in m^2
     * @param {number} p - Fluid density in kg/m^3
     * @returns {number} - Fluid mass in kg
     */
    fluid_mass(v, a, p) {
        return p * a * v;
    }

    /**
     * Calculate Air resistance
     * 
     * @param {number} v - Flow velocity in m/s
     * @param {number} a - Nozzle area in m^2
     * @param {number} p - Fluid density in kg/m^3
     * @param {number} Ap - Air pressure in pascal
     * @returns {number} - Air resistance in pascal
     */
    air_resistance(v, a, p, Ap = 101325) {
        return (Ap * Math.pow(v, 2) * a) / (2 * p);
    }

    /**
     * Calculate Drag force
     * 
     * @param {number} v - Flow velocity in m/s
     * @param {number} a - Nozzle area in m^2
     * @param {number} p - Fluid density in kg/m^3
     * @param {number} c - Drag coefficient
     * @returns {number} - Drag force in newton
     */
    drag_force(v, a, p, c) {
        return 0.5 * p * Math.pow(v, 2) * a * c;
    }

    /**
     * Calculate Gravity force based on mass
     * 
     * @param {number} m - Mass in kg
     * @returns {number} - Gravity force in newton
     */
    gravity_force(m) {
        return m * 9.81;
    }

}