import SectionHeader from '../components/ui/SectionHeader';
import CustomerTable from '../components/features/CustomerTable';

const CustomersListPage = () => (
    <div className="space-y-6">
        <SectionHeader title="Customers" subtitle="Manage all registered customers" />
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
            <CustomerTable />
        </div>
    </div>
);

export default CustomersListPage;