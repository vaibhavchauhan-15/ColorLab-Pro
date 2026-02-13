/**
 * WCAG 2.1 Contrast & Accessibility Utilities
 * Implements WCAG contrast ratio calculations and compliance checking
 */

import { hexToRgb } from './colorUtils';

/**
 * Convert sRGB color component to linear RGB
 * @param {number} val - RGB value (0-255)
 * @returns {number} Linear RGB value
 */
const toLinear = (val) => {
    const channel = val / 255;
    return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
};

/**
 * Calculate relative luminance of a color
 * @param {string} hex - Hex color code
 * @returns {number} Relative luminance (0-1)
 */
export const getRelativeLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const r = toLinear(rgb.r);
    const g = toLinear(rgb.g);
    const b = toLinear(rgb.b);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Calculate contrast ratio between two colors
 * @param {string} foreground - Foreground hex color
 * @param {string} background - Background hex color
 * @returns {number} Contrast ratio (1-21)
 */
export const getContrastRatio = (foreground, background) => {
    const lum1 = getRelativeLuminance(foreground);
    const lum2 = getRelativeLuminance(background);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Format contrast ratio for display
 * @param {number} ratio - Contrast ratio
 * @returns {string} Formatted ratio (e.g., "4.52:1")
 */
export const formatContrastRatio = (ratio) => {
    return `${ratio.toFixed(2)}:1`;
};

/**
 * Check WCAG compliance levels
 * @param {number} ratio - Contrast ratio
 * @returns {object} Compliance results for different levels
 */
export const checkWCAGCompliance = (ratio) => {
    return {
        aa: {
            normal: ratio >= 4.5,
            large: ratio >= 3,
        },
        aaa: {
            normal: ratio >= 7,
            large: ratio >= 4.5,
        },
    };
};

/**
 * Get overall compliance status
 * @param {number} ratio - Contrast ratio
 * @returns {string} 'AAA', 'AA', or 'FAIL'
 */
export const getComplianceLevel = (ratio) => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'FAIL';
};

/**
 * Adjust color lightness to improve contrast
 * @param {string} hex - Hex color to adjust
 * @param {number} factor - Adjustment factor (-1 to 1)
 * @returns {string} Adjusted hex color
 */
const adjustLightness = (hex, factor) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const adjust = (val) => {
        if (factor > 0) {
            // Lighten
            return Math.round(val + (255 - val) * factor);
        } else {
            // Darken
            return Math.round(val * (1 + factor));
        }
    };

    const r = Math.max(0, Math.min(255, adjust(rgb.r)));
    const g = Math.max(0, Math.min(255, adjust(rgb.g)));
    const b = Math.max(0, Math.min(255, adjust(rgb.b)));

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

/**
 * Suggest an accessible foreground color
 * @param {string} foregroundHex - Original foreground color
 * @param {string} backgroundHex - Background color
 * @param {number} targetRatio - Target contrast ratio (default: 4.5 for AA)
 * @returns {string} Suggested accessible foreground color
 */
export const suggestAccessibleColor = (foregroundHex, backgroundHex, targetRatio = 4.5) => {
    const currentRatio = getContrastRatio(foregroundHex, backgroundHex);
    
    // If already passing, return original
    if (currentRatio >= targetRatio) {
        return foregroundHex;
    }

    const bgLuminance = getRelativeLuminance(backgroundHex);
    
    // Determine if we should lighten or darken
    const shouldLighten = bgLuminance < 0.5;
    
    // Binary search for optimal lightness adjustment
    let low = 0;
    let high = 1;
    let bestColor = foregroundHex;
    let bestRatio = currentRatio;
    
    for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        const factor = shouldLighten ? mid : -mid;
        const testColor = adjustLightness(foregroundHex, factor);
        const testRatio = getContrastRatio(testColor, backgroundHex);
        
        if (testRatio >= targetRatio) {
            bestColor = testColor;
            bestRatio = testRatio;
            high = mid;
        } else {
            low = mid;
        }
        
        // If we've achieved a good ratio, we can stop early
        if (bestRatio >= targetRatio && bestRatio < targetRatio + 1) {
            break;
        }
    }
    
    // If adjustment didn't work well, try the opposite (white or black)
    if (bestRatio < targetRatio) {
        const whiteRatio = getContrastRatio('#FFFFFF', backgroundHex);
        const blackRatio = getContrastRatio('#000000', backgroundHex);
        
        if (whiteRatio >= blackRatio && whiteRatio >= targetRatio) {
            return '#FFFFFF';
        } else if (blackRatio >= targetRatio) {
            return '#000000';
        } else {
            // Return the best of what we found
            return bestColor;
        }
    }
    
    return bestColor;
};

/**
 * Get a human-readable description of the contrast level
 * @param {number} ratio - Contrast ratio
 * @returns {string} Description
 */
export const getContrastDescription = (ratio) => {
    if (ratio >= 12) return 'Excellent';
    if (ratio >= 7) return 'Very Good';
    if (ratio >= 4.5) return 'Good';
    if (ratio >= 3) return 'Sufficient for Large Text';
    return 'Poor';
};
