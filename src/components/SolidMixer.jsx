import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import ColorCard from './ColorCard';
import PreviewPanel from './PreviewPanel';
import { blendColors, hexToRgb, rgbToHsl } from '../utils/colorUtils';
import { motion, AnimatePresence } from 'framer-motion';

const SolidMixer = ({ colors: propsColors, setColors: propsSetColors }) => {
    // Helper to generate unique ID
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Use props if provided, otherwise use local state
    const [localColors, setLocalColors] = useState([{ id: '1', value: '#EF4444' }]);
    const colors = propsColors || localColors;
    const setColors = propsSetColors || setLocalColors;

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
        if (colors.length > 1) {
            const newColors = colors.filter((_, i) => i !== index);
            setColors(newColors);
        }
    };

    const blendedHex = useMemo(() => blendColors(colors.map(c => c.value)), [colors]);

    const blendedDetails = useMemo(() => {
        const rgb = hexToRgb(blendedHex);
        const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 0, s: 0, l: 0 };
        return {
            hex: blendedHex,
            rgb: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '',
            hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
        };
    }, [blendedHex]);

    return (
        <div className="grid lg:grid-cols-12 gap-8 h-full">
            <div className="lg:col-span-5 space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-200px)]">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text">Mix Colors</h2>
                    <span className="text-text-secondary text-sm">{colors.length} / 7</span>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {colors.map((colorObj, index) => (
                            <ColorCard
                                key={colorObj.id}
                                index={index}
                                color={colorObj.value}
                                onChange={handleColorChange}
                                onRemove={removeColor}
                                canRemove={colors.length > 1}
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
                        Add Color
                    </motion.button>
                )}
            </div>

            <div className="lg:col-span-7 sticky top-8">
                <PreviewPanel
                    color={blendedHex}
                    type="solid"
                    details={blendedDetails}
                />
            </div>
        </div>
    );
};

export default SolidMixer;
