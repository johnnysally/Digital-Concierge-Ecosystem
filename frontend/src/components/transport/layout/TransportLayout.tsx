import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TransportNavbar from './TransportNavbar';
import TransportSidebar from './TransportSidebar';
import { useTransportTheme } from '../../../context/transport/ThemeContext';

const TransportLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isDark } = useTransportTheme();

    return (
        <div className={`h-screen overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-b from-white to-slate-50 text-slate-900'}`}>
            <div className="h-full w-full px-2 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4">
                <div className="flex h-full flex-col lg:flex-row lg:gap-0">
                    <div className="hidden lg:block lg:shrink-0">
                        <div className="fixed left-0 top-0 h-screen w-72">
                            <TransportSidebar className="h-full w-full" />
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:pl-72">
                        <div className={`sticky top-0 z-20 mb-3 rounded-[28px] border px-3 py-3 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:px-5 sm:py-3.5 ${isDark ? 'border-slate-800 bg-slate-900/85' : 'border-slate-200/80 bg-white/85'}`}>
                            <TransportNavbar onMenuToggle={() => setMobileMenuOpen(true)} />
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-3 sm:pb-4 lg:pb-6">
                            <main className="min-h-0 flex-1 overflow-y-auto min-w-0 px-0 pr-1 sm:px-0">
                                <div className={`min-h-full rounded-[24px] border border-transparent p-1 sm:p-2 lg:p-4 ${isDark ? 'bg-slate-900/20' : 'bg-white/40'}`}>
                                    <div className="min-h-full">
                                        <Outlet />
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 z-40 lg:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-slate-950/70 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileMenuOpen(false)}
                />
                <div className={`absolute left-0 top-0 h-full w-[86vw] max-w-xs transform overflow-y-auto border-r border-slate-800 bg-slate-950/95 p-4 shadow-2xl transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between pb-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Transport portal</p>
                            <p className="text-lg font-semibold text-white">Fleet control</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                        >
                            Close
                        </button>
                    </div>
                    <TransportSidebar onNavigate={() => setMobileMenuOpen(false)} />
                </div>
            </div>
        </div>
    );
};

export default TransportLayout;
