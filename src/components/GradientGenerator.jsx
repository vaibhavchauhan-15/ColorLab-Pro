import React, { useState, useMemo } from 'react';
import { Plus, RotateCw } from 'lucide-react';
import ColorCard from './ColorCard';
import PreviewPanel from './PreviewPanel';
import { generateGradientCSS } from '../utils/colorUtils';
import { motion, AnimatePresence } from 'framer-motion';

const GradientGenerator = () => {
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const [colors, setColors] = useState([
        { id: '1', value: '#8B5CF6' },
        { id: '2', value: '#EC4899' }
    ]);
    const [type, setType] = useState('linear');
    const [angle, setAngle] = useState(90);

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
        return generateGradientCSS(type, angle, colors.map(c => c.value));
    }, [colors, type, angle]);

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
                    color={gradientCSS}
                    type="gradient"
                />
            </div>
        </div>
    );
};

export default GradientGenerator;
