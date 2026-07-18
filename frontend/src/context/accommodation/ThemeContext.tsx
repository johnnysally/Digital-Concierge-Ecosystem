import React from 'react';
import { getAccommodationSettings } from '../../api/accommodation/settingsApi';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemePreset = 'professional' | 'emerald' | 'ocean' | 'midnight';

const presetPaletteMap: Record<ThemePreset, { accent: string; secondary: string }> = {
    professional: { accent: '#10b981', secondary: '#0f766e' },
    emerald: { accent: '#059669', secondary: '#14532d' },
    ocean: { accent: '#0ea5e9', secondary: '#164e63' },
    midnight: { accent: '#8b5cf6', secondary: '#312e81' },
};

interface AccommodationThemeContextValue {
    theme: 'light' | 'dark';
    isDark: boolean;
    themeMode: ThemeMode;
    themePreset: ThemePreset;
    accentColor: string;
    secondaryColor: string;
    toggleTheme: () => void;
    applyThemeSettings: (settings: any) => void;
}

const AccommodationThemeContext = React.createContext<AccommodationThemeContextValue | undefined>(undefined);

export const getThemePalette = (preset: ThemePreset, accentColor: string, secondaryColor: string, isDark: boolean) => {
    const basePalette = presetPaletteMap[preset] || presetPaletteMap.professional;
    return {
        accent: accentColor || basePalette.accent,
        secondary: secondaryColor || basePalette.secondary,
        surface: isDark ? '#020617' : '#f8fafc',
        card: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15, 23, 42, 0.08)',
    };
};

const getResolvedTheme = (mode: ThemeMode) => {
    if (typeof window === 'undefined') return 'dark';
    if (mode === 'system' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode === 'dark' ? 'dark' : 'light';
};

export const AccommodationThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'dark';
        const stored = window.localStorage.getItem('accommodation-dashboard-theme');
        return stored === 'dark' ? 'dark' : 'light';
    });
    const [themeMode, setThemeMode] = React.useState<ThemeMode>(() => {
        if (typeof window === 'undefined') return 'dark';
        return (window.localStorage.getItem('accommodation-dashboard-theme-mode') as ThemeMode | null) || 'dark';
    });
    const [themePreset, setThemePreset] = React.useState<ThemePreset>(() => {
        if (typeof window === 'undefined') return 'professional';
        return (window.localStorage.getItem('accommodation-dashboard-theme-preset') as ThemePreset | null) || 'professional';
    });
    const [accentColor, setAccentColor] = React.useState(() => {
        if (typeof window === 'undefined') return presetPaletteMap.professional.accent;
        return window.localStorage.getItem('accommodation-dashboard-accent-color') || presetPaletteMap.professional.accent;
    });
    const [secondaryColor, setSecondaryColor] = React.useState(() => {
        if (typeof window === 'undefined') return presetPaletteMap.professional.secondary;
        return window.localStorage.getItem('accommodation-dashboard-secondary-color') || presetPaletteMap.professional.secondary;
    });

    const applyThemeSettings = React.useCallback((settings: any) => {
        const hasPersistedTheme = typeof window !== 'undefined' && window.localStorage.getItem('accommodation-dashboard-theme-mode') !== null;
        const persistedThemeMode = typeof window !== 'undefined'
            ? (window.localStorage.getItem('accommodation-dashboard-theme-mode') as ThemeMode | null) || 'dark'
            : 'dark';
        const persistedThemePreset = typeof window !== 'undefined'
            ? (window.localStorage.getItem('accommodation-dashboard-theme-preset') as ThemePreset | null) || 'professional'
            : 'professional';
        const persistedAccentColor = typeof window !== 'undefined'
            ? window.localStorage.getItem('accommodation-dashboard-accent-color') || presetPaletteMap.professional.accent
            : presetPaletteMap.professional.accent;
        const persistedSecondaryColor = typeof window !== 'undefined'
            ? window.localStorage.getItem('accommodation-dashboard-secondary-color') || presetPaletteMap.professional.secondary
            : presetPaletteMap.professional.secondary;

        const nextThemeMode = hasPersistedTheme ? persistedThemeMode : ((settings?.themeMode as ThemeMode | undefined) || persistedThemeMode);
        const nextThemePreset = hasPersistedTheme ? persistedThemePreset : ((settings?.themePreset as ThemePreset | undefined) || persistedThemePreset);
        const presetDefaults = presetPaletteMap[nextThemePreset] || presetPaletteMap.professional;
        const nextAccentColor = hasPersistedTheme ? (persistedAccentColor || presetDefaults.accent) : (settings?.accentColor || persistedAccentColor || presetDefaults.accent);
        const nextSecondaryColor = hasPersistedTheme ? (persistedSecondaryColor || presetDefaults.secondary) : (settings?.secondaryColor || persistedSecondaryColor || presetDefaults.secondary);
        const resolvedTheme = getResolvedTheme(nextThemeMode);

        setThemeMode(nextThemeMode);
        setThemePreset(nextThemePreset);
        setAccentColor(nextAccentColor);
        setSecondaryColor(nextSecondaryColor);
        setTheme(resolvedTheme);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem('accommodation-dashboard-theme-mode', nextThemeMode);
            window.localStorage.setItem('accommodation-dashboard-theme-preset', nextThemePreset);
            window.localStorage.setItem('accommodation-dashboard-accent-color', nextAccentColor);
            window.localStorage.setItem('accommodation-dashboard-secondary-color', nextSecondaryColor);
            window.localStorage.setItem('accommodation-dashboard-theme', resolvedTheme);
        }
    }, []);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        const syncFromStorage = () => {
            const storedThemeMode = (window.localStorage.getItem('accommodation-dashboard-theme-mode') as ThemeMode | null) || 'dark';
            const storedThemePreset = (window.localStorage.getItem('accommodation-dashboard-theme-preset') as ThemePreset | null) || 'professional';
            const storedAccentColor = window.localStorage.getItem('accommodation-dashboard-accent-color') || '#10b981';
            const storedSecondaryColor = window.localStorage.getItem('accommodation-dashboard-secondary-color') || '#0f766e';
            const resolvedTheme = getResolvedTheme(storedThemeMode);

            setThemeMode(storedThemeMode);
            setThemePreset(storedThemePreset);
            setAccentColor(storedAccentColor);
            setSecondaryColor(storedSecondaryColor);
            setTheme(resolvedTheme);
        };

        syncFromStorage();
        window.addEventListener('accommodation-theme-updated', syncFromStorage);
        return () => window.removeEventListener('accommodation-theme-updated', syncFromStorage);
    }, []);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (themeMode === 'system') {
                setTheme(getResolvedTheme('system'));
            }
        };

        mediaQuery.addEventListener?.('change', handleChange);
        return () => mediaQuery.removeEventListener?.('change', handleChange);
    }, [themeMode]);

    React.useEffect(() => {
        const loadRemoteSettings = async () => {
            try {
                const settings = await getAccommodationSettings();
                applyThemeSettings(settings);
            } catch {
                // ignore missing settings or auth errors until the user saves a preference
            }
        };

        loadRemoteSettings();
    }, [applyThemeSettings]);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('accommodation-dashboard-theme', theme);
    }, [theme]);

    React.useEffect(() => {
        if (typeof document === 'undefined') return;
        const root = document.documentElement;
        root.classList.toggle('accommodation-light', theme === 'light');
        root.classList.toggle('accommodation-dark', theme === 'dark');
        root.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = React.useCallback(() => {
        const nextThemeMode: ThemeMode = theme === 'dark' ? 'light' : 'dark';
        const nextTheme = getResolvedTheme(nextThemeMode);

        setTheme(nextTheme);
        setThemeMode(nextThemeMode);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('accommodation-dashboard-theme', nextTheme);
            window.localStorage.setItem('accommodation-dashboard-theme-mode', nextThemeMode);
            window.dispatchEvent(new Event('accommodation-theme-updated'));
        }
    }, [theme]);

    const value = React.useMemo(
        () => ({
            theme,
            isDark: theme === 'dark',
            themeMode,
            themePreset,
            accentColor,
            secondaryColor,
            toggleTheme,
            applyThemeSettings,
        }),
        [accentColor, applyThemeSettings, secondaryColor, theme, themeMode, themePreset, toggleTheme]
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
