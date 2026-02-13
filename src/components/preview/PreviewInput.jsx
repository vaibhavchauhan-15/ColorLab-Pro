import React from 'react';

const PreviewInput = ({ colors, placeholder, label, type = 'text' }) => {
    return (
        <div className="w-full">
            {label && (
                <label
                    style={{ color: colors.text }}
                    className="block text-sm font-semibold mb-2"
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                style={{
                    backgroundColor: colors.inputBg || `${colors.background}`,
                    borderColor: colors.border || `${colors.primary}40`,
                    color: colors.text
                }}
                className="w-full px-4 py-2.5 rounded-lg border-2 text-sm transition-all duration-200 focus:outline-none placeholder:opacity-50"
                onFocus={(e) => {
                    e.target.style.borderColor = colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = colors.border || `${colors.primary}40`;
                    e.target.style.boxShadow = 'none';
                }}
            />
        </div>
    );
};

export default PreviewInput;
