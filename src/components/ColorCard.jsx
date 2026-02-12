import React, { useState } from 'react';

// React-colorful is better but user didn't ask for it explicitly, "Color picker" usually implies input type="color" or library.
// PRD says "Dynamic color picker inputs".
// I'll stick to input type="color" for now to avoid extra deps unless requested, or use native.
// Wait, prompt said "Use your generate_image tool...".
// I'll use standard HTML5 color input for simplicity and performance as requested "Avoid heavy libraries".

import { Trash2, GripVertical } from 'lucide-react';
import { hexToRgb, rgbToHex } from '../utils/colorUtils';
import { motion } from 'framer-motion';

const ColorCard = ({ color, index, onChange, onRemove, canRemove }) => {
    const [localHex, setLocalHex] = useState(color);
    const [rgb, setRgb] = useState(hexToRgb(color) || { r: 0, g: 0, b: 0 });

    const [prevColor, setPrevColor] = useState(color);

    if (color !== prevColor) {
        setLocalHex(color);
        const newRgb = hexToRgb(color);
        if (newRgb) setRgb(newRgb);
        setPrevColor(color);
    }

    const handleHexChange = (e) => {
        const val = e.target.value;
        setLocalHex(val);
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            onChange(index, val);
        }
    };

    const handleRgbChange = (channel, value) => {
        const newRgb = { ...rgb, [channel]: parseInt(value) };
        setRgb(newRgb);
        onChange(index, rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-4 rounded-xl shadow-premium border border-border flex flex-col gap-4 relative group"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-sm font-medium">Color {index + 1}</span>
                {canRemove && (
                    <button
                        onClick={() => onRemove(index)}
                        className="text-text-secondary hover:text-red-500 transition-colors p-1 rounded-md hover:bg-secondary"
                        aria-label="Remove color"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0 relative shadow-sm">
                    <input
                        type="color"
                        value={localHex.length === 7 ? localHex : "#000000"}
                        onChange={(e) => onChange(index, e.target.value)}
                        className="absolute -top-2 -left-2 w-24 h-24 cursor-pointer p-0 border-0"
                    />
                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        value={localHex}
                        onChange={handleHexChange}
                        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-text font-mono text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none uppercase transition-colors"
                        maxLength={7}
                    />
                </div>
            </div>

            <div className="space-y-3">
                {['r', 'g', 'b'].map((channel) => (
                    <div key={channel} className="flex items-center gap-3">
                        <span className="text-text-secondary w-4 uppercase text-xs font-bold">{channel}</span>
                        <input
                            type="range"
                            min="0"
                            max="255"
                            value={rgb[channel]}
                            onChange={(e) => handleRgbChange(channel, e.target.value)}
                            className="flex-1 h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                        <span className="text-text-secondary w-8 text-right text-xs font-mono">{rgb[channel]}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ColorCard;
