import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import SolidMixer from './components/SolidMixer';
import GradientGenerator from './components/GradientGenerator';
import ContrastChecker from './components/ContrastChecker';
import UIPreview from './components/UIPreview';
import ExportPanel from './components/ExportPanel';
import ImageColorExtractor from './components/ImageColorExtractor';
import ColorScaleGenerator from './components/ColorScaleGenerator';
import ColorHarmonyGenerator from './components/ColorHarmonyGenerator';
import SaveSharePanel from './components/SaveSharePanel';
import ThemeToggle from './components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Palette } from 'lucide-react';
import { loadStateFromURL, saveStateToURL } from './utils/urlStateUtils';

function App() {
  const [activeTab, setActiveTab] = useState('solid');
  const [solidColors, setSolidColors] = useState([{ id: '1', value: '#EF4444' }]);
  const [gradientColors, setGradientColors] = useState([
    { id: '1', value: '#8B5CF6' },
    { id: '2', value: '#EC4899' }
  ]);

  // Load state from URL on mount
  useEffect(() => {
    const urlState = loadStateFromURL();
    if (urlState) {
      setActiveTab(urlState.activeTab);
      setSolidColors(urlState.solidColors);
      setGradientColors(urlState.gradientColors);
    }
  }, []);

  // Handler for loading palette from recent history
  const handleLoadPalette = (palette) => {
    if (palette.solidColors) setSolidColors(palette.solidColors);
    if (palette.gradientColors) setGradientColors(palette.gradientColors);
    if (palette.activeTab) setActiveTab(palette.activeTab);
  };

  // Get current app state for save/share
  const getCurrentState = () => ({
    activeTab,
    solidColors,
    gradientColors
  });

  // Optimized demo palette with essential, distinct colors
  const demoPalette = {
    brand: '#6366f1',
    primary: '#3b82f6',
    secondary: '#9333ea',
    accent: '#f59e0b'
  };

  // Get current active palette based on tab
  const getActivePalette = () => {
    if (activeTab === 'solid' && solidColors.length > 0) {
      const palette = {};
      solidColors.forEach((color, index) => {
        palette[`color${index + 1}`] = color.value;
      });
      return palette;
    } else if (activeTab === 'gradient' && gradientColors.length > 0) {
      const palette = {};
      gradientColors.forEach((color, index) => {
        palette[`gradient${index + 1}`] = color.value;
      });
      return palette;
    }
    return demoPalette;
  };

  return (
    <ThemeProvider>
      <MainLayout>
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Top Header with Branding, Tabs, and Actions */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
            {/* Logo/Branding */}
            <div className="flex items-center gap-3 group">
              <div className="bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20 w-10 h-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-accent/40 group-hover:rotate-6">
                <Palette size={22} />
              </div>
              <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent via-purple-400 to-pink-400 group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-accent transition-all duration-300">
                ColorLab Pro
              </span>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-card/50 backdrop-blur-sm p-1 rounded-xl border border-gray-700/50 inline-flex relative overflow-x-auto">
              {['solid', 'gradient', 'harmony', 'scale', 'image', 'contrast', 'preview', 'export'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2 rounded-lg text-sm font-medium transition-colors z-10 whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-accent rounded-lg shadow-lg shadow-accent/25"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 capitalize">
                    {tab === 'solid' ? 'Solid Mixer' : 
                     tab === 'gradient' ? 'Gradient' : 
                     tab === 'harmony' ? 'Harmony' :
                     tab === 'scale' ? 'Scale Gen' :
                     tab === 'image' ? 'Image Extract' :
                     tab === 'contrast' ? 'Contrast' : 
                     tab === 'preview' ? 'UI Preview' : 
                     'Export'}
                  </span>
                </button>
              ))}
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/vaibhavchauhan-15/ColorLab-Pro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
                className="p-2 text-text-secondary hover:text-accent rounded-lg hover:bg-secondary transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <Github size={20} />
              </a>
              <ThemeToggle />
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-[600px]"
            >
              {activeTab === 'solid' ? (
                <SolidMixer colors={solidColors} setColors={setSolidColors} />
              ) : activeTab === 'gradient' ? (
                <GradientGenerator colors={gradientColors} setColors={setGradientColors} />
              ) : activeTab === 'harmony' ? (
                <ColorHarmonyGenerator />
              ) : activeTab === 'scale' ? (
                <ColorScaleGenerator />
              ) : activeTab === 'image' ? (
                <ImageColorExtractor />
              ) : activeTab === 'contrast' ? (
                <ContrastChecker />
              ) : activeTab === 'preview' ? (
                <UIPreview />
              ) : (
                <ExportPanel palette={getActivePalette()} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Save & Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 space-y-6"
          >
            <SaveSharePanel 
              state={getCurrentState()} 
              onLoadPalette={handleLoadPalette}
            />
          </motion.div>

        </div>
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
