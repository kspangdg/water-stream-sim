# MIT License
# 
# Copyright (c) 2025 Ben Trettel
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

#import unittest

# numerical parameters
dt  = 1.0e-4 # s, time step
n_d = 1000   # number of droplets

def avg_x_b_s(Tubar_0, We_l0):
    # breakup length, trettel_turbulent_2020 eq. 3.28
    return 3.61 * Tubar_0**-0.275 * We_l0**0.334

class Droplet:
    def __init__(self, rho_w, Ubar_0, d_0, sigma, Tubar_0, D_max_s, h_0, theta_0):
        import random
        from math import cos, sin, pi
        
        We_l0 = rho_w*Ubar_0**2*d_0/sigma
        
        # Each droplet has a randomly generated size and breakup time.
        # This is definitely simplified over reality but should be reasonable to start.
        self.d   = D_max_s * d_0 * random.random() # m, droplet diameter
        self.t_b = (d_0 * avg_x_b_s(Tubar_0, We_l0) / Ubar_0) * (1.0 + sigma_b*2.0*(random.random() - 0.5)) # s, breakup time
        
        self.x = 0.0 # m/s, droplet x location
        self.y = h_0 # m/s, droplet y location
        
        self.u = Ubar_0*cos(theta_0) # m/s, droplet x velocity
        self.v = Ubar_0*sin(theta_0) # m/s, droplet y velocity
        
        self.m_d = (pi/6.0)*rho_w*self.d**3 # kg, mass of droplet
        self.a_d = (pi/4.0)*self.d**2       # m2, droplet projected area

if __name__ == "__main__":
    from math import pi, sqrt
    
    # physical parameters
    D_max_s = 0.7     # D_max/d_0, trettel_turbulent_2020 p. 198 (corrected)
    C_d     = 0.42    # drag coefficient, loth_quasi-steady_2008
    alpha   = 0.05    # entrainment coefficient, trettel_turbulent_2020 p. 179
    sigma_b = 0.13190 # breakup length standard deviation (conductivity_plots.m, trettel_turbulent_2020 p. 177)
    
    rho_w   = 1000.0  # kg/m3, mass density of water
    sigma   = 72.8e-3 # N/m, surface tension of water
    rho_g   = 1.293   # kg/m3, mass density of air
    g       = 9.81    # m/s2, gravitational acceleration
    
    h_0     = 1.5     # m, firing height
    theta_0 = 35.0*(pi/180.0) # radians, firing angle above horizontal
    Tubar_0 = 0.01    # dimensionless, turbulence intensity
    d_0     = 0.00635 # m, nozzle diameter
    Q       = 100     # mL/s, flow rate
    
    A_0    = (pi/4.0)*d_0**2 # m2, nozzle area
    Ubar_0 = (Q*1.0e-6)/A_0  # m/s, jet velocity
    
    # Create droplets at initial conditions
    ds = []
    for i_d in range(n_d):
        ds.append(Droplet(rho_w, Ubar_0, d_0, sigma, Tubar_0, D_max_s, h_0, theta_0))
    
    # time stepping
    t = 0.0
    any_droplets_above_ground = True
    while any_droplets_above_ground:
        t = t + dt
        any_droplets_above_ground = False
        
        for i, d in enumerate(ds):
            # Update list elements in place for simplicity.
            # I will want to change that later for better time integration schemes.
            #print(t, d.x, d.y, d.u, d.v)
            
            ds[i].x = d.x + dt*d.u
            ds[i].y = d.y + dt*d.v
            
            if t > d.t_b:
                u_g     = alpha*d.u # estimate of gas x velocity
                v_g     = alpha*d.v # estimate of gas y velocity
                rel_u   = d.u - u_g
                rel_v   = d.v - v_g
                rel_vel = sqrt(rel_u**2 + rel_v**2)
                drag_x  = -0.5*rho_g*C_d*d.a_d*rel_vel*rel_u/d.m_d
                drag_y  = -0.5*rho_g*C_d*d.a_d*rel_vel*rel_v/d.m_d
            else:
                drag_x = 0.0
                drag_y = 0.0
            
            ds[i].u = d.u + dt*drag_x
            ds[i].v = d.v + dt*(-g + drag_y)
            
            if not any_droplets_above_ground:
                if ds[i].y > 0.0:
                    any_droplets_above_ground = True