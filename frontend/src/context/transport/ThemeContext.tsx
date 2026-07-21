import React from 'react';

interface ThemeContextValue {
    theme: 'light' | 'dark';
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'transport-dashboard-theme';

const resolveTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'dark';
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>(resolveTheme);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(STORAGE_KEY, theme);
        const root = document.documentElement;
        root.classList.toggle('transport-theme-dark', theme === 'dark');
        root.classList.toggle('transport-theme-light', theme === 'light');
        root.style.colorScheme = theme;
    }, [theme]);

    const value = React.useMemo(
        () => ({
            theme,
            isDark: theme === 'dark',
            toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
        }),
        [theme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTransportTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTransportTheme must be used within a ThemeProvider');
    }
    return context;
};
