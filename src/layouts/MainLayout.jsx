import React from 'react';
import { Github, Palette } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-300 flex flex-col font-sans">
            <div className="container mx-auto px-4 pt-3 pb-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg shadow-accent/20">
                        <Palette size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-400">
                        ColorLab Pro
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/vaibhavchauhan-15/ColorLab-Pro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-text-secondary hover:text-text transition-colors"
                    >
                        <Github size={20} />
                    </a>
                    <ThemeToggle />
                </div>
            </div>

            <main className="flex-1 container mx-auto px-4 pt-2 pb-6">
                {children}
            </main>

            <footer className="border-t border-border py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-text-secondary text-sm">
                    <p>© {new Date().getFullYear()} ColorLab Pro. specific by @vaibh</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
