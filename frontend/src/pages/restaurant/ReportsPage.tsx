import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getItems } from '../../api/restaurant/menuApi';
import { getOrders } from '../../api/restaurant/orderApi';
import { getPayments } from '../../api/restaurant/paymentApi';
import { getStaff } from '../../api/restaurant/staffApi';
import { useRestaurantTheme } from '../../components/restaurant/layout/theme';
import { formatCurrency } from '../../utils/formatCurrency';

interface RestaurantOrder {
    _id: string;
    total?: number;
    status?: string;
    paymentStatus?: string;
    createdAt?: string;
    items?: Array<{ _id: string }>;
    customer?: { firstName?: string; lastName?: string };
}

interface RestaurantItem {
    _id?: string;
    name?: string;
}

interface RestaurantStaff {
    _id?: string;
    name?: string;
    role?: string;
}

interface RestaurantPayment {
    _id?: string;
    amount?: number | string;
    createdAt?: string;
}

const REPORT_TYPES: Array<{ key: 'monthly' | 'weekly' | 'all'; label: string; description: string }> = [
    { key: 'weekly', label: 'Weekly', description: 'Last 7 days of activity' },
    { key: 'monthly', label: 'Monthly', description: 'Last 30 days of activity' },
    { key: 'all', label: 'All time', description: 'Full restaurant history' },
];

const getReportStartDate = (type: 'monthly' | 'weekly' | 'all') => {
    const now = new Date();
    if (type === 'weekly') {
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    }
    if (type === 'monthly') {
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    return new Date(0);
};

const safeNumber = (value: number | string | undefined) => Number(value || 0);

const ReportsPage = () => {
    const [orders, setOrders] = useState<RestaurantOrder[]>([]);
    const [items, setItems] = useState<RestaurantItem[]>([]);
    const [staff, setStaff] = useState<RestaurantStaff[]>([]);
    const [payments, setPayments] = useState<RestaurantPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reportType, setReportType] = useState<'monthly' | 'weekly' | 'all'>('monthly');

    useEffect(() => {
        const loadReportData = async () => {
            setLoading(true);
            try {
                const [ordersRes, itemsRes, staffRes, paymentsRes] = await Promise.all([
                    getOrders({ limit: 100 }).catch(() => ({ orders: [] })),
                    getItems({ limit: 100 }).catch(() => ({ items: [] })),
                    getStaff({ active: true }).catch(() => ({ staff: [] })),
                    getPayments({ limit: 100 }).catch(() => ({ payments: [] })),
                ]);

                setOrders(ordersRes.orders || []);
                setItems(itemsRes.items || []);
                setStaff(staffRes.staff || []);
                setPayments(paymentsRes.payments || []);
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Unable to load report data.');
            } finally {
                setLoading(false);
            }
        };

        loadReportData();
    }, []);

    const filteredOrders = useMemo(() => {
        const lowerBound = getReportStartDate(reportType);
        return orders.filter((order) => {
            if (!order.createdAt) return false;
            const createdAt = new Date(order.createdAt);
            return createdAt >= lowerBound;
        });
    }, [orders, reportType]);

    const filteredPayments = useMemo(() => {
        const lowerBound = getReportStartDate(reportType);
        return payments.filter((payment) => {
            if (!payment.createdAt) return false;
            const createdAt = new Date(payment.createdAt);
            return createdAt >= lowerBound;
        });
    }, [payments, reportType]);

    const reportSummary = useMemo(() => {
        const totalRevenue = filteredPayments.reduce((sum, payment) => sum + safeNumber(payment.amount), 0);
        const paidOrders = filteredOrders.filter((order) => order.paymentStatus === 'paid').length;
        const pendingOrders = filteredOrders.filter((order) => order.status !== 'delivered' && order.status !== 'cancelled').length;
        const totalOrders = filteredOrders.length;
        const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
        const orderCaptureRate = totalOrders ? `${Math.round((paidOrders / totalOrders) * 100)}%` : '0%';

        return {
            totalRevenue,
            totalOrders,
            paidOrders,
            pendingOrders,
            averageOrderValue,
            menuItems: items.length,
            activeStaff: staff.length,
            totalPayments: filteredPayments.length,
            orderCaptureRate,
        };
    }, [filteredOrders, filteredPayments, items.length, staff.length]);

    const recentOrders = filteredOrders.slice(0, 6);
    const statusBreakdown = useMemo(() => {
        const breakdown = filteredOrders.reduce((acc: Record<string, number>, order) => {
            const key = order.status || 'unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
    }, [filteredOrders]);

    const pieColors = ['#f59e0b', '#22c55e', '#38bdf8', '#f97316', '#c084fc'];
    const theme = useRestaurantTheme();
    const isLight = theme === 'light';
    const reportLabel = REPORT_TYPES.find((option) => option.key === reportType)?.label || 'Monthly';

    const summaryCards = [
        { title: 'Total orders', value: reportSummary.totalOrders, description: 'Orders in this report window' },
        { title: 'Revenue', value: formatCurrency(reportSummary.totalRevenue, 'KES'), description: 'Collected payments' },
        { title: 'Paid orders', value: reportSummary.paidOrders, description: 'Completed transactions' },
        { title: 'Pending orders', value: reportSummary.pendingOrders, description: 'Orders still in progress' },
        { title: 'Menu items', value: reportSummary.menuItems, description: 'Active menu entries' },
        { title: 'Active staff', value: reportSummary.activeStaff, description: 'Team members on duty' },
        { title: 'Avg. order value', value: formatCurrency(reportSummary.averageOrderValue, 'KES'), description: 'Average checkout total' },
        { title: 'Capture rate', value: reportSummary.orderCaptureRate, description: 'Paid order percentage' },
    ];

    return (
        <div className="space-y-6 px-2 sm:px-0">
            <div className="rounded-[28px] border border-amber-500/20 bg-slate-950/90 p-6 shadow-[0_18px_60px_-20px_rgba(245,158,11,0.35)]">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Restaurant reports</p>
                        <h1 className="mt-3 text-3xl font-semibold text-white">Performance dashboard</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400">A consolidated view of restaurant orders, revenue, staff coverage, and payment health with print-ready reporting.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                            <p className="font-semibold text-white">Report window</p>
                            <p className="mt-1 text-slate-400">{reportLabel}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
                        >
                            Print report
                        </button>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.slice(0, 4).map((card) => (
                    <div key={card.title} className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-5">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{card.title}</p>
                        <p className="mt-4 text-3xl font-semibold text-white">{card.value}</p>
                        <p className="mt-3 text-sm text-slate-500">{card.description}</p>
                    </div>
                ))}
            </div>

            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-6">
                    <div className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Report summary</h2>
                                <p className="mt-1 text-sm text-slate-400">This summary is built from backend restaurant data and can be printed or shared as a team report.</p>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-3">
                                {REPORT_TYPES.map((option) => (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => setReportType(option.key)}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${reportType === option.key ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {summaryCards.map((card) => (
                                <div key={card.title} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{card.title}</p>
                                    <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
                                    <p className="mt-2 text-sm text-slate-500">{card.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-6">
                        <h2 className="text-xl font-semibold text-white">Activity trends</h2>
                        <p className="mt-1 text-sm text-slate-400">Orders and order sizes for the selected report window.</p>
                        <div className="mt-5 h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={recentOrders.map((order, index) => ({
                                        name: `#${index + 1}`,
                                        revenue: safeNumber(order.total),
                                        items: order.items?.length || 0,
                                    }))}
                                    margin={{ top: 10, right: 16, left: -10, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={40} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                                    <Bar dataKey="revenue" name="Revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="items" name="Items" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-6">
                        <h2 className="text-xl font-semibold text-white">Printable report</h2>
                        <p className="mt-2 text-sm text-slate-400">The following summary is designed to display cleanly when you use print output.</p>
                        <div className="mt-6 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 print:bg-white print:text-slate-900">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400 print:text-slate-700">Report period</p>
                                    <p className="mt-2 text-lg font-semibold text-white print:text-slate-900">{reportLabel}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 print:bg-slate-100 print:text-slate-700">Printable</div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 print:border-slate-300 print:bg-slate-100">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-slate-600">Total revenue</p>
                                    <p className="mt-3 text-2xl font-semibold text-white print:text-slate-900">{formatCurrency(reportSummary.totalRevenue, 'KES')}</p>
                                </div>
                                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 print:border-slate-300 print:bg-slate-100">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-slate-600">Orders</p>
                                    <p className="mt-3 text-2xl font-semibold text-white print:text-slate-900">{reportSummary.totalOrders}</p>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 print:border-slate-300 print:bg-slate-100">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-slate-600">Average order</p>
                                    <p className="mt-3 text-2xl font-semibold text-white print:text-slate-900">{formatCurrency(reportSummary.averageOrderValue, 'KES')}</p>
                                </div>
                                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 print:border-slate-300 print:bg-slate-100">
                                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 print:text-slate-600">Capture rate</p>
                                    <p className="mt-3 text-2xl font-semibold text-white print:text-slate-900">{reportSummary.orderCaptureRate}</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-300 print:text-slate-700">
                                <li>• Payment records: {reportSummary.totalPayments}</li>
                                <li>• Active staff: {reportSummary.activeStaff}</li>
                                <li>• Menu items: {reportSummary.menuItems}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-6">
                        <h2 className="text-xl font-semibold text-white">Order status</h2>
                        <p className="mt-2 text-sm text-slate-400">Visual breakdown of order states in the selected timeframe.</p>
                        <div className="mt-5 h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusBreakdown.length ? statusBreakdown : [{ name: 'No data', value: 1 }]}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={56}
                                        outerRadius={88}
                                        paddingAngle={4}
                                        stroke="transparent"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
                                    >
                                        {statusBreakdown.length
                                            ? statusBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${entry.name}`} fill={pieColors[index % pieColors.length]} />
                                            ))
                                            : <Cell fill="#475569" />}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                        itemStyle={{ color: '#f8fafc' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        iconType="circle"
                                        wrapperStyle={{ color: '#cbd5e1', fontSize: 12, marginTop: 12 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
};

export default ReportsPage;
