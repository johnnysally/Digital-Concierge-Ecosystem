import { useNavigate } from 'react-router-dom';
import DataTable from '../ui/DataTable';
import StatusBadge from '../ui/StatusBadge';
import useCustomers from '../../hooks/useCustomers';
import { suspendCustomer, activateCustomer } from '../../api/customerApi';
import { formatDate } from '../../utils/formatDate';

const CustomerTable = () => {
    const { customers, loading } = useCustomers();
    const navigate = useNavigate();

    const handleToggle = async (id: string, isActive: boolean) => {
        if (isActive) {
            await suspendCustomer(id);
        } else {
            await activateCustomer(id);
        }
        window.location.reload();
    };

    const columns = [
        {
            key: 'firstName',
            label: 'Name',
            render: (_: any, row: any) => `${row.firstName} ${row.lastName}`,
        },
        { key: 'email', label: 'Email' },
        {
            key: 'isActive',
            label: 'Status',
            render: (val: boolean) => (
                <StatusBadge status={val ? 'Active' : 'Suspended'} type={val ? 'success' : 'danger'} />
            ),
        },
        {
            key: 'createdAt',
            label: 'Joined',
            render: (val: string) => formatDate(val),
        },
        {
            key: '_id',
            label: 'Actions',
            render: (val: string, row: any) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/customers/${val}`)}
                        className="text-primary-500 hover:underline text-xs font-semibold"
                    >
                        View
                    </button>
                    <button
                        onClick={() => handleToggle(val, row.isActive)}
                        className={`text-xs font-semibold hover:underline ${row.isActive ? 'text-red-500' : 'text-emerald-500'}`}
                    >
                        {row.isActive ? 'Suspend' : 'Activate'}
                    </button>
                </div>
            ),
        },
    ];

    return <DataTable columns={columns} data={customers} loading={loading} />;
};

export default CustomerTable;