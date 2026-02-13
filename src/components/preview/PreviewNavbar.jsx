import React from 'react';

const PreviewNavbar = ({ colors }) => {
    return (
        <nav
            style={{
                backgroundColor: colors.navBg || colors.background,
                borderBottomColor: colors.border || `${colors.primary}20`,
                color: colors.text
            }}
            className="px-6 py-4 border-b-2 backdrop-blur-sm"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        style={{ backgroundColor: colors.primary }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    >
                        L
                    </div>
                    <span style={{ color: colors.text }} className="font-bold text-lg">
                        Logo
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {['Home', 'About', 'Services'].map((item, index) => (
                        <a
                            key={item}
                            href="#"
                            style={{
                                color: index === 0 ? colors.primary : colors.textSecondary || `${colors.text}cc`
                            }}
                            className="text-sm font-medium hover:scale-105 transition-transform"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <button
                    style={{
                        backgroundColor: colors.primary,
                        color: colors.background
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                >
                    Sign In
                </button>
            </div>
        </nav>
    );
};

export default PreviewNavbar;
