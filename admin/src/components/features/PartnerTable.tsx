import { Link } from 'react-router-dom';
import DataTable from '../ui/DataTable';
import StatusBadge from '../ui/StatusBadge';
import usePartners from '../../hooks/usePartners';
import { formatDate } from '../../utils/formatDate';

const PartnerTable = ({ filter }: { filter?: string }) => {
    const { partners, loading } = usePartners(filter ? { type: filter } : undefined);

    const columns = [
        { key: 'businessName', label: 'Business' },
        {
            key: 'firstName',
            label: 'Contact',
            render: (_: any, row: any) => `${row.firstName} ${row.lastName}`,
        },
        { key: 'email', label: 'Email' },
        {
            key: 'partnerType',
            label: 'Type',
            render: (val: string) => <span className="capitalize">{val}</span>,
        },
        {
            key: 'isVerified',
            label: 'Verification',
            render: (val: boolean, row: any) => {
                if (!val && !row.isActive) return <StatusBadge status="Pending" type="warning" />;
                if (val && row.isActive) return <StatusBadge status="Approved" type="success" />;
                if (!row.isActive) return <StatusBadge status="Suspended" type="danger" />;
                return <StatusBadge status="Unknown" type="neutral" />;
            },
        },
        {
            key: 'createdAt',
            label: 'Joined',
            render: (val: string) => formatDate(val),
        },
        {
            key: '_id',
            label: 'Actions',
            render: (val: string) => (
                <Link to={`/partners/${val}`} className="text-primary-500 hover:underline text-xs font-semibold">
                    View
                </Link>
            ),
        },
    ];

    return <DataTable columns={columns} data={partners} loading={loading} />;
};

export default PartnerTable;