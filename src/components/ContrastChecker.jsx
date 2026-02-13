import React, { useState, useMemo } from 'react';
import { AlertCircle, CheckCircle2, Copy, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ColorCard from './ColorCard';
import {
    getContrastRatio,
    formatContrastRatio,
    checkWCAGCompliance,
    getComplianceLevel,
    suggestAccessibleColor,
    getContrastDescription,
} from '../utils/wcagUtils';

const ComplianceBadge = ({ passed, label }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                passed
                    ? 'bg-success/10 border-success/40 text-success'
                    : 'bg-danger/10 border-danger/40 text-danger'
            }`}
        >
            {passed ? (
                <CheckCircle2 size={18} className="shrink-0" />
            ) : (
                <AlertCircle size={18} className="shrink-0" />
            )}
            <span className="font-semibold text-sm">{label}</span>
            <span className="text-xs opacity-75">{passed ? 'Pass' : 'Fail'}</span>
        </motion.div>
    );
};

const TextPreview = ({ foreground, background }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-xl border border-border space-y-4"
            style={{ backgroundColor: background }}
        >
            <h4 className="text-text font-bold text-sm mb-4" style={{ color: foreground }}>
                Live Text Preview
            </h4>
            <div className="space-y-4">
                <div>
                    <p className="text-text-secondary text-xs mb-1" style={{ color: foreground, opacity: 0.7 }}>
                        Normal Text (14-18px)
                    </p>
                    <p
                        className="text-base leading-relaxed"
                        style={{ color: foreground }}
                    >
                        The quick brown fox jumps over the lazy dog. This is normal body text that should be readable at standard font sizes.
                    </p>
                </div>
                <div>
                    <p className="text-text-secondary text-xs mb-1" style={{ color: foreground, opacity: 0.7 }}>
                        Large Text (18px+ or 14px+ bold)
                    </p>
                    <p
                        className="text-xl font-semibold leading-relaxed"
                        style={{ color: foreground }}
                    >
                        Large text has more relaxed contrast requirements. Headings and bold text benefit from good contrast.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const SuggestionCard = ({ color, ratio, level, label, onApply, onCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(color);
        setCopied(true);
        onCopy();
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                level === 'AAA'
                    ? 'border-success/40 bg-success/5 hover:bg-success/10'
                    : 'border-yellow-500/40 bg-yellow-500/5 hover:bg-yellow-500/10'
            }`}
            onClick={() => onApply(color)}
        >
            <div
                className="w-12 h-12 rounded-lg border-2 border-border shadow-sm shrink-0"
                style={{ backgroundColor: color }}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-mono text-text text-sm font-semibold">{color}</p>
                    <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                            level === 'AAA'
                                ? 'bg-success/20 text-success'
                                : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                        }`}
                    >
                        {level}
                    </span>
                </div>
                <p className="text-text-secondary text-xs">
                    {formatContrastRatio(ratio)} • {label}
                </p>
            </div>
            <div className="flex gap-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCopy();
                    }}
                    className="p-2 bg-secondary hover:bg-border text-text-secondary hover:text-text rounded-lg transition-colors"
                    aria-label="Copy color"
                >
                    <AnimatePresence mode='wait'>
                        {copied ? (
                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Check size={16} className="text-success" />
                            </motion.div>
                        ) : (
                            <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Copy size={16} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.div>
    );
};

const SuggestionsPanel = ({ suggestions, onApply }) => {
    const [copiedMessage, setCopiedMessage] = useState('');

    const handleCopy = () => {
        setCopiedMessage('Copied!');
        setTimeout(() => setCopiedMessage(''), 2000);
    };

    if (suggestions.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-5 rounded-xl border-2 border-accent/30 bg-accent/5 space-y-3"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent">
                    <Sparkles size={20} />
                    <h4 className="font-bold text-sm">Accessible Alternatives</h4>
                </div>
                {copiedMessage && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-success text-xs font-semibold"
                    >
                        {copiedMessage}
                    </motion.span>
                )}
            </div>

            <p className="text-text-secondary text-xs">
                Click on any suggestion to apply it to your foreground color
            </p>

            <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                    <SuggestionCard
                        key={index}
                        color={suggestion.color}
                        ratio={suggestion.ratio}
                        level={suggestion.level}
                        label={suggestion.label}
                        onApply={onApply}
                        onCopy={handleCopy}
                    />
                ))}
            </div>
        </motion.div>
    );
};

const ContrastChecker = () => {
    const [foreground, setForeground] = useState('#EF4444');
    const [background, setBackground] = useState('#FFFFFF');

    // Real-time calculations
    const contrastRatio = useMemo(
        () => getContrastRatio(foreground, background),
        [foreground, background]
    );

    const compliance = useMemo(
        () => checkWCAGCompliance(contrastRatio),
        [contrastRatio]
    );

    const complianceLevel = useMemo(
        () => getComplianceLevel(contrastRatio),
        [contrastRatio]
    );

    const description = useMemo(
        () => getContrastDescription(contrastRatio),
        [contrastRatio]
    );

    // Improved suggestion system with multiple options
    const suggestions = useMemo(() => {
        const suggestions = [];
        
        // Only suggest if not passing AA for normal text
        if (contrastRatio < 4.5) {
            // Suggest AA compliant option
            const aaColor = suggestAccessibleColor(foreground, background, 4.5);
            const aaRatio = getContrastRatio(aaColor, background);
            if (aaRatio >= 4.5 && aaColor !== foreground) {
                suggestions.push({
                    color: aaColor,
                    ratio: aaRatio,
                    level: aaRatio >= 7 ? 'AAA' : 'AA',
                    label: 'Meets AA standard'
                });
            }

            // Suggest AAA compliant option
            const aaaColor = suggestAccessibleColor(foreground, background, 7);
            const aaaRatio = getContrastRatio(aaaColor, background);
            if (aaaRatio >= 7 && aaaColor !== aaColor && aaaColor !== foreground) {
                suggestions.push({
                    color: aaaColor,
                    ratio: aaaRatio,
                    level: 'AAA',
                    label: 'Meets AAA standard'
                });
            }

            // Suggest pure white or black as fallback options
            const whiteRatio = getContrastRatio('#FFFFFF', background);
            const blackRatio = getContrastRatio('#000000', background);

            if (whiteRatio >= 4.5 && !suggestions.find(s => s.color === '#FFFFFF')) {
                suggestions.push({
                    color: '#FFFFFF',
                    ratio: whiteRatio,
                    level: whiteRatio >= 7 ? 'AAA' : 'AA',
                    label: 'Pure white'
                });
            }

            if (blackRatio >= 4.5 && !suggestions.find(s => s.color === '#000000')) {
                suggestions.push({
                    color: '#000000',
                    ratio: blackRatio,
                    level: blackRatio >= 7 ? 'AAA' : 'AA',
                    label: 'Pure black'
                });
            }
        }

        // Sort: AAA first, then by ratio descending
        return suggestions.sort((a, b) => {
            if (a.level === 'AAA' && b.level !== 'AAA') return -1;
            if (a.level !== 'AAA' && b.level === 'AAA') return 1;
            return b.ratio - a.ratio;
        }).slice(0, 4); // Limit to 4 suggestions
    }, [foreground, background, contrastRatio]);

    const handleApplySuggestion = (color) => {
        setForeground(color);
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-5 space-y-6 overflow-y-auto pr-2 max-h-[calc(100vh-200px)] custom-scrollbar">
                <div>
                    <h2 className="text-2xl font-bold text-text mb-2">WCAG Contrast Checker</h2>
                    <p className="text-text-secondary text-sm">
                        Check color contrast ratios and ensure your designs meet WCAG 2.1 accessibility standards.
                    </p>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-border space-y-6">
                    <ColorCard
                        color={foreground}
                        index={0}
                        onChange={(_, color) => setForeground(color)}
                        canRemove={false}
                        label="Foreground Color"
                        description="Text or element color"
                    />
                    
                    <div className="border-t border-border"></div>
                    
                    <ColorCard
                        color={background}
                        index={1}
                        onChange={(_, color) => setBackground(color)}
                        canRemove={false}
                        label="Background Color"
                        description="Background or surface color"
                    />
                </div>

                {/* Suggestions Panel */}
                <SuggestionsPanel
                    suggestions={suggestions}
                    onApply={handleApplySuggestion}
                />
            </div>

            {/* Results Section */}
            <div className="lg:col-span-7 space-y-6">
                {/* Contrast Ratio Display */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-8 rounded-2xl border border-border text-center space-y-4"
                >
                    <h3 className="text-text-secondary text-sm font-semibold uppercase tracking-wider">
                        Contrast Ratio
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                        <motion.div
                            key={contrastRatio}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-6xl font-bold text-text"
                        >
                            {formatContrastRatio(contrastRatio)}
                        </motion.div>
                    </div>
                    <motion.div
                        key={complianceLevel}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`inline-block px-6 py-2 rounded-full font-bold text-lg ${
                            complianceLevel === 'AAA'
                                ? 'bg-success/20 text-success'
                                : complianceLevel === 'AA'
                                ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                : 'bg-danger/20 text-danger'
                        }`}
                    >
                        {complianceLevel}
                    </motion.div>
                    <p className="text-text-secondary text-sm">{description}</p>
                </motion.div>

                {/* WCAG Compliance Grid */}
                <div className="glass-panel p-6 rounded-xl border border-border space-y-4">
                    <h3 className="text-text font-bold text-lg">WCAG 2.1 Compliance</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <p className="text-text-secondary text-xs mb-2 uppercase tracking-wider font-semibold">
                                Level AA
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3">
                                <ComplianceBadge
                                    passed={compliance.aa.normal}
                                    label="Normal Text"
                                />
                                <ComplianceBadge
                                    passed={compliance.aa.large}
                                    label="Large Text"
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-text-secondary text-xs mb-2 uppercase tracking-wider font-semibold">
                                Level AAA
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3">
                                <ComplianceBadge
                                    passed={compliance.aaa.normal}
                                    label="Normal Text"
                                />
                                <ComplianceBadge
                                    passed={compliance.aaa.large}
                                    label="Large Text"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <p className="text-text-secondary text-xs leading-relaxed">
                            <strong>Normal text:</strong> 4.5:1 (AA), 7:1 (AAA) &nbsp;|&nbsp; 
                            <strong>Large text:</strong> 3:1 (AA), 4.5:1 (AAA)
                        </p>
                    </div>
                </div>

                {/* Text Preview */}
                <TextPreview foreground={foreground} background={background} />
            </div>
        </div>
    );
};

export default ContrastChecker;
