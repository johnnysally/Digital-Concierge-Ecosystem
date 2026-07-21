import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TransportNavbar from './TransportNavbar';
import TransportSidebar from './TransportSidebar';
import { useTransportTheme } from '../../../context/transport/ThemeContext';

const TransportLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { isDark } = useTransportTheme();

    return (
        <div className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-b from-white to-slate-50 text-slate-900'}`}>
            <div className="w-full px-2 sm:px-4 lg:px-6">
                <div className="relative flex min-h-screen flex-col lg:flex-row lg:gap-4">
                    <div className="hidden lg:block lg:fixed lg:top-0 lg:left-0 lg:h-screen">
                            <TransportSidebar />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col lg:ml-72 overflow-hidden">
                            <header className="sticky top-0 z-20 mb-3 mt-2 rounded-[28px] border px-4 py-3.5 shadow-[0_18px_45px_-20px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:px-5 lg:mt-3">
                                <TransportNavbar onMenuToggle={() => setMobileMenuOpen(true)} />
                            </header>

                            <div className="min-h-0 flex-1 overflow-y-auto pb-3 sm:pb-4 lg:pb-6">
                                <div className={`group min-h-0 rounded-[24px] border p-3 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-22px_rgba(15,23,42,0.55)] sm:p-4 lg:p-8 ${isDark ? 'border-slate-800 bg-slate-900/95' : 'border-gray-200 bg-white'}`}>
                                    <div className="min-h-0">
                                        <Outlet />
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>

            <div className={`fixed inset-0 z-40 lg:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-slate-950/60 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setMobileMenuOpen(false)}
                />
                <div className={`absolute left-0 top-0 h-full w-[85vw] max-w-xs transform overflow-y-auto bg-slate-950 p-4 shadow-2xl transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between pb-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Transport Portal</p>
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
