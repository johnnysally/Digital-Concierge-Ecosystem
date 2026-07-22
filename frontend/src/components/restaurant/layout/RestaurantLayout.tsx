import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import RestaurantSidebar from './RestaurantSidebar';
import { getStoredRestaurantTheme, RestaurantTheme, setStoredRestaurantTheme } from './theme';

const RestaurantLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<RestaurantTheme>(getStoredRestaurantTheme);

    useEffect(() => {
        document.documentElement.classList.toggle('light', theme === 'light');
        document.documentElement.classList.toggle('dark', theme === 'dark');
        setStoredRestaurantTheme(theme);
    }, [theme]);

    const toggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));

    const isLight = theme === 'light';

    return (
        <div className={`min-h-screen restaurant-theme-${theme} ${isLight ? 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] text-slate-800' : 'bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,_#020617,_#111827)] text-slate-100'}`}>
            <div className="w-full px-2 py-2 sm:px-4 lg:px-6 lg:py-4">
                <div className="relative flex min-h-screen flex-col lg:flex-row lg:gap-4">
                    <aside className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-screen">
                        <RestaurantSidebar theme={theme} onToggleTheme={toggleTheme} />
                    </aside>

                    <div className="flex min-w-0 flex-1 flex-col lg:ml-72">
                        <header className={`sticky top-0 z-20 mb-3 rounded-[24px] border border-amber-500/20 px-4 py-3 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:px-5 ${isLight ? 'bg-white/85' : 'bg-slate-900/85'}`}>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-amber-400">Digital Safaris</p>
                                    <h1 className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Restaurant Portal</h1>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={toggleTheme}
                                        className={`rounded-2xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700' : 'border-slate-700 bg-slate-800 text-slate-200'}`}
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

                        <main className={`min-h-0 flex-1 rounded-[24px] border p-3 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] sm:p-4 lg:p-8 ${isLight ? 'border-slate-200 bg-white/90' : 'border-slate-800 bg-slate-900/95'}`}>
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 z-40 lg:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-slate-950/70 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)} />
                <div className={`absolute left-0 top-0 h-full w-[85vw] max-w-xs transform overflow-y-auto border-r p-4 transition-transform ${isLight ? 'border-slate-200 bg-white text-slate-800' : 'border-slate-800 bg-slate-950 text-slate-100'}`}>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-amber-400">Digital Safaris</p>
                            <p className={`text-lg font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Partner workspace</p>
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
