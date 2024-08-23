/**
 * Helper helper functions
 * 
 * @class Helper
 */

class Helper {
    px_to_ft(px) {
        return px * 0.1;
    }
    ft_to_px(ft) {
        return ft * 10;
    }
    px_to_mm(px) {
        return px * 0.1;
    }
    mm_to_px(mm) {
        return mm * 10;
    }
    mm_to_ft(mm) {
        return mm * 0.00328084;
    }
    ft_to_mm(ft) {
        return ft * 304.8;
    }
    ft_to_m(ft) {
        return ft * 0.3048;
    }
    m_to_ft(m) {
        return m * 3.28084;
    }
    px_to_m(px) {
        let ft = this.px_to_ft(px);
        return this.ft_to_m(ft);
    }
    psi_to_pa(psi) {
        return psi * 6894.76;
    }
    newton_to_drop_velocity(n) {
        return n * 0.1;
    }
}