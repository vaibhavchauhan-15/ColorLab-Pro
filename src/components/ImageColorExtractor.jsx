import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Loader2, Copy, Check, X } from 'lucide-react';
import { extractColorsFromImage } from '../utils/colorUtils';
import ColorCard from './ColorCard';

const ImageColorExtractor = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [extractedColors, setExtractedColors] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);

            // Extract colors
            const { dominant, palette } = await extractColorsFromImage(file, 10);
            
            setExtractedColors({
                dominant,
                palette: palette.filter(color => color !== dominant).slice(0, 5)
            });
        } catch (err) {
            setError('Failed to extract colors from image');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            const fakeEvent = { target: { files: [file] } };
            handleFileSelect(fakeEvent);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const copyToClipboard = (color, index) => {
        navigator.clipboard.writeText(color);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const clearImage = () => {
        setImagePreview(null);
        setExtractedColors(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-text mb-2">Extract Colors from Image</h2>
                    <p className="text-text-secondary text-sm">
                        Upload an image to extract dominant and palette colors
                    </p>
                </div>

                {/* Upload Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 rounded-2xl border-2 border-dashed border-border hover:border-accent/50 transition-colors cursor-pointer relative"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                            <p className="text-text-secondary">Extracting colors...</p>
                        </div>
                    ) : imagePreview ? (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearImage();
                                }}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="bg-accent/10 p-4 rounded-full mb-4">
                                <Upload className="w-8 h-8 text-accent" />
                            </div>
                            <h3 className="text-text font-semibold mb-2">Upload Image</h3>
                            <p className="text-text-secondary text-sm text-center">
                                Click to browse or drag and drop
                            </p>
                            <p className="text-text-secondary text-xs mt-2">
                                PNG, JPG, WebP (max 5MB)
                            </p>
                        </div>
                    )}
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Info */}
                <div className="glass-panel p-4 rounded-lg border border-border">
                    <h3 className="text-text font-semibold mb-2 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-accent" />
                        How it works
                    </h3>
                    <ul className="text-text-secondary text-sm space-y-1">
                        <li>• Canvas API samples image pixels</li>
                        <li>• No external libraries or APIs</li>
                        <li>• Fast local processing</li>
                        <li>• Extracts dominant + top 5 colors</li>
                    </ul>
                </div>
            </div>

            {/* Results Area */}
            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    {extractedColors ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Dominant Color */}
                            <div>
                                <h3 className="text-lg font-semibold text-text mb-4">
                                    Dominant Color
                                </h3>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="glass-panel p-6 rounded-xl border border-border cursor-pointer"
                                    onClick={() => copyToClipboard(extractedColors.dominant, 'dominant')}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-20 h-20 rounded-xl shadow-lg"
                                            style={{ backgroundColor: extractedColors.dominant }}
                                        />
                                        <div className="flex-1">
                                            <p className="text-text font-mono text-xl font-bold">
                                                {extractedColors.dominant}
                                            </p>
                                            <p className="text-text-secondary text-sm mt-1">
                                                Most frequent color
                                            </p>
                                        </div>
                                        {copiedIndex === 'dominant' ? (
                                            <Check className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-text-secondary" />
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Color Palette */}
                            <div>
                                <h3 className="text-lg font-semibold text-text mb-4">
                                    Color Palette
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {extractedColors.palette.map((color, index) => (
                                        <motion.div
                                            key={color}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            className="glass-panel p-4 rounded-xl border border-border cursor-pointer"
                                            onClick={() => copyToClipboard(color, index)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-14 h-14 rounded-lg shadow-md"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <div className="flex-1">
                                                    <p className="text-text font-mono font-semibold">
                                                        {color}
                                                    </p>
                                                    <p className="text-text-secondary text-xs">
                                                        #{index + 1} in palette
                                                    </p>
                                                </div>
                                                {copiedIndex === index ? (
                                                    <Check className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-text-secondary" />
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Color Swatches - All together */}
                            <div className="glass-panel p-4 rounded-xl border border-border">
                                <h4 className="text-text text-sm font-semibold mb-3">Quick View</h4>
                                <div className="flex gap-2">
                                    <div
                                        className="flex-1 h-16 rounded-lg shadow-md border-2 border-white/10"
                                        style={{ backgroundColor: extractedColors.dominant }}
                                        title={extractedColors.dominant}
                                    />
                                    {extractedColors.palette.map((color) => (
                                        <div
                                            key={color}
                                            className="flex-1 h-16 rounded-lg shadow-md"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-panel p-12 rounded-2xl border border-border flex flex-col items-center justify-center text-center h-full"
                        >
                            <div className="bg-accent/10 p-6 rounded-full mb-4">
                                <ImageIcon className="w-12 h-12 text-accent" />
                            </div>
                            <h3 className="text-text text-lg font-semibold mb-2">
                                No Image Selected
                            </h3>
                            <p className="text-text-secondary text-sm max-w-sm">
                                Upload an image to extract its color palette. Colors will appear here.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ImageColorExtractor;
