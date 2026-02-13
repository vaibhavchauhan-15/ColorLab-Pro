import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, X, Edit2, Download, Settings2, ChevronDown, ChevronUp, Search, Maximize2, Minimize2, CheckSquare, Square } from 'lucide-react';
import {
    generateCSSVariables,
    generateSCSSVariables,
    generateReactTheme,
    generateJSON,
    generateTailwindConfig,
    generateShadeScale,
    copyToClipboard
} from '../utils/exportUtils';

const Toast = memo(({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
        >
            <Check className="w-5 h-5" />
            <span className="font-medium">{message}</span>
            <button
                onClick={onClose}
                className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
});

const ExportPanel = ({ palette = {} }) => {
    const [activeFormat, setActiveFormat] = useState('css');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [generatedPalette, setGeneratedPalette] = useState(palette);
    const [colorNames, setColorNames] = useState({});
    const [editingColor, setEditingColor] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [copied, setCopied] = useState(false);
    
    // Settings
    const [caseFormat, setCaseFormat] = useState('kebab-case');
    const [exportScope, setExportScope] = useState('full'); // 'full' or 'primary'
    const [showSettings, setShowSettings] = useState(false);
    
    // New features
    const [expandedColors, setExpandedColors] = useState({});
    const [compactView, setCompactView] = useState(true); // Start with compact view
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedColors, setSelectedColors] = useState(new Set());
    const [useSelection, setUseSelection] = useState(false);

    // Generate enhanced palette with shade scales - OPTIMIZED with useMemo
    const enhancedPalette = useMemo(() => {
        const enhanced = {};
        for (const [name, value] of Object.entries(palette)) {
            if (typeof value === 'string' && value.startsWith('#')) {
                enhanced[name] = {
                    DEFAULT: value,
                    ...generateShadeScale(value)
                };
            } else {
                enhanced[name] = value;
            }
        }
        return enhanced;
    }, [palette]);

    // Update state when palette changes
    useEffect(() => {
        setGeneratedPalette(enhancedPalette);
        
        setColorNames(prevNames => {
            const names = { ...prevNames };
            Object.keys(palette).forEach(key => {
                if (!names[key]) {
                    names[key] = key;
                }
            });
            return names;
        });
        
        // Initialize colors as collapsed by default for better UX (expand first 3)
        const expanded = {};
        Object.keys(palette).forEach((key, index) => {
            expanded[key] = index < 3; // Only expand first 3 colors
        });
        setExpandedColors(expanded);
        
        // Initialize all colors as selected
        setSelectedColors(new Set(Object.keys(palette)));
    }, [enhancedPalette, palette]);
    
    // Filtered palette based on search - MUST be defined before callbacks that use it
    const filteredPalette = useMemo(() => {
        if (!searchQuery.trim()) return generatedPalette;
        
        const query = searchQuery.toLowerCase();
        const filtered = {};
        
        for (const [name, value] of Object.entries(generatedPalette)) {
            const displayName = (colorNames[name] || name).toLowerCase();
            if (displayName.includes(query)) {
                filtered[name] = value;
            }
        }
        
        return filtered;
    }, [generatedPalette, searchQuery, colorNames]);
    
    // Helper functions for new features
    const toggleColorExpanded = useCallback((colorName) => {
        setExpandedColors(prev => ({
            ...prev,
            [colorName]: !prev[colorName]
        }));
    }, []);
    
    const toggleColorSelection = useCallback((colorName) => {
        setSelectedColors(prev => {
            const newSet = new Set(prev);
            if (newSet.has(colorName)) {
                newSet.delete(colorName);
            } else {
                newSet.add(colorName);
            }
            return newSet;
        });
    }, []);
    
    const toggleAllColors = useCallback(() => {
        const allKeys = Object.keys(filteredPalette);
        if (selectedColors.size === allKeys.length) {
            setSelectedColors(new Set());
        } else {
            setSelectedColors(new Set(allKeys));
        }
    }, [filteredPalette, selectedColors.size]);
    
    const expandAllColors = useCallback(() => {
        const expanded = {};
        Object.keys(filteredPalette).forEach(key => {
            expanded[key] = true;
        });
        setExpandedColors(expanded);
    }, [filteredPalette]);
    
    const collapseAllColors = useCallback(() => {
        const collapsed = {};
        Object.keys(filteredPalette).forEach(key => {
            collapsed[key] = false;
        });
        setExpandedColors(collapsed);
    }, [filteredPalette]);
    
    const copyColorValue = useCallback(async (value) => {
        const success = await copyToClipboard(value);
        if (success) {
            setToastMessage(`Copied ${value}`);
            setShowToast(true);
        }
    }, []);

    const handleRenameColor = useCallback((oldName) => {
        setEditingColor(oldName);
        setEditValue(colorNames[oldName] || oldName);
    }, [colorNames]);

    const saveColorName = useCallback(() => {
        if (editingColor && editValue.trim()) {
            const newNames = { ...colorNames, [editingColor]: editValue.trim() };
            setColorNames(newNames);
            
            const updated = {};
            Object.entries(generatedPalette).forEach(([key, value]) => {
                const newKey = key === editingColor ? editValue.trim() : (colorNames[key] || key);
                updated[newKey] = value;
            });
            setGeneratedPalette(updated);
        }
        setEditingColor(null);
        setEditValue('');
    }, [editingColor, editValue, colorNames, generatedPalette]);

    const cancelEdit = useCallback(() => {
        setEditingColor(null);
        setEditValue('');
    }, []);

    const formats = [
        { id: 'css', label: 'CSS Variables', generator: generateCSSVariables },
        { id: 'scss', label: 'SCSS Variables', generator: generateSCSSVariables },
        { id: 'react', label: 'React Theme', generator: generateReactTheme },
        { id: 'json', label: 'JSON', generator: generateJSON },
        { id: 'tailwind', label: 'Tailwind Config', generator: generateTailwindConfig }
    ];

    // Get palette based on export scope - OPTIMIZED with useMemo
    const exportPalette = useMemo(() => {
        let basePalette = generatedPalette;
        
        // Apply selection filter if enabled
        if (useSelection && selectedColors.size > 0) {
            basePalette = {};
            for (const key of selectedColors) {
                if (generatedPalette[key]) {
                    basePalette[key] = generatedPalette[key];
                }
            }
        }
        
        // Apply scope filter
        if (exportScope === 'primary' && Object.keys(basePalette).length > 0) {
            const firstKey = Object.keys(basePalette)[0];
            return { [firstKey]: basePalette[firstKey] };
        }
        
        return basePalette;
    }, [generatedPalette, exportScope, useSelection, selectedColors]);

    // Generate output - OPTIMIZED with useMemo
    const output = useMemo(() => {
        const currentFormat = formats.find(f => f.id === activeFormat);
        return currentFormat ? currentFormat.generator(exportPalette, caseFormat) : '';
    }, [activeFormat, exportPalette, caseFormat, formats]);

    const handleCopy = async () => {
        const success = await copyToClipboard(output);
        if (success) {
            setCopied(true);
            setToastMessage('Copied to clipboard!');
            setShowToast(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const extensions = {
            css: 'css',
            scss: 'scss',
            react: 'js',
            json: 'json',
            tailwind: 'js'
        };
        
        a.download = `palette.${extensions[activeFormat]}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="glass-panel p-6 rounded-2xl shadow-premium border border-border">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text">Export Palette</h2>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-accent text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    title="Export settings"
                >
                    <Settings2 className="w-5 h-5" />
                </button>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-4">
                            {/* Case Format */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Case Format
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {['kebab-case', 'camelCase', 'snake_case'].map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => setCaseFormat(format)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
                                                caseFormat === format
                                                    ? 'bg-accent text-white'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                        >
                                            {format}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Export Scope */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Export Scope
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setExportScope('full')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            exportScope === 'full'
                                                ? 'bg-accent text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        Full Palette
                                    </button>
                                    <button
                                        onClick={() => setExportScope('primary')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            exportScope === 'primary'
                                                ? 'bg-accent text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        Primary Only
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Quick Export Actions */}
            <div className="mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-300">Quick Export</h3>
                    <span className="text-xs text-gray-500">
                        {useSelection ? `${selectedColors.size} selected` : 'All colors'}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formats.map((format) => (
                        <button
                            key={format.id}
                            onClick={async () => {
                                const code = format.generator(exportPalette, caseFormat);
                                const success = await copyToClipboard(code);
                                if (success) {
                                    setToastMessage(`Copied ${format.label}!`);
                                    setShowToast(true);
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-all hover:shadow-md group"
                            title={`Copy as ${format.label}`}
                        >
                            <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            <span>{format.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Palette Preview */}
            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h3 className="text-lg font-semibold text-text">Color Palette Preview</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCompactView(!compactView)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
                            title={compactView ? 'Expand view' : 'Compact view'}
                        >
                            {compactView ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                            <span className="hidden sm:inline">{compactView ? 'Expand' : 'Compact'}</span>
                        </button>
                        <button
                            onClick={() => setUseSelection(!useSelection)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                                useSelection
                                    ? 'bg-accent text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                            title="Export selected colors only"
                        >
                            {useSelection ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                            <span className="hidden sm:inline">Select</span>
                        </button>
                        <span className="text-sm text-gray-400">
                            {useSelection ? `${selectedColors.size}/` : ''}{Object.keys(palette).length} colors
                        </span>
                    </div>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search colors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                
                {/* Select All/None for selection mode */}
                {useSelection && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleAllColors}
                            className="text-sm text-accent hover:text-accent/80 transition-colors"
                        >
                            {selectedColors.size === Object.keys(filteredPalette).length ? 'Deselect All' : 'Select All'}
                        </button>
                        {selectedColors.size > 0 && selectedColors.size < Object.keys(filteredPalette).length && (
                            <span className="text-xs text-gray-500">
                                ({selectedColors.size} selected)
                            </span>
                        )}
                    </div>
                )}
                
                {/* Expand/Collapse All for non-compact view */}
                {!compactView && Object.keys(filteredPalette).length > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={expandAllColors}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Expand All
                        </button>
                        <span className="text-gray-600">|</span>
                        <button
                            onClick={collapseAllColors}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Collapse All
                        </button>
                    </div>
                )}
                
                {/* Color List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {Object.keys(filteredPalette).length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            No colors match your search
                        </div>
                    ) : (
                        Object.entries(filteredPalette).map(([name, value]) => (
                            <div 
                                key={name} 
                                className={`border rounded-lg transition-all ${
                                    useSelection && !selectedColors.has(name)
                                        ? 'border-gray-700/30 opacity-50'
                                        : 'border-gray-700/50'
                                }`}
                            >
                                <div className="flex items-center gap-3 p-3">
                                    {/* Selection Checkbox */}
                                    {useSelection && (
                                        <button
                                            onClick={() => toggleColorSelection(name)}
                                            className="flex-shrink-0"
                                        >
                                            {selectedColors.has(name) ? (
                                                <CheckSquare className="w-5 h-5 text-accent" />
                                            ) : (
                                                <Square className="w-5 h-5 text-gray-600" />
                                            )}
                                        </button>
                                    )}
                                    
                                    {/* Color Name */}
                                    <div className="flex-1 min-w-0">
                                        {editingColor === name ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveColorName();
                                                        if (e.key === 'Escape') cancelEdit();
                                                    }}
                                                    className="bg-gray-800 border border-accent text-white px-3 py-1 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent flex-1"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={saveColorName}
                                                    className="bg-green-500 hover:bg-green-600 text-white p-1 rounded transition-colors"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white p-1 rounded transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-medium text-gray-200 capitalize truncate">
                                                    {colorNames[name] || name}
                                                </h4>
                                                <button
                                                    onClick={() => handleRenameColor(name)}
                                                    className="text-gray-500 hover:text-accent transition-colors flex-shrink-0"
                                                    title="Rename color"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Expand/Collapse Button */}
                                    {!compactView && typeof value === 'object' && (
                                        <button
                                            onClick={() => toggleColorExpanded(name)}
                                            className="flex-shrink-0 p-1 hover:bg-gray-700 rounded transition-colors"
                                        >
                                            {expandedColors[name] ? (
                                                <ChevronUp className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            )}
                                        </button>
                                    )}
                                </div>
                                
                                {/* Color Swatches */}
                                <div className={`px-3 pb-3 ${!expandedColors[name] && !compactView ? 'hidden' : ''}`}>
                                    {compactView ? (
                                        // Compact View: Single row of all shades
                                        <div className="flex gap-1 overflow-x-auto pb-1">
                                            {typeof value === 'object' ? (
                                                Object.entries(value).map(([shade, color]) => (
                                                    <button
                                                        key={shade}
                                                        onClick={() => copyColorValue(color)}
                                                        className="group relative flex-shrink-0"
                                                        title={`${shade}: ${color}`}
                                                    >
                                                        <div
                                                            className="w-10 h-10 rounded border border-gray-700/50 hover:scale-110 transition-transform cursor-pointer"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Copy className="w-3 h-3 text-white drop-shadow-lg" />
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <button
                                                    onClick={() => copyColorValue(value)}
                                                    className="group relative"
                                                    title={value}
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded border border-gray-700/50 hover:scale-110 transition-transform cursor-pointer"
                                                        style={{ backgroundColor: value }}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Copy className="w-3 h-3 text-white drop-shadow-lg" />
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        // Expanded View: Grid with labels
                                        <div className="flex flex-wrap gap-2">
                                            {typeof value === 'object' ? (
                                                Object.entries(value).map(([shade, color]) => (
                                                    <button
                                                        key={shade}
                                                        onClick={() => copyColorValue(color)}
                                                        className="group relative"
                                                        title={`Click to copy: ${color}`}
                                                    >
                                                        <div
                                                            className="w-16 h-16 rounded-lg shadow-md border border-gray-700/50 hover:scale-110 transition-transform cursor-pointer"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                                                            <Copy className="w-4 h-4 text-white drop-shadow-lg" />
                                                        </div>
                                                        <div className="text-xs text-center mt-1 text-gray-400">
                                                            {shade === 'DEFAULT' ? 'base' : shade}
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <button
                                                    onClick={() => copyColorValue(value)}
                                                    className="group relative"
                                                    title={`Click to copy: ${value}`}
                                                >
                                                    <div
                                                        className="w-16 h-16 rounded-lg shadow-md border border-gray-700/50 hover:scale-110 transition-transform cursor-pointer"
                                                        style={{ backgroundColor: value }}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                                                        <Copy className="w-4 h-4 text-white drop-shadow-lg" />
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Format Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {formats.map((format) => (
                    <button
                        key={format.id}
                        onClick={() => setActiveFormat(format.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeFormat === format.id
                                ? 'bg-accent text-white shadow-lg shadow-accent/25'
                                : 'bg-card/50 text-gray-400 hover:text-gray-200 hover:bg-card'
                        }`}
                    >
                        {format.label}
                    </button>
                ))}
            </div>

            {/* Output Display */}
            <div className="relative">
                <pre className="bg-[#0d1117] text-gray-300 p-6 pr-32 rounded-xl overflow-x-auto text-sm font-mono border border-gray-700/50 max-h-96 overflow-y-auto shadow-inner">
                    <code>{output}</code>
                </pre>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={handleDownload}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl"
                        title="Download file"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleCopy}
                        className={`text-white p-2.5 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${
                            copied ? 'bg-green-600' : 'bg-accent hover:bg-accent/80'
                        }`}
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span className="text-sm font-medium">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span className="text-sm font-medium">Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="text-blue-400 mt-0.5">ℹ️</div>
                    <div className="flex-1 text-sm text-gray-300 space-y-1">
                        {activeFormat === 'tailwind' && (
                            <>
                                <p>
                                    <strong className="text-white">Tailwind Config:</strong> Auto-generated shade scale (50-900) using professional HSL color space.
                                </p>
                                <p className="text-gray-400">
                                    Copy this into your <code className="bg-gray-800 px-1.5 py-0.5 rounded font-mono text-xs">tailwind.config.js</code> file.
                                </p>
                            </>
                        )}
                        {activeFormat === 'css' && (
                            <>
                                <p>
                                    <strong className="text-white">CSS Variables:</strong> Use in your CSS with <code className="bg-gray-800 px-1.5 py-0.5 rounded font-mono text-xs">var(--color-name)</code>
                                </p>
                                <p className="text-gray-400">
                                    Case format: <strong>{caseFormat}</strong> • Scope: <strong>{exportScope === 'full' ? 'All colors' : 'Primary only'}</strong>
                                </p>
                            </>
                        )}
                        {activeFormat === 'scss' && (
                            <>
                                <p>
                                    <strong className="text-white">SCSS Variables:</strong> Use in your SCSS files with <code className="bg-gray-800 px-1.5 py-0.5 rounded font-mono text-xs">$color-name</code>
                                </p>
                                <p className="text-gray-400">
                                    Case format: <strong>{caseFormat}</strong>
                                </p>
                            </>
                        )}
                        {activeFormat === 'react' && (
                            <>
                                <p>
                                    <strong className="text-white">React Theme:</strong> Import and use this theme object in your React/Next.js app.
                                </p>
                                <p className="text-gray-400">
                                    Example: <code className="bg-gray-800 px-1.5 py-0.5 rounded font-mono text-xs">theme.colors.primary</code>
                                </p>
                            </>
                        )}
                        {activeFormat === 'json' && (
                            <>
                                <p>
                                    <strong className="text-white">JSON Export:</strong> Portable format for sharing or importing into other tools.
                                </p>
                                <p className="text-gray-400">
                                    Perfect for design systems, documentation, or API responses.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <Toast
                        message={toastMessage}
                        onClose={() => setShowToast(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExportPanel;
