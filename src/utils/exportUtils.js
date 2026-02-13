import { hexToRgb, rgbToHsl, rgbToHex } from './colorUtils';

// ============================================================================
// COLOR SPACE CONVERSIONS
// ============================================================================

/**
 * Converts HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {Object} - RGB object {r, g, b}
 */
const hslToRgb = (h, s, l) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

/**
 * Converts hex to HSL
 * @param {string} hex - Hex color code
 * @returns {Object} - HSL object {h, s, l}
 */
const hexToHsl = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return { h: 0, s: 0, l: 0 };
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
};

/**
 * Converts HSL to hex
 * @param {Object} hsl - HSL object {h, s, l}
 * @returns {string} - Hex color code
 */
const hslToHex = (hsl) => {
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
};

// ============================================================================
// PROFESSIONAL SHADE GENERATION
// ============================================================================

/**
 * Generates a professional 50-900 shade scale from a base color
 * Uses HSL color space for accurate, consistent results
 * @param {string} baseHex - Base hex color
 * @returns {Object} - Object with shades (50, 100, 200...900)
 */
export const generateShadeScale = (baseHex) => {
    const hsl = hexToHsl(baseHex);
    
    // Professional lightness mapping - ensures consistent, beautiful scales
    const lightnessMap = {
        50: 95,
        100: 90,
        200: 80,
        300: 70,
        400: 60,
        500: hsl.l,  // Base color lightness
        600: Math.max(hsl.l - 10, 40),
        700: Math.max(hsl.l - 20, 30),
        800: Math.max(hsl.l - 30, 20),
        900: Math.max(hsl.l - 40, 12),
    };

    const scale = {};
    
    for (const [shade, lightness] of Object.entries(lightnessMap)) {
        // Slightly reduce saturation in lighter shades for better visual balance
        const saturationAdjustment = parseInt(shade) < 500 
            ? Math.max(hsl.s - (500 - parseInt(shade)) / 100 * 5, hsl.s * 0.7)
            : hsl.s;
        
        scale[shade] = hslToHex({
            h: hsl.h,
            s: saturationAdjustment,
            l: lightness
        });
    }

    return scale;
};

// ============================================================================
// CASE FORMATTERS
// ============================================================================

const formatters = {
    'kebab-case': (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''),
    'camelCase': (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase()),
    'snake_case': (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '').replace(/-/g, '_'),
    'default': (str) => str
};

const formatKey = (key, caseFormat) => {
    const formatter = formatters[caseFormat] || formatters.default;
    return formatter(key);
};

// ============================================================================
// EXPORT GENERATORS
// ============================================================================

/**
 * Generates CSS Variables
 * @param {Object} palette - Color palette object
 * @param {string} caseFormat - Case formatting option
 * @returns {string} - CSS variables string
 */
export const generateCSSVariables = (palette, caseFormat = 'kebab-case') => {
    const lines = [':root {'];
    
    for (const [name, value] of Object.entries(palette)) {
        const formattedName = formatKey(name, caseFormat);
        
        if (typeof value === 'object') {
            for (const [shade, color] of Object.entries(value)) {
                const shadeKey = shade === 'DEFAULT' ? formattedName : `${formattedName}-${shade}`;
                lines.push(`  --${shadeKey}: ${color};`);
            }
        } else {
            lines.push(`  --${formattedName}: ${value};`);
        }
    }
    
    lines.push('}');
    return lines.join('\n');
};

/**
 * Generates SCSS Variables
 * @param {Object} palette - Color palette object
 * @param {string} caseFormat - Case formatting option
 * @returns {string} - SCSS variables string
 */
export const generateSCSSVariables = (palette, caseFormat = 'kebab-case') => {
    const lines = [];
    
    for (const [name, value] of Object.entries(palette)) {
        const formattedName = formatKey(name, caseFormat);
        
        if (typeof value === 'object') {
            for (const [shade, color] of Object.entries(value)) {
                const shadeKey = shade === 'DEFAULT' ? formattedName : `${formattedName}-${shade}`;
                lines.push(`$${shadeKey}: ${color};`);
            }
        } else {
            lines.push(`$${formattedName}: ${value};`);
        }
    }
    
    return lines.join('\n');
};

/**
 * Generates React Theme Object
 * @param {Object} palette - Color palette object
 * @param {string} caseFormat - Case formatting option
 * @returns {string} - JavaScript theme object string
 */
export const generateReactTheme = (palette, caseFormat = 'camelCase') => {
    const formatted = {};
    
    for (const [name, value] of Object.entries(palette)) {
        const formattedName = formatKey(name, caseFormat);
        formatted[formattedName] = value;
    }
    
    const jsonString = JSON.stringify({ colors: formatted }, null, 2)
        .replace(/"([^"]+)":/g, '$1:');
    
    return `export const theme = ${jsonString};`;
};

/**
 * Generates JSON export
 * @param {Object} palette - Color palette object
 * @param {string} caseFormat - Case formatting option
 * @returns {string} - Formatted JSON string
 */
export const generateJSON = (palette, caseFormat = 'camelCase') => {
    const formatted = {};
    
    for (const [name, value] of Object.entries(palette)) {
        const formattedName = formatKey(name, caseFormat);
        formatted[formattedName] = value;
    }
    
    return JSON.stringify(formatted, null, 2);
};

/**
 * Generates Tailwind Config with shade scales
 * @param {Object} palette - Color palette object
 * @param {string} caseFormat - Case formatting option
 * @returns {string} - Tailwind config string
 */
export const generateTailwindConfig = (palette, caseFormat = 'camelCase') => {
    const colors = {};
    
    for (const [name, value] of Object.entries(palette)) {
        const formattedName = formatKey(name, caseFormat);
        
        if (typeof value === 'object') {
            colors[formattedName] = value;
        } else {
            const scale = generateShadeScale(value);
            colors[formattedName] = {
                DEFAULT: value,
                ...scale
            };
        }
    }
    
    const colorString = JSON.stringify(colors, null, 8)
        .replace(/"([^"]+)":/g, '$1:')
        .replace(/^/gm, '  ');
    
    return `module.exports = {
  theme: {
    extend: {
      colors: ${colorString.trim()}
    }
  }
}`;
};

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

export const toCSSVariables = generateCSSVariables;
export const toSCSSVariables = generateSCSSVariables;
export const toReactTheme = generateReactTheme;
export const toJSON = generateJSON;
export const toTailwindConfig = generateTailwindConfig;

// ============================================================================
// CLIPBOARD UTILITY
// ============================================================================

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (e) {
            document.body.removeChild(textarea);
            return false;
        }
    }
};
