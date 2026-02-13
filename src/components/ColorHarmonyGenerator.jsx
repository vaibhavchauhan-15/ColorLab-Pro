import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check, Info } from 'lucide-react';
import {
    generateComplementary,
    generateAnalogous,
    generateTriadic,
    generateTetradic,
    generateMonochromatic
} from '../utils/colorUtils';

const HarmonyCard = ({ title, description, colors, colorLabels, onCopy, copiedColor }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="glass-panel p-6 rounded-xl border border-border hover:border-accent/50 transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-text font-bold text-lg mb-1">{title}</h3>
                    <p className="text-text-secondary text-sm">{description}</p>
                </div>
                <Sparkles className="w-5 h-5 text-accent shrink-0" />
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {colors.map((color, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer"
                        onClick={() => onCopy(color, `${title}-${index}`)}
                    >
                        <div
                            className="h-24 rounded-lg shadow-md mb-2 border border-white/10"
                            style={{ backgroundColor: color }}
                        />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-xs">{colorLabels[index]}</p>
                                <p className="text-text font-mono text-xs font-semibold">{color}</p>
                            </div>
                            {copiedColor === `${title}-${index}` ? (
                                <Check className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4 text-text-secondary" />
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Color Strip */}
            <div className="flex rounded-lg overflow-hidden h-8">
                {colors.map((color, index) => (
                    <div
                        key={index}
                        className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: color }}
                        onClick={() => onCopy(color, `${title}-${index}`)}
                    />
                ))}
            </div>
        </motion.div>
    );
};

const ColorHarmonyGenerator = () => {
    const [baseColor, setBaseColor] = useState('#6366F1');
    const [copiedColor, setCopiedColor] = useState(null);

    const harmonies = useMemo(() => {
        const complementary = generateComplementary(baseColor);
        const analogous = generateAnalogous(baseColor);
        const triadic = generateTriadic(baseColor);
        const tetradic = generateTetradic(baseColor);
        const monochromatic = generateMonochromatic(baseColor);

        return {
            complementary: {
                title: 'Complementary',
                description: 'Opposite on color wheel - high contrast',
                colors: [complementary.base, complementary.complementary],
                labels: ['Base', 'Complement']
            },
            analogous: {
                title: 'Analogous',
                description: 'Adjacent colors - harmonious blend',
                colors: [analogous.left, analogous.base, analogous.right],
                labels: ['Left', 'Base', 'Right']
            },
            triadic: {
                title: 'Triadic',
                description: '120° apart - vibrant and balanced',
                colors: [triadic.base, triadic.second, triadic.third],
                labels: ['Base', 'Second', 'Third']
            },
            tetradic: {
                title: 'Tetradic (Square)',
                description: '90° apart - rich and diverse',
                colors: [tetradic.base, tetradic.second, tetradic.third, tetradic.fourth],
                labels: ['Base', 'Second', 'Third', 'Fourth']
            },
            monochromatic: {
                title: 'Monochromatic',
                description: 'Same hue, varied lightness',
                colors: [
                    monochromatic.darkest,
                    monochromatic.darker,
                    monochromatic.base,
                    monochromatic.lighter,
                    monochromatic.lightest
                ],
                labels: ['Darkest', 'Darker', 'Base', 'Lighter', 'Lightest']
            }
        };
    }, [baseColor]);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedColor(id);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const copyAllColors = (harmonyType) => {
        const harmony = harmonies[harmonyType];
        const colors = harmony.colors.join(', ');
        navigator.clipboard.writeText(colors);
        setCopiedColor(`all-${harmonyType}`);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-text mb-2">
                    Color Harmony Generator
                </h2>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Generate color harmonies using color wheel theory. 
                    Perfect for creating professional and balanced color schemes.
                </p>
            </div>

            {/* Color Picker */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-2xl border border-border max-w-2xl mx-auto"
            >
                <div className="flex items-center gap-6">
                    <div className="flex-1">
                        <label className="block text-text font-semibold mb-3">
                            Base Color
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="color"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="w-20 h-20 rounded-xl cursor-pointer border-2 border-border"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={baseColor}
                                    onChange={(e) => setBaseColor(e.target.value)}
                                    className="w-full bg-card/50 border border-border rounded-lg px-4 py-3 text-text font-mono text-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="#6366F1"
                                />
                                <p className="text-text-secondary text-xs mt-2">
                                    All harmonies are generated from this color
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Info Banner */}
            <div className="glass-panel p-4 rounded-xl border border-accent/30 bg-accent/5 max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div className="text-sm text-text-secondary">
                        <p className="font-semibold text-text mb-1">Using color wheel logic:</p>
                        <p>Harmonies are calculated using HSL color space for mathematically perfect color relationships.</p>
                    </div>
                </div>
            </div>

            {/* Harmony Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {Object.entries(harmonies).map(([key, harmony]) => (
                    <HarmonyCard
                        key={key}
                        title={harmony.title}
                        description={harmony.description}
                        colors={harmony.colors}
                        colorLabels={harmony.labels}
                        onCopy={copyToClipboard}
                        copiedColor={copiedColor}
                    />
                ))}
            </div>

            {/* Color Theory Info */}
            <div className="glass-panel p-6 rounded-2xl border border-border max-w-6xl mx-auto">
                <h3 className="text-text font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Color Theory Guide
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-text-secondary">
                    <div>
                        <h4 className="text-text font-semibold mb-2">When to use Complementary</h4>
                        <p>High contrast designs, call-to-action elements, bold statements</p>
                    </div>
                    <div>
                        <h4 className="text-text font-semibold mb-2">When to use Analogous</h4>
                        <p>Serene designs, nature themes, smooth color transitions</p>
                    </div>
                    <div>
                        <h4 className="text-text font-semibold mb-2">When to use Triadic</h4>
                        <p>Vibrant designs, playful interfaces, balanced variety</p>
                    </div>
                    <div>
                        <h4 className="text-text font-semibold mb-2">When to use Tetradic</h4>
                        <p>Rich designs, complex UIs, maximum variety with balance</p>
                    </div>
                    <div className="md:col-span-2">
                        <h4 className="text-text font-semibold mb-2">When to use Monochromatic</h4>
                        <p>Minimalist designs, professional look, easy hierarchy, consistent branding</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-3">
                {Object.keys(harmonies).map((key) => (
                    <motion.button
                        key={key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyAllColors(key)}
                        className="px-4 py-2 bg-card border border-border hover:border-accent text-text rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        {copiedColor === `all-${key}` ? (
                            <>
                                <Check className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy {harmonies[key].title}
                            </>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default ColorHarmonyGenerator;
