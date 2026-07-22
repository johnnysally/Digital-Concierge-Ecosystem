export type RestaurantTheme = 'dark' | 'light';

export const getStoredRestaurantTheme = (): RestaurantTheme => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('digitalsafaris_restaurant_theme');
    return stored === 'light' ? 'light' : 'dark';
};

export const setStoredRestaurantTheme = (theme: RestaurantTheme) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('digitalsafaris_restaurant_theme', theme);
};
