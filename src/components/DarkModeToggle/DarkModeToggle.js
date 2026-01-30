import React, { useEffect, useState } from 'react';

function DarkModeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('darkMode') === 'enabled'
    );

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.removeItem('darkMode');
        }
    };

    return (
        <div className="flex justify-end mb-4 sm:mb-5">
            <button 
                id="toggle_dark_mode" 
                className="bg-[#121212] hover:bg-[#1a1a1a] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg cursor-pointer text-xs sm:text-sm md:text-base transition-colors duration-300 flex items-center gap-2"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
            >
                {isDarkMode ? (
                    <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="hidden sm:inline">Prepnúť na svetlý režim</span>
                        <span className="sm:hidden">Svetlý</span>
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span className="hidden sm:inline">Prepnúť na tmavý režim</span>
                        <span className="sm:hidden">Tmavý</span>
                    </>
                )}
            </button>
        </div>
    );
}

export default DarkModeToggle;
