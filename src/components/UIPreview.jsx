import React, { useState } from 'react';
import { Copy, Check, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModePreview from './preview/ModePreview';
import { hexToRgb } from '../utils/colorUtils';

const ColorInput = ({ label, value, onChange, description }) => {
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (e) => {
        const newValue = e.target.value.toUpperCase();
        setLocalValue(newValue);
        if (/^#[0-9A-F]{6}$/i.test(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-text text-sm font-semibold">{label}</label>
            <div className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-border shrink-0 shadow-sm">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer"
                    />
                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        value={localValue}
                        onChange={handleChange}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-text font-mono text-xs focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all uppercase"
                        maxLength={7}
                        placeholder="#000000"
                    />
                    {description && (
                        <p className="text-text-secondary text-xs mt-1">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ExportButton = ({ palette }) => {
    const [copied, setCopied] = useState(false);

    const handleExport = () => {
        const exportData = JSON.stringify(palette, null, 2);
        navigator.clipboard.writeText(exportData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors text-sm font-semibold"
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <Check size={16} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <Copy size={16} />
                    </motion.div>
                )}
            </AnimatePresence>
            {copied ? 'Copied!' : 'Export Palette'}
        </button>
    );
};

const UIPreview = () => {
    const [lightToggled, setLightToggled] = useState(false);
    const [darkToggled, setDarkToggled] = useState(true);

    // Default palette
    const [palette, setPalette] = useState({
        primary: '#3B82F6',
        secondary: '#9333EA',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#111827'
    });

    const updateColor = (key, value) => {
        setPalette(prev => ({ ...prev, [key]: value }));
    };

    // Generate light mode colors
    const lightColors = {
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        background: '#FFFFFF',
        cardBg: '#F9FAFB',
        navBg: '#FFFFFF',
        inputBg: '#FFFFFF',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB'
    };

    // Generate dark mode colors
    const darkColors = {
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        background: '#111827',
        cardBg: '#1F2937',
        navBg: '#1F2937',
        inputBg: '#374151',
        text: '#F9FAFB',
        textSecondary: '#D1D5DB',
        border: '#374151'
    };

    return (
        <div className="h-full space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text mb-2">UI Preview Mode</h2>
                <p className="text-text-secondary text-sm">
                    See how your color palette looks in real UI components with light and dark modes.
                </p>
            </div>

            {/* Color Palette Editor */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-xl border border-border space-y-4"
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Palette size={20} className="text-accent" />
                        <h3 className="text-text font-bold">Color Palette</h3>
                    </div>
                    <ExportButton palette={palette} />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ColorInput
                        label="Primary"
                        value={palette.primary}
                        onChange={(val) => updateColor('primary', val)}
                        description="Main brand color"
                    />
                    <ColorInput
                        label="Secondary"
                        value={palette.secondary}
                        onChange={(val) => updateColor('secondary', val)}
                        description="Secondary actions"
                    />
                    <ColorInput
                        label="Accent"
                        value={palette.accent}
                        onChange={(val) => updateColor('accent', val)}
                        description="Highlights & CTAs"
                    />
                </div>
            </motion.div>

            {/* Side-by-Side Preview */}
            <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-400px)] min-h-[600px]">
                {/* Light Mode Preview */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-xl border border-border overflow-hidden shadow-premium"
                >
                    <ModePreview
                        mode="light"
                        colors={lightColors}
                        isToggled={lightToggled}
                        onToggle={() => setLightToggled(!lightToggled)}
                    />
                </motion.div>

                {/* Dark Mode Preview */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel rounded-xl border border-border overflow-hidden shadow-premium"
                >
                    <ModePreview
                        mode="dark"
                        colors={darkColors}
                        isToggled={darkToggled}
                        onToggle={() => setDarkToggled(!darkToggled)}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default UIPreview;
