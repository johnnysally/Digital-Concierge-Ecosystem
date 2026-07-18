import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
            <AdminNavbar onToggleSidebar={() => setSidebarOpen(true)} />

            <div className="flex h-[calc(100vh-65px)] min-h-[calc(100vh-65px)] flex-col overflow-hidden lg:flex-row">
                <aside className="hidden lg:block lg:w-72 lg:shrink-0">
                    <div className="sticky top-[65px] h-[calc(100vh-65px)] border-r border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
                        <AdminSidebar />
                    </div>
                </aside>

                <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>

            <div className={`fixed inset-0 z-40 lg:hidden transition-opacity ${sidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="absolute inset-0 bg-slate-950/40"
                />
            </div>

            <aside className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs transform border-r border-slate-200 bg-white shadow-2xl transition-transform dark:border-slate-800 dark:bg-slate-950 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
                        <div>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white">Navigation</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Admin menu</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                            Close
                        </button>
                    </div>
                    <div className="h-full overflow-y-auto px-2 py-4">
                        <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default AdminLayout;