import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Palette, Copy, Check, Info } from 'lucide-react';
import { generateColorScale } from '../utils/colorUtils';
import ColorCard from './ColorCard';

const ColorScaleGenerator = () => {
    const [baseColor, setBaseColor] = useState('#6366F1');
    const [copiedScale, setCopiedScale] = useState(null);

    const colorScale = useMemo(() => {
        return generateColorScale(baseColor);
    }, [baseColor]);

    const copyToClipboard = (text, scale) => {
        navigator.clipboard.writeText(text);
        setCopiedScale(scale);
        setTimeout(() => setCopiedScale(null), 2000);
    };

    const copyAllAsCSS = () => {
        const css = Object.entries(colorScale)
            .map(([scale, color]) => `  --color-${scale}: ${color};`)
            .join('\n');
        
        const fullCSS = `:root {\n${css}\n}`;
        navigator.clipboard.writeText(fullCSS);
        setCopiedScale('all');
        setTimeout(() => setCopiedScale(null), 2000);
    };

    const copyAllAsTailwind = () => {
        const config = `colors: {
  primary: {
${Object.entries(colorScale)
    .map(([scale, color]) => `    ${scale}: '${color}',`)
    .join('\n')}
  }
}`;
        navigator.clipboard.writeText(config);
        setCopiedScale('tailwind');
        setTimeout(() => setCopiedScale(null), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-text mb-2">
                    Color Scale Generator
                </h2>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Generate a complete 50-900 color scale from any base color. 
                    Perfect for design systems and Tailwind CSS configurations.
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
                            Base Color (500)
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
                                    This will be your 500 shade
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
                        <p className="font-semibold text-text mb-1">How it works:</p>
                        <p>The scale lightens toward 50 and darkens toward 900 while maintaining color harmony using HSL manipulation.</p>
                    </div>
                </div>
            </div>

            {/* Export Buttons */}
            <div className="flex justify-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyAllAsCSS}
                    className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    {copiedScale === 'all' ? (
                        <>
                            <Check className="w-4 h-4" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy CSS Variables
                        </>
                    )}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyAllAsTailwind}
                    className="px-6 py-3 bg-card border border-border hover:border-accent text-text rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    {copiedScale === 'tailwind' ? (
                        <>
                            <Check className="w-4 h-4" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy Tailwind Config
                        </>
                    )}
                </motion.button>
            </div>

            {/* Color Scale Display */}
            <div className="grid gap-3 max-w-4xl mx-auto">
                {Object.entries(colorScale).map(([scale, color], index) => (
                    <motion.div
                        key={scale}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                    >
                        <div className="glass-panel rounded-xl border border-border overflow-hidden hover:border-accent/50 transition-all">
                            <div className="flex items-stretch">
                                {/* Color Preview */}
                                <div
                                    className="w-32 transition-all group-hover:w-40"
                                    style={{ backgroundColor: color }}
                                />
                                
                                {/* Scale Info */}
                                <div className="flex-1 p-4 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-text font-bold text-lg">
                                                {scale}
                                            </span>
                                            {scale === '500' && (
                                                <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-semibold rounded">
                                                    BASE
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-text font-mono text-sm">
                                            {color}
                                        </span>
                                    </div>
                                    
                                    {/* Copy Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => copyToClipboard(color, scale)}
                                        className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                                    >
                                        {copiedScale === scale ? (
                                            <Check className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-text-secondary" />
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Visual Scale Preview */}
            <div className="max-w-4xl mx-auto">
                <h3 className="text-text font-semibold mb-4 text-center">Visual Scale</h3>
                <div className="flex rounded-2xl overflow-hidden shadow-2xl border border-border">
                    {Object.entries(colorScale).map(([scale, color]) => (
                        <div
                            key={scale}
                            className="flex-1 h-24 relative group cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => copyToClipboard(color, scale)}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                <span className="text-white font-bold text-sm">{scale}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Usage Example */}
            <div className="glass-panel p-6 rounded-2xl border border-border max-w-4xl mx-auto">
                <h3 className="text-text font-semibold mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-accent" />
                    Usage Example
                </h3>
                <div className="bg-card/50 rounded-lg p-4 font-mono text-sm text-text-secondary">
                    <pre className="whitespace-pre-wrap">
{`// Tailwind CSS
<div className="bg-primary-500 hover:bg-primary-600">
  <h1 className="text-primary-900">Heading</h1>
  <p className="text-primary-700">Content</p>
</div>

// CSS Variables
.button {
  background: var(--color-500);
  border: 1px solid var(--color-700);
}`}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default ColorScaleGenerator;
