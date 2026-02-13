/**
 * Example usage and testing of export utilities
 * Run this file to see sample outputs
 */

import {
    toCSSVariables,
    toSCSSVariables,
    toReactTheme,
    toJSON,
    toTailwindConfig,
    generateShadeScale,
    adjustLightness
} from './exportUtils.js';

// Sample color palette
const samplePalette = {
    primary: '#3b82f6',
    secondary: '#9333ea',
    accent: '#f59e0b',
    success: '#10b981',
    danger: '#ef4444',
    neutral: '#6b7280'
};

console.log('='.repeat(80));
console.log('EXPORT UTILITIES - EXAMPLES');
console.log('='.repeat(80));

// 1. Generate Shade Scale
console.log('\n1. SHADE SCALE GENERATION');
console.log('-'.repeat(80));
const primaryShades = generateShadeScale(samplePalette.primary);
console.log('Primary color shades (50-900):');
Object.entries(primaryShades).forEach(([shade, color]) => {
    console.log(`  ${shade}: ${color}`);
});

// 2. CSS Variables
console.log('\n2. CSS VARIABLES FORMAT');
console.log('-'.repeat(80));
const cssOutput = toCSSVariables(samplePalette);
console.log(cssOutput);

// 3. SCSS Variables
console.log('\n3. SCSS VARIABLES FORMAT');
console.log('-'.repeat(80));
const scssOutput = toSCSSVariables(samplePalette);
console.log(scssOutput);

// 4. React Theme
console.log('\n4. REACT THEME OBJECT');
console.log('-'.repeat(80));
const reactOutput = toReactTheme(samplePalette);
console.log(reactOutput);

// 5. JSON Export
console.log('\n5. JSON EXPORT');
console.log('-'.repeat(80));
const jsonOutput = toJSON(samplePalette);
console.log(jsonOutput);

// 6. Tailwind Config
console.log('\n6. TAILWIND CONFIG (with auto-generated shades)');
console.log('-'.repeat(80));
const tailwindOutput = toTailwindConfig(samplePalette);
console.log(tailwindOutput);

// 7. Advanced: Nested palette with pre-defined shades
console.log('\n7. ADVANCED: NESTED PALETTE WITH SHADES');
console.log('-'.repeat(80));
const advancedPalette = {
    brand: {
        DEFAULT: '#3b82f6',
        ...generateShadeScale('#3b82f6')
    },
    accent: {
        DEFAULT: '#f59e0b',
        ...generateShadeScale('#f59e0b')
    }
};

const advancedCss = toCSSVariables(advancedPalette);
console.log(advancedCss);

// 8. Lightness adjustment demo
console.log('\n8. LIGHTNESS ADJUSTMENT DEMO');
console.log('-'.repeat(80));
const baseColor = '#3b82f6';
console.log(`Base color: ${baseColor}`);
console.log(`Lighter (75% lightness): ${adjustLightness(baseColor, 75)}`);
console.log(`Normal (50% lightness): ${adjustLightness(baseColor, 50)}`);
console.log(`Darker (25% lightness): ${adjustLightness(baseColor, 25)}`);

console.log('\n' + '='.repeat(80));
console.log('END OF EXAMPLES');
console.log('='.repeat(80));
