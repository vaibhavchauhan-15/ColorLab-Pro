import React from 'react';

const PreviewButton = ({ variant = 'primary', colors, children, size = 'md' }) => {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const getStyles = () => {
        if (variant === 'primary') {
            return {
                backgroundColor: colors.primary,
                color: colors.background,
                border: `2px solid ${colors.primary}`
            };
        } else if (variant === 'secondary') {
            return {
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `2px solid ${colors.primary}`
            };
        } else if (variant === 'accent') {
            return {
                backgroundColor: colors.accent,
                color: colors.background,
                border: `2px solid ${colors.accent}`
            };
        }
    };

    return (
        <button
            style={getStyles()}
            className={`${sizeClasses[size]} rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg`}
        >
            {children}
        </button>
    );
};

export default PreviewButton;
