import React from 'react';
import PreviewNavbar from './PreviewNavbar';
import PreviewButton from './PreviewButton';
import PreviewCard from './PreviewCard';
import PreviewInput from './PreviewInput';
import PreviewToggle from './PreviewToggle';
import { Sun, Moon } from 'lucide-react';

const ModePreview = ({ mode, colors, isToggled, onToggle }) => {
    return (
        <div className="flex flex-col h-full">
            {/* Mode Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-2">
                    {mode === 'light' ? (
                        <Sun size={18} className="text-yellow-500" />
                    ) : (
                        <Moon size={18} className="text-blue-400" />
                    )}
                    <span className="font-semibold text-sm text-text capitalize">
                        {mode} Mode
                    </span>
                </div>
                <PreviewToggle
                    colors={colors}
                    isActive={isToggled}
                    onToggle={onToggle}
                />
            </div>

            {/* Preview Content */}
            <div
                style={{
                    backgroundColor: colors.background,
                    color: colors.text
                }}
                className="flex-1 overflow-hidden transition-colors duration-300"
            >
                <div className="h-full overflow-y-auto">
                    {/* Navbar */}
                    <PreviewNavbar colors={colors} />

                    {/* Main Content */}
                    <div className="p-6 space-y-6">
                        {/* Hero Section */}
                        <div className="space-y-4">
                            <h1
                                style={{ color: colors.text }}
                                className="text-3xl font-bold"
                            >
                                Welcome to Your App
                            </h1>
                            <p
                                style={{ color: colors.textSecondary || `${colors.text}cc` }}
                                className="text-base leading-relaxed"
                            >
                                Experience how your color palette transforms the entire user interface.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <PreviewButton variant="primary" colors={colors}>
                                Primary Button
                            </PreviewButton>
                            <PreviewButton variant="secondary" colors={colors}>
                                Secondary
                            </PreviewButton>
                            <PreviewButton variant="accent" colors={colors}>
                                Accent
                            </PreviewButton>
                        </div>

                        {/* Input Fields */}
                        <div className="grid gap-4">
                            <PreviewInput
                                colors={colors}
                                label="Email Address"
                                placeholder="Enter your email"
                                type="email"
                            />
                            <PreviewInput
                                colors={colors}
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                            />
                        </div>

                        {/* Cards Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <PreviewCard colors={colors} />
                            <PreviewCard colors={colors} />
                        </div>

                        {/* Feature List */}
                        <div
                            style={{
                                backgroundColor: colors.cardBg || `${colors.primary}08`,
                                borderColor: colors.border || `${colors.primary}20`
                            }}
                            className="p-6 rounded-xl border-2"
                        >
                            <h3
                                style={{ color: colors.text }}
                                className="font-bold text-lg mb-4"
                            >
                                Key Features
                            </h3>
                            <ul className="space-y-3">
                                {['Real-time Preview', 'Multiple Themes', 'Responsive Design'].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <div
                                            style={{ backgroundColor: colors.primary }}
                                            className="w-2 h-2 rounded-full"
                                        />
                                        <span
                                            style={{ color: colors.textSecondary || `${colors.text}dd` }}
                                            className="text-sm"
                                        >
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModePreview;
