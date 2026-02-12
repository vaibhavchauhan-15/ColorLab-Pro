export const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

export const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

export const blendColors = (colors) => {
    if (!colors || colors.length === 0) return "#000000";

    let totalR = 0, totalG = 0, totalB = 0;

    colors.forEach(hex => {
        const rgb = hexToRgb(hex);
        if (rgb) {
            totalR += rgb.r;
            totalG += rgb.g;
            totalB += rgb.b;
        }
    });

    const count = colors.length;
    return rgbToHex(
        Math.round(totalR / count),
        Math.round(totalG / count),
        Math.round(totalB / count)
    );
};

export const generateGradientCSS = (type, angle, colors) => {
    const colorString = colors.join(", ");
    if (type === 'radial') {
        return `radial-gradient(circle, ${colorString})`;
    }
    return `linear-gradient(${angle}deg, ${colorString})`;
};
