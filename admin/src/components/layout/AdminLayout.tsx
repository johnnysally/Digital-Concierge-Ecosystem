import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = () => (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <AdminNavbar />
        <div className="flex">
            <div className="sticky top-[65px] h-[calc(100vh-65px)] flex-shrink-0">
                <AdminSidebar />
            </div>
            <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    </div>
);

export default AdminLayout;