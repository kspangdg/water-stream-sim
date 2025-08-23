/**
 * Helper helper functions
 * 
 * @class Helper
 */

class Helper {
    m_to_px(m) {
        return (m / 30.0) * 1000.0;
    }
    px_to_m(px) {
        return (px / 1000.0) * 30.0;
    }
}