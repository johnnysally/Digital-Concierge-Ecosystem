import SectionHeader from '../components/ui/SectionHeader';
import CustomerTable from '../components/features/CustomerTable';

const CustomersListPage = () => (
    <div className="space-y-6">
        <SectionHeader title="Customers" subtitle="Manage all registered customers" />
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <CustomerTable />
        </div>
    </div>
);

export default CustomersListPage;