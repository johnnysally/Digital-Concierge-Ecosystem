interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    loading?: boolean;
}

const DataTable = ({ columns, data, loading }: DataTableProps) => {
    if (loading) return <div className="p-8 text-center text-slate-400">Loading...</div>;
    if (!data.length) return <div className="p-8 text-center text-slate-400">No data found.</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                        {columns.map((col) => (
                            <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.map((row, i) => (
                        <tr key={row._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;