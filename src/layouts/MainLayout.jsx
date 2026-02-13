import React, { useState, useEffect } from 'react';

const MainLayout = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger fade-in animation on mount
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-300 flex flex-col font-sans">
            {/* Main Content with Fade-in Animation */}
            <main
                className={`flex-1 w-full transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
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
