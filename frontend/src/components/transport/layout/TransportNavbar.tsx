import React from 'react';
import { Link } from 'react-router-dom';
import { useTransportTheme } from '../../../context/transport/ThemeContext';

type TransportNavbarProps = {
    onMenuToggle: () => void;
};

const TransportNavbar = ({ onMenuToggle }: TransportNavbarProps) => {
    const { isDark, toggleTheme } = useTransportTheme();

    return (
        <header className={`sticky top-0 z-40 border-b ${isDark ? 'border-slate-800 bg-slate-950/90' : 'border-gray-200 bg-white'}`}>
            <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-8 max-w-[1400px]">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuToggle}
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg transition duration-200 lg:hidden ${isDark ? 'border-slate-700 bg-slate-900/80 text-slate-100' : 'border-slate-200 bg-white/80 text-slate-800'}`}
                    >
                        ☰
                    </button>
                    <Link to="/transport-admin" className="flex items-center gap-3 whitespace-nowrap">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-600 text-sm font-semibold text-white shadow-sm">
                            DS
                        </div>
                        <div>
                            <p className={`text-base sm:text-lg font-semibold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>DigitalSafaris</p>
                            <p className={`text-[11px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Transport portal</p>
                        </div>
                    </Link>
                </div>

                <div className={`flex flex-wrap items-center gap-2 rounded-full border px-2 py-2 text-xs sm:text-sm ${isDark ? 'border-slate-800 bg-slate-900/80 text-slate-300' : 'border-gray-100 bg-white text-slate-700'}`}>
                    <Link
                        to="/transport-admin"
                        className={`rounded-full px-3 py-2 transition ${isDark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-gray-50 hover:text-slate-900'}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/transport-admin/settings"
                        className={`rounded-full px-3 py-2 transition ${isDark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-gray-50 hover:text-slate-900'}`}
                    >
                        Settings
                    </Link>
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`rounded-full px-3 py-2 transition ${isDark ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                    >
                        {isDark ? 'Light' : 'Dark'}
                    </button>
                    <Link
                        to="/transport-admin/support"
                        className={`rounded-full px-3 py-2 transition ${isDark ? 'hover:bg-slate-800 hover:text-white' : 'hover:bg-gray-50 hover:text-slate-900'}`}
                    >
                        Support
                    </Link>
                    <Link to="/transport-admin/profile" className="rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-2 text-sm font-semibold text-white transition">
                        Profile
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default TransportNavbar;
