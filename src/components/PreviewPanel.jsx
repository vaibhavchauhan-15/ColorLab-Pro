import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CopyButton = ({ text, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between bg-secondary p-3 rounded-lg border border-border hover:border-accent/50 transition-colors group">
            <div className="flex flex-col">
                <span className="text-text-secondary text-xs uppercase font-semibold">{label}</span>
                <span className="text-text font-mono text-sm truncate max-w-[200px]">{text}</span>
            </div>
            <button
                onClick={handleCopy}
                className="p-2 text-text-secondary hover:text-text transition-colors relative"
                aria-label="Copy to clipboard"
            >
                <AnimatePresence mode='wait'>
                    {copied ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Check size={18} className="text-success" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <Copy size={18} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
};

const PreviewPanel = ({ color, type = 'solid', details = {}, animated = false, animationKeyframes = '', animationSpeed = 3 }) => {
    const styleRef = useRef(null);
    const animationId = useRef(`gradientAnim_${Math.random().toString(36).substr(2, 9)}`).current;

    // Inject keyframes into document
    useEffect(() => {
        if (animated && animationKeyframes) {
            // Remove existing style if present
            if (styleRef.current) {
                styleRef.current.remove();
            }

            // Create and inject new style element
            const styleElement = document.createElement('style');
            const keyframesWithId = animationKeyframes.replace('gradientAnimation', animationId);
            styleElement.textContent = keyframesWithId;
            document.head.appendChild(styleElement);
            styleRef.current = styleElement;

            return () => {
                if (styleRef.current) {
                    styleRef.current.remove();
                    styleRef.current = null;
                }
            };
        }
    }, [animated, animationKeyframes, animationId]);

    // Create a style object for animated gradients
    const previewStyle = animated ? (() => {
        // Parse the CSS string to extract the background value
        let backgroundValue = color;
        const bgMatch = color.match(/background:\s*([^;]+);/);
        if (bgMatch) {
            backgroundValue = bgMatch[1].trim();
        }
        
        return {
            background: backgroundValue,
            backgroundSize: '200% 200%',
            animation: `${animationId} ${animationSpeed}s ease infinite`,
            willChange: 'background-position',
            transform: 'translateZ(0)', // Force hardware acceleration
            backfaceVisibility: 'hidden'
        };
    })() : {
        background: color
    };

    // Format CSS for export
    const exportCSS = animated ? (() => {
        // Extract just the background line for the export button display
        const bgMatch = color.match(/background:\s*([^;]+);/);
        if (bgMatch) {
            return `background: ${bgMatch[1].trim()};`;
        }
        return color;
    })() : `background: ${color};`;

    return (
        <div className="h-full flex flex-col gap-6">
            <motion.div
                className={`flex-1 min-h-[300px] rounded-2xl shadow-2xl relative overflow-hidden border border-border ${animated ? 'gradient-animated' : ''}`}
                style={previewStyle}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                {animated && (
                    <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <span className="animate-pulse">●</span> Animated
                    </div>
                )}
            </motion.div>

            <div className="glass-panel p-6 rounded-2xl shadow-xl border border-border space-y-4">
                <h3 className="text-xl font-bold text-text flex items-center gap-2">
                    <Code size={20} className="text-accent" />
                    Export Code
                </h3>

                <div className="grid gap-3">
                    {type === 'solid' ? (
                        <>
                            <CopyButton label="HEX" text={details.hex || color} />
                            <CopyButton label="RGB" text={details.rgb} />
                            <CopyButton label="HSL" text={details.hsl} />
                        </>
                    ) : (
                        <CopyButton label="CSS" text={exportCSS} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;
