import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import ColorCard from './ColorCard';
import PreviewPanel from './PreviewPanel';
import { blendColors, hexToRgb, rgbToHsl } from '../utils/colorUtils';
import { motion, AnimatePresence } from 'framer-motion';

const SolidMixer = () => {
    // Helper to generate unique ID
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const [colors, setColors] = useState([
        { id: '1', value: '#EF4444' },
        { id: '2', value: '#3B82F6' }
    ]);

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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mix Colors</h2>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{colors.length} / 7</span>
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
                                canRemove={colors.length > 1} // PRD says 1 color -> RGB blend. So min 1?
                            // PRD: "Remove button (except required minimum)"
                            // And "1 color -> RGB output". So min 1 is allowed.
                            // Actually "2 colors -> blended". "1 color -> RGB blend -> final".
                            // So 1 color is just a color converter/picker.
                            // I'll allow removing down to 1.
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {colors.length < 7 && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addColor}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2 font-medium bg-transparent"
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
