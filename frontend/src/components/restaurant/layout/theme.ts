export type RestaurantTheme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'digitalsafaris_restaurant_theme';
const THEME_RUNTIME_KEY = '__digitalsafaris_restaurant_theme__';

type ThemeRuntimeWindow = Window & {
    [key: string]: unknown;
};

const getRuntimeWindow = (): ThemeRuntimeWindow | undefined => {
    if (typeof window === 'undefined') return undefined;
    return window as unknown as ThemeRuntimeWindow;
};

export const getStoredRestaurantTheme = (): RestaurantTheme => {
    if (typeof window === 'undefined') return 'dark';

    const runtimeWindow = getRuntimeWindow();
    const runtimeTheme = runtimeWindow?.[THEME_RUNTIME_KEY];
    if (runtimeTheme === 'light' || runtimeTheme === 'dark') {
        return runtimeTheme as RestaurantTheme;
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = stored === 'light' ? 'light' : 'dark';
    if (runtimeWindow) {
        runtimeWindow[THEME_RUNTIME_KEY] = nextTheme;
    }
    return nextTheme;
};

export const setStoredRestaurantTheme = (theme: RestaurantTheme) => {
    if (typeof window === 'undefined') return;

    const runtimeWindow = getRuntimeWindow();
    if (runtimeWindow) {
        runtimeWindow[THEME_RUNTIME_KEY] = theme;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-restaurant-theme', theme);
    root.style.colorScheme = theme;
    window.dispatchEvent(new Event('restaurant-theme-changed'));
};
