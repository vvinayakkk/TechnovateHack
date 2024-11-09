import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
    // Initialize theme state based on localStorage or default to light mode
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // Toggle theme between dark and light
    const toggleTheme = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
        localStorage.setItem('theme', newTheme); // Save preference in localStorage
    };

    // Ensure theme is applied on initial load
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <button onClick={toggleTheme} className="p-4">
            {isDarkMode ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-sun-moon"
                >
                    <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.9 4.9 1.4 1.4" />
                    <path d="m17.7 17.7 1.4 1.4" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.3 17.7-1.4 1.4" />
                    <path d="m19.1 4.9-1.4 1.4" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-moon"
                >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggle;
