import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-secondary text-text-secondary hover:text-text hover:bg-border transition-colors border border-border relative overflow-hidden"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
