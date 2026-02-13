import React from 'react';

const PreviewCard = ({ colors }) => {
    return (
        <div
            style={{
                backgroundColor: colors.cardBg || colors.background,
                borderColor: colors.border || `${colors.primary}20`,
                color: colors.text
            }}
            className="p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-xl"
        >
            <div className="flex items-center gap-3 mb-4">
                <div
                    style={{ backgroundColor: colors.primary }}
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div>
                    <h3 style={{ color: colors.text }} className="font-bold text-lg">
                        Card Title
                    </h3>
                    <p style={{ color: colors.textSecondary || `${colors.text}80` }} className="text-sm">
                        Subtitle text
                    </p>
                </div>
            </div>
            <p style={{ color: colors.textSecondary || `${colors.text}cc` }} className="text-sm leading-relaxed mb-4">
                This is a preview card component showing how your color palette works in a real UI context.
            </p>
            <div className="flex gap-2">
                <span
                    style={{
                        backgroundColor: `${colors.primary}20`,
                        color: colors.primary
                    }}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                >
                    Tag 1
                </span>
                <span
                    style={{
                        backgroundColor: `${colors.accent}20`,
                        color: colors.accent
                    }}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                >
                    Tag 2
                </span>
            </div>
        </div>
    );
};

export default PreviewCard;
