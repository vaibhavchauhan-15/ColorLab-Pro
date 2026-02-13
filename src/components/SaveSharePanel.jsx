import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link, Check, Save, Clock } from 'lucide-react';
import { generateShareableLink, saveToRecentPalettes, getRecentPalettes } from '../utils/urlStateUtils';

const SaveSharePanel = ({ state, onLoadPalette }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [recentPalettes, setRecentPalettes] = useState(getRecentPalettes(5));

    const handleShare = () => {
        const link = generateShareableLink(state);
        setShareLink(link);
        setShowShareModal(true);
    };

    const copyShareLink = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = () => {
        saveToRecentPalettes({
            solidColors: state.solidColors,
            gradientColors: state.gradientColors,
            activeTab: state.activeTab
        });
        setRecentPalettes(getRecentPalettes(5));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const loadRecentPalette = (palette) => {
        if (onLoadPalette) {
            onLoadPalette(palette);
        }
    };

    return (
        <>
            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="px-6 py-3 bg-card border border-border hover:border-accent text-text rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    {saved ? (
                        <>
                            <Check className="w-4 h-4 text-green-400" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Palette
                        </>
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Share2 className="w-4 h-4" />
                    Share Palette
                </motion.button>
            </div>

            {/* Recent Palettes */}
            {recentPalettes.length > 0 && (
                <div className="glass-panel p-6 rounded-xl border border-border max-w-2xl mx-auto">
                    <h3 className="text-text font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-accent" />
                        Recent Palettes
                    </h3>
                    <div className="space-y-2">
                        {recentPalettes.map((palette, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => loadRecentPalette(palette)}
                                className="w-full flex items-center gap-3 p-3 bg-card/50 hover:bg-card rounded-lg border border-border hover:border-accent/50 transition-all text-left"
                            >
                                <div className="flex gap-1">
                                    {palette.solidColors?.slice(0, 5).map((color, i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded"
                                            style={{ backgroundColor: color.value }}
                                        />
                                    ))}
                                </div>
                                <div className="flex-1">
                                    <p className="text-text text-sm font-medium">
                                        {palette.solidColors?.length || 0} colors
                                    </p>
                                    <p className="text-text-secondary text-xs">
                                        {new Date(palette.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={() => setShowShareModal(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={() => setShowShareModal(false)}
                        >
                            <div
                                className="glass-panel p-8 rounded-2xl border border-border max-w-lg w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <Share2 className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="text-text text-xl font-bold">Share Your Palette</h3>
                                        <p className="text-text-secondary text-sm">
                                            Copy the link below to share
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-card/50 border border-border rounded-lg p-4 mb-4">
                                    <p className="text-text-secondary text-xs mb-2">Shareable Link</p>
                                    <p className="text-text font-mono text-sm break-all">
                                        {shareLink}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={copyShareLink}
                                        className="flex-1 px-4 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Link className="w-4 h-4" />
                                                Copy Link
                                            </>
                                        )}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowShareModal(false)}
                                        className="px-4 py-3 bg-card border border-border hover:border-accent text-text rounded-lg font-medium transition-colors"
                                    >
                                        Close
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default SaveSharePanel;
