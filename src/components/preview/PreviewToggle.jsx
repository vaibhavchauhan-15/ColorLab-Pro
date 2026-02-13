import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const PreviewToggle = ({ colors, isActive, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            style={{
                backgroundColor: isActive ? colors.primary : `${colors.text}20`,
            }}
            className="relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner"
        >
            <div
                style={{
                    backgroundColor: colors.background,
                    transform: isActive ? 'translateX(32px)' : 'translateX(4px)'
                }}
                className="absolute top-1 w-6 h-6 rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center"
            >
                {isActive ? (
                    <Moon size={14} style={{ color: colors.primary }} />
                ) : (
                    <Sun size={14} style={{ color: colors.text }} />
                )}
            </div>
        </button>
    );
};

export default PreviewToggle;
