import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import RestaurantSidebar from './RestaurantSidebar';
import { getStoredRestaurantTheme, RestaurantTheme, setStoredRestaurantTheme } from './theme';

const RestaurantLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<RestaurantTheme>(() => getStoredRestaurantTheme());

    useEffect(() => {
        const syncThemeFromStorage = () => setTheme(getStoredRestaurantTheme());
        window.addEventListener('restaurant-theme-changed', syncThemeFromStorage);
        return () => window.removeEventListener('restaurant-theme-changed', syncThemeFromStorage);
    }, []);

    useLayoutEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('light', theme === 'light');
        root.classList.toggle('dark', theme === 'dark');
        root.setAttribute('data-restaurant-theme', theme);
        root.style.colorScheme = theme;
        window.localStorage.setItem('digitalsafaris_restaurant_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        const nextTheme: RestaurantTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        setStoredRestaurantTheme(nextTheme);
    };

    const isLight = theme === 'light';
    const shellClasses = useMemo(() => (
        isLight
            ? 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] text-slate-800'
            : 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#020617,_#111827)] text-slate-100'
    ), [isLight]);

    return (
        <div className={`min-h-screen restaurant-theme-${theme} transition-colors duration-200 ${shellClasses}`}>
            <div className="mx-auto w-full max-w-8xl px-2 py-2 sm:px-4 lg:px-6 lg:py-4">
                <div className="relative flex min-h-screen flex-col lg:flex-row lg:gap-6">
                    <aside className="hidden lg:block lg:w-72 lg:flex-none">
                        <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
                            <RestaurantSidebar theme={theme} onToggleTheme={toggleTheme} />
                        </div>
                    </aside>

                    <div className="flex min-w-0 flex-1 flex-col">
                        <header className={`sticky top-2 z-20 mb-3 rounded-[24px] border border-amber-500/20 px-3 py-3 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl transition-colors duration-200 sm:top-3 sm:px-5 sm:py-4 ${isLight ? 'bg-white/85' : 'bg-slate-900/85'}`}>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-[11px] uppercase tracking-[0.35em] text-amber-400">Digital Safaris</p>
                                    <h1 className={`truncate text-base font-semibold sm:text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>Restaurant Portal</h1>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={toggleTheme}
                                        className={`rounded-2xl border px-3 py-2 text-sm shadow-sm ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700' : 'border-slate-700 bg-slate-800 text-slate-200'}`}
                                    >
                                        {isLight ? '☀️' : '🌙'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMobileMenuOpen(true)}
                                        className={`rounded-2xl border px-3 py-2 text-sm lg:hidden ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700' : 'border-slate-700 bg-slate-800 text-slate-200'}`}
                                    >
                                        Menu
                                    </button>
                                </div>
                            </div>
                        </header>

                        <main className={`min-h-0 flex-1 overflow-auto rounded-[24px] border p-3 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] transition-colors duration-200 sm:p-4 lg:p-8 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/95'}`}>
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 z-40 lg:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-slate-950/70 transition-opacity duration-200 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)} />
                <div className={`absolute left-0 top-0 h-full w-[86vw] max-w-xs transform overflow-y-auto border-r p-4 transition-transform duration-200 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isLight ? 'border-slate-200 bg-white text-slate-800' : 'border-slate-800 bg-slate-950 text-slate-100'}`}>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.24em] text-amber-400">Digital Safaris</p>
                            <p className={`text-base font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Partner workspace</p>
                        </div>
                        <button type="button" onClick={() => setMobileMenuOpen(false)} className={`rounded-2xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700' : 'border-slate-700 bg-slate-900 text-slate-200'}`}>
                            Close
                        </button>
                    </div>
                    <RestaurantSidebar theme={theme} onToggleTheme={toggleTheme} onNavigate={() => setMobileMenuOpen(false)} />
                </div>
            </div>
        </div>
    );
};

export default RestaurantLayout;
