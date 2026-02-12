import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import SolidMixer from './components/SolidMixer';
import GradientGenerator from './components/GradientGenerator';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('solid');

  return (
    <ThemeProvider>
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Tabs Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/50 dark:bg-card/50 backdrop-blur-sm p-1 rounded-xl border border-gray-200 dark:border-gray-700/50 inline-flex relative shadow-sm">
              {['solid', 'gradient'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2 rounded-lg text-sm font-medium transition-colors z-10 ${activeTab === tab ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-accent rounded-lg shadow-lg shadow-accent/25"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 capitalize">{tab} Mixer</span>
                </button>
              ))}
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
              {activeTab === 'solid' ? <SolidMixer /> : <GradientGenerator />}
            </motion.div>
          </AnimatePresence>

        </div>
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
