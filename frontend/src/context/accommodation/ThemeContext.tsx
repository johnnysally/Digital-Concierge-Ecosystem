import React from 'react';

interface AccommodationThemeContextValue {
    theme: 'light' | 'dark';
    isDark: boolean;
    toggleTheme: () => void;
}

const AccommodationThemeContext = React.createContext<AccommodationThemeContextValue | undefined>(undefined);

export const AccommodationThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light';
        const stored = window.localStorage.getItem('accommodation-dashboard-theme');
        return stored === 'dark' ? 'dark' : 'light';
    });

    React.useEffect(() => {
        window.localStorage.setItem('accommodation-dashboard-theme', theme);
    }, [theme]);

    const value = React.useMemo(
        () => ({
            theme,
            isDark: theme === 'dark',
            toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
        }),
        [theme]
    );

    return <AccommodationThemeContext.Provider value={value}>{children}</AccommodationThemeContext.Provider>;
};

export const useAccommodationTheme = () => {
    const context = React.useContext(AccommodationThemeContext);
    if (!context) {
        throw new Error('useAccommodationTheme must be used within AccommodationThemeProvider');
    }
    return context;
};
