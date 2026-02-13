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

// HSL to RGB conversion
export const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    
    return {
        r: Math.round(255 * f(0)),
        g: Math.round(255 * f(8)),
        b: Math.round(255 * f(4))
    };
};

// HEX to HSL conversion
export const hexToHsl = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return { h: 0, s: 0, l: 0 };
    return rgbToHsl(rgb.r, rgb.g, rgb.b);
};

// HSL to HEX conversion
export const hslToHex = (h, s, l) => {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
};

// Generate color scale (50-900) from a base color
export const generateColorScale = (baseHex) => {
    const hsl = hexToHsl(baseHex);
    
    const scale = {
        50: hslToHex(hsl.h, Math.max(hsl.s - 10, 40), Math.min(hsl.l + 40, 96)),
        100: hslToHex(hsl.h, Math.max(hsl.s - 5, 45), Math.min(hsl.l + 35, 92)),
        200: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 25, 85)),
        300: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 75)),
        400: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 8, 65)),
        500: baseHex, // Base color
        600: hslToHex(hsl.h, Math.min(hsl.s + 5, 100), Math.max(hsl.l - 10, 45)),
        700: hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 20, 35)),
        800: hslToHex(hsl.h, Math.min(hsl.s + 15, 100), Math.max(hsl.l - 30, 25)),
        900: hslToHex(hsl.h, Math.min(hsl.s + 20, 100), Math.max(hsl.l - 40, 15))
    };
    
    return scale;
};

// Extract colors from image using canvas (no external libraries)
export const extractColorsFromImage = (imageFile, sampleSize = 10) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Resize for performance
                const maxSize = 200;
                const scale = Math.min(maxSize / img.width, maxSize / img.height);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                
                // Color frequency map
                const colorMap = {};
                
                // Sample pixels (every nth pixel for performance)
                for (let i = 0; i < pixels.length; i += 4 * sampleSize) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const a = pixels[i + 3];
                    
                    // Skip transparent pixels
                    if (a < 125) continue;
                    
                    // Round to reduce similar colors
                    const roundedR = Math.round(r / 10) * 10;
                    const roundedG = Math.round(g / 10) * 10;
                    const roundedB = Math.round(b / 10) * 10;
                    
                    const hex = rgbToHex(roundedR, roundedG, roundedB);
                    colorMap[hex] = (colorMap[hex] || 0) + 1;
                }
                
                // Sort by frequency and get top colors
                const sortedColors = Object.entries(colorMap)
                    .sort((a, b) => b[1] - a[1])
                    .map(([color]) => color);
                
                resolve({
                    dominant: sortedColors[0] || '#000000',
                    palette: sortedColors.slice(0, 5)
                });
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(imageFile);
    });
};

// Color Harmony Generators

// Normalize hue to 0-360 range
const normalizeHue = (hue) => {
    while (hue < 0) hue += 360;
    while (hue >= 360) hue -= 360;
    return hue;
};

// Generate complementary colors (opposite on color wheel)
export const generateComplementary = (baseHex) => {
    const hsl = hexToHsl(baseHex);
    const complementaryHue = normalizeHue(hsl.h + 180);
    
    return {
        base: baseHex,
        complementary: hslToHex(complementaryHue, hsl.s, hsl.l)
    };
};

// Generate analogous colors (adjacent on color wheel)
export const generateAnalogous = (baseHex) => {
    const hsl = hexToHsl(baseHex);
    
    return {
        base: baseHex,
        left: hslToHex(normalizeHue(hsl.h - 30), hsl.s, hsl.l),
        right: hslToHex(normalizeHue(hsl.h + 30), hsl.s, hsl.l)
    };
};

// Generate triadic colors (120° apart on color wheel)
export const generateTriadic = (baseHex) => {
    const hsl = hexToHsl(baseHex);
    
    return {
        base: baseHex,
        second: hslToHex(normalizeHue(hsl.h + 120), hsl.s, hsl.l),
        third: hslToHex(normalizeHue(hsl.h + 240), hsl.s, hsl.l)
    };
};

// Generate tetradic (square) colors (90° apart on color wheel)
export const generateTetradic = (baseHex) => {
    const hsl = hexToHsl(baseHex);
    
    return {
        base: baseHex,
        second: hslToHex(normalizeHue(hsl.h + 90), hsl.s, hsl.l),
        third: hslToHex(normalizeHue(hsl.h + 180), hsl.s, hsl.l),
        fourth: hslToHex(normalizeHue(hsl.h + 270), hsl.s, hsl.l)
    };
};

// Generate monochromatic colors (same hue, different saturation/lightness)
export const generateMonochromatic = (baseHex) => {
    const hsl = hexToHsl(baseHex);
    
    return {
        darkest: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 10)),
        darker: hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 20)),
        base: baseHex,
        lighter: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 80)),
        lightest: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 30, 90))
    };
};

// Generate all harmony types
export const generateAllHarmonies = (baseHex) => {
    return {
        complementary: generateComplementary(baseHex),
        analogous: generateAnalogous(baseHex),
        triadic: generateTriadic(baseHex),
        tetradic: generateTetradic(baseHex),
        monochromatic: generateMonochromatic(baseHex)
    };
};

// Generate animated gradient CSS with keyframes
export const generateAnimatedGradientCSS = (colors, type = 'linear', angle = 45, duration = 3) => {
    const colorString = colors.join(', ');
    let backgroundValue, keyframes, css;
    
    if (type === 'radial') {
        // For radial gradients, animate the circle position
        keyframes = `
@keyframes gradientAnimation {
    0% {
        background-position: 0% 50%;
    }
    25% {
        background-position: 100% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    75% {
        background-position: 0% 100%;
    }
    100% {
        background-position: 0% 50%;
    }
}`;
        backgroundValue = `radial-gradient(circle at center, ${colorString})`;
    } else {
        // For linear gradients, animate along the gradient direction
        keyframes = `
@keyframes gradientAnimation {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}`;
        backgroundValue = `linear-gradient(${angle}deg, ${colorString})`;
    }
    
    css = `background: ${backgroundValue};
background-size: 200% 200%;
animation: gradientAnimation ${duration}s ease infinite;`;

    return { css, keyframes };
};
