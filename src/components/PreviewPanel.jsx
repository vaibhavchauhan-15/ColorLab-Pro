import React, { useState } from 'react';
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
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-accent/50 transition-colors group">
            <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">{label}</span>
                <span className="text-gray-800 dark:text-gray-200 font-mono text-sm truncate max-w-[200px]">{text}</span>
            </div>
            <button
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative"
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
                            <Check size={18} className="text-green-500 dark:text-green-400" />
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

const PreviewPanel = ({ color, type = 'solid', details = {} }) => {
    return (
        <div className="h-full flex flex-col gap-6">
            <motion.div
                className="flex-1 min-h-[300px] rounded-2xl shadow-2xl relative overflow-hidden border border-gray-200 dark:border-gray-700/50"
                style={{ background: color }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                {/* Optional: Add noise or texture overlay for premium feel */}
            </motion.div>

            <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
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
                        <CopyButton label="CSS" text={`background: ${color};`} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;
