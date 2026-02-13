import React, { useState, useEffect } from 'react';
import { Github, Palette } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const MainLayout = ({ children }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger fade-in animation on mount
        setIsLoaded(true);

        // Handle scroll effect for header
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-300 flex flex-col font-sans">
            {/* Animated Sticky Header */}
            <header
                className={`sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b transition-all duration-500 ease-out ${isScrolled
                        ? 'border-border shadow-lg py-2'
                        : 'border-transparent py-4'
                    }`}
                style={{
                    animation: 'slideDown 0.6s ease-out'
                }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo Section with Animation */}
                        <div
                            className="flex items-center gap-3 group"
                            style={{
                                animation: 'fadeInLeft 0.8s ease-out'
                            }}
                        >
                            <div className={`bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20 transition-all duration-500 ease-out ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                                } group-hover:scale-110 group-hover:shadow-accent/40 group-hover:rotate-6`}>
                                <Palette size={isScrolled ? 18 : 22} className="transition-all duration-500" />
                            </div>
                            <span className={`font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent via-purple-400 to-pink-400 transition-all duration-500 ${isScrolled ? 'text-lg' : 'text-xl sm:text-2xl'
                                } group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-accent`}>
                                ColorLab Pro
                            </span>
                        </div>

                        {/* Actions Section with Animation */}
                        <nav
                            className="flex items-center gap-2 sm:gap-4"
                            style={{
                                animation: 'fadeInRight 0.8s ease-out'
                            }}
                        >
                            <a
                                href="https://github.com/vaibhavchauhan-15/ColorLab-Pro"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View on GitHub"
                                className="p-2 sm:p-3 text-text-secondary hover:text-accent rounded-lg hover:bg-secondary transition-all duration-300 ease-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                            >
                                <Github size={20} className="transition-transform duration-300" />
                            </a>
                            <div className="transform transition-all duration-300 hover:scale-105">
                                <ThemeToggle />
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content with Fade-in Animation */}
            <main
                className={`flex-1 w-full transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                    <div className="animate-content-appear">
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer with Animation */}
            <footer
                className="border-t border-border mt-auto transition-all duration-500 hover:border-accent/20"
                style={{
                    animation: 'fadeInUp 1s ease-out'
                }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="text-center text-text-secondary text-sm transition-all duration-300 hover:text-text">
                        <p className="transition-all duration-300 hover:scale-105 inline-block">
                            © {new Date().getFullYear()} ColorLab Pro. Created by{' '}
                            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-400 hover:from-purple-400 hover:to-accent transition-all duration-300">
                                @vaibh
                            </span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* Custom Animations - Injected as style tag */}
            <style>{`
                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeInLeft {
                    from {
                        transform: translateX(-32px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeInRight {
                    from {
                        transform: translateX(32px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeInUp {
                    from {
                        transform: translateY(32px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes contentAppear {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .animate-content-appear {
                    animation: contentAppear 0.8s ease-out 0.2s both;
                }

                /* Respect user's motion preferences */
                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }

                /* Smooth scroll behavior */
                @media (prefers-reduced-motion: no-preference) {
                    html {
                        scroll-behavior: smooth;
                    }
                }
            `}</style>
        </div>
    );
};

export default MainLayout;
