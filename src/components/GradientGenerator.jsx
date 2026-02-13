import React, { useState, useMemo } from 'react';
import { Plus, RotateCw, Zap, Copy, Check } from 'lucide-react';
import ColorCard from './ColorCard';
import PreviewPanel from './PreviewPanel';
import { generateGradientCSS, generateAnimatedGradientCSS } from '../utils/colorUtils';
import { motion, AnimatePresence } from 'framer-motion';

const GradientGenerator = ({ colors: propsColors, setColors: propsSetColors }) => {
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Use props if provided, otherwise use local state
    const [localColors, setLocalColors] = useState([
        { id: '1', value: '#8B5CF6' },
        { id: '2', value: '#EC4899' }
    ]);
    const colors = propsColors || localColors;
    const setColors = propsSetColors || setLocalColors;
    
    const [type, setType] = useState('linear');
    const [angle, setAngle] = useState(90);
    const [animated, setAnimated] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(3);
    const [copiedCode, setCopiedCode] = useState(false);

    const handleColorChange = (index, newValue) => {
        const newColors = [...colors];
        newColors[index].value = newValue;
        setColors(newColors);
    };

    const addColor = () => {
        if (colors.length < 7) {
            setColors([...colors, { id: generateId(), value: '#6366f1' }]);
        }
    };

    const removeColor = (index) => {
        if (colors.length > 2) {
            const newColors = colors.filter((_, i) => i !== index);
            setColors(newColors);
        }
    };

    const gradientCSS = useMemo(() => {
        if (animated) {
            const { css, keyframes } = generateAnimatedGradientCSS(
                colors.map(c => c.value), 
                angle, 
                animationSpeed
            );
            return { css, keyframes, animated: true };
        }
        return { css: generateGradientCSS(type, angle, colors.map(c => c.value)), animated: false };
    }, [colors, type, angle, animated, animationSpeed]);

    const copyAnimatedCode = () => {
        if (animated && gradientCSS.keyframes) {
            const fullCode = `${gradientCSS.keyframes}\n\n.animated-gradient {\n${gradientCSS.css}\n}`;
            navigator.clipboard.writeText(fullCode);
        } else {
            navigator.clipboard.writeText(`.gradient {\n  background: ${gradientCSS.css};\n}`);
        }
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 h-full">
            <div className="lg:col-span-5 space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-200px)]">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text">Design Gradient</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setType('linear')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${type === 'linear' ? 'bg-accent text-white' : 'bg-secondary text-text-secondary hover:text-text hover:bg-border'}`}
                        >
                            Linear
                        </button>
                        <button
                            onClick={() => setType('radial')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${type === 'radial' ? 'bg-accent text-white' : 'bg-secondary text-text-secondary hover:text-text hover:bg-border'}`}
                        >
                            Radial
                        </button>
                    </div>
                </div>

                {/* Animation Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card p-4 rounded-xl border border-border shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Zap className={`w-5 h-5 ${animated ? 'text-accent' : 'text-text-secondary'}`} />
                            <span className="text-text font-semibold">Animate Gradient</span>
                        </div>
                        <button
                            onClick={() => setAnimated(!animated)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${animated ? 'bg-accent' : 'bg-secondary'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${animated ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                    
                    <AnimatePresence>
                        {animated && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3 pt-3 border-t border-border"
                            >
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Animation Speed</span>
                                    <span className="text-text font-semibold">{animationSpeed}s</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="0.5"
                                    value={animationSpeed}
                                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                                />
                                <p className="text-xs text-text-secondary">
                                    {animationSpeed < 3 ? '⚡ Fast' : animationSpeed < 6 ? '🎯 Medium' : '🐌 Slow'} animation
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {type === 'linear' && (
                    <div className="bg-card p-4 rounded-xl border border-border space-y-2 shadow-sm">
                        <div className="flex justify-between text-sm text-text-secondary">
                            <span>Angle</span>
                            <span>{angle}°</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={angle}
                            onChange={(e) => setAngle(Number(e.target.value))}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                    </div>
                )}

                {/* Copy Code Button */}
                {animated && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyAnimatedCode}
                        className="w-full py-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {copiedCode ? (
                            <>
                                <Check size={18} />
                                Copied CSS + Keyframes!
                            </>
                        ) : (
                            <>
                                <Copy size={18} />
                                Copy Animation Code
                            </>
                        )}
                    </motion.button>
                )}

                <div className="space-y-4">
                    <AnimatePresence>
                        {colors.map((colorObj, index) => (
                            <ColorCard
                                key={colorObj.id}
                                index={index}
                                color={colorObj.value}
                                onChange={handleColorChange}
                                onRemove={removeColor}
                                canRemove={colors.length > 2}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {colors.length < 7 && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addColor}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-border text-text-secondary hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2 font-medium bg-transparent"
                    >
                        <Plus size={20} />
                        Add Stop
                    </motion.button>
                )}
            </div>

            <div className="lg:col-span-7 sticky top-8">
                <PreviewPanel
                    color={gradientCSS.animated ? gradientCSS.css : gradientCSS}
                    type="gradient"
                    animated={gradientCSS.animated}
                    animationKeyframes={gradientCSS.keyframes}
                />
            </div>
        </div>
    );
};

export default GradientGenerator;
