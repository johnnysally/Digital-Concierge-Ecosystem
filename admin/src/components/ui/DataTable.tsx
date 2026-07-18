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
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm sm:text-base">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="sticky top-0 z-20 whitespace-normal bg-slate-50/95 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 backdrop-blur dark:bg-slate-950/95 dark:text-slate-400 sm:text-[0.7rem]">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.map((row, i) => (
                        <tr key={row._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            {columns.map((col) => (
                                <td key={col.key} className="whitespace-normal break-words px-4 py-3 text-slate-700 dark:text-slate-300">
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