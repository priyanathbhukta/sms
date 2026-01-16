import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, logger } from '../utils/constants';
import { getStorage, setStorage } from '../utils/helpers';

// Create Theme Context
const ThemeContext = createContext(null);

/**
 * Theme Provider Component
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    // Initialize theme from storage or system preference
    useEffect(() => {
        const storedTheme = getStorage(STORAGE_KEYS.THEME);

        if (storedTheme) {
            setTheme(storedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        logger.log('Theme changed to:', theme);
    }, [theme]);

    /**
     * Toggle between light and dark theme
     */
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setStorage(STORAGE_KEYS.THEME, newTheme);
    };

    /**
     * Set specific theme
     */
    const setThemeMode = (mode) => {
        if (mode === 'light' || mode === 'dark') {
            setTheme(mode);
            setStorage(STORAGE_KEYS.THEME, mode);
        }
    };

    const value = {
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme: setThemeMode,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Custom hook to use theme context
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
