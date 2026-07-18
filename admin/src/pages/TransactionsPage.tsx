import { useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import useTransactions from '../hooks/useTransactions';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';

const TransactionsPage = () => {
    const [filter, setFilter] = useState('');
    const { transactions, loading, total } = useTransactions(filter ? { status: filter } : undefined);

    const columns = [
        { key: 'customer', label: 'Customer', render: (_: any, row: any) => row.customer ? `${row.customer.firstName} ${row.customer.lastName}` : 'N/A' },
        { key: 'method', label: 'Method', render: (val: string) => <span className="uppercase">{val}</span> },
        { key: 'type', label: 'Type', render: (val: string) => <span className="capitalize">{val}</span> },
        { key: 'amount', label: 'Amount', render: (val: number) => formatCurrency(val) },
        { key: 'status', label: 'Status', render: (val: string) => (
            <StatusBadge status={val} type={val === 'completed' ? 'success' : val === 'failed' ? 'danger' : 'warning'} />
        )},
        { key: 'createdAt', label: 'Date', render: (val: string) => formatDateTime(val) },
    ];

    return (
        <div className="space-y-6">
            <SectionHeader title="Transactions" subtitle={`${total} total transactions`} />
            <div className="flex gap-2 mb-4">
                {['', 'completed', 'pending', 'failed', 'refunded'].map((s) => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${filter === s ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        {s || 'All'}
                    </button>
                ))}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-6">
                <DataTable columns={columns} data={transactions} loading={loading} />
            </div>
        </div>
    );
};

export default TransactionsPage;