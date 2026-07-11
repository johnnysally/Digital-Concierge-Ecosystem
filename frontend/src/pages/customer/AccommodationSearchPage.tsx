import React, { useEffect, useState, useCallback } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { searchProperties } from '../../api/customer/propertyApi';
import { getMenu } from '../../api/customer/menuApi';
import { getVehicles } from '../../api/customer/vehicleApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { useTheme } from '../../context/customer/ThemeContext';

const tabs = [
    { key: 'stays', label: '🏨 Stays', icon: '🏨' },
    { key: 'food', label: '🍽️ Food', icon: '🍽️' },
    { key: 'rides', label: '🚗 Rides', icon: '🚗' },
];

let debounceTimer: ReturnType<typeof setTimeout>;

const AccommodationSearchPage = () => {
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('stays');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const doSearch = useCallback(async (searchTerm: string, tab: string, filterType: string, filterCategory: string) => {
        setLoading(true);
        setHasSearched(true);
        try {
            if (tab === 'stays') {
                const params: any = {};
                if (searchTerm) params.city = searchTerm;
                if (filterType) params.type = filterType;
                const res = await searchProperties(params);
                setResults(res.properties || []);
            } else if (tab === 'food') {
                const params: any = {};
                if (filterCategory) params.category = filterCategory;
                const res = await getMenu(params);
                setResults((res.items || []).filter((item: any) => !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase())));
            } else if (tab === 'rides') {
                const params: any = {};
                if (filterType) params.type = filterType;
                const res = await getVehicles(params);
                setResults((res.vehicles || []).filter((v: any) => !searchTerm || v.make?.toLowerCase().includes(searchTerm.toLowerCase()) || v.model?.toLowerCase().includes(searchTerm.toLowerCase())));
            }
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            doSearch(search, activeTab, type, category);
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [search, activeTab, type, category, doSearch]);

    useEffect(() => {
        setResults([]);
        setSearch('');
        setType('');
        setCategory('');
        setHasSearched(false);
    }, [activeTab]);

    const addToOrder = (item: any) => {
        setOrderPlaced(false);
        const existing = orderItems.find((oi) => oi.menuItem === item._id);
        if (existing) {
            setOrderItems(orderItems.map((oi) => oi.menuItem === item._id ? { ...oi, quantity: oi.quantity + 1 } : oi));
        } else {
            setOrderItems([...orderItems, { menuItem: item._id, name: item.name, quantity: 1, price: item.price }]);
        }
    };

    const removeFromOrder = (itemId: string) => {
        setOrderItems(orderItems.filter((oi) => oi.menuItem !== itemId));
    };

    const getTotal = () => orderItems.reduce((sum, oi) => sum + oi.price * oi.quantity, 0);

    const placeOrder = async () => {
        try {
            const { api } = await import('../../api/axios');
            await api.post('/customer/orders', { items: orderItems, orderType: 'delivery' });
            setOrderItems([]);
            setOrderPlaced(true);
            setTimeout(() => setOrderPlaced(false), 4000);
        } catch {}
    };

    const cardClass = isDark
        ? 'rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-sky-700 transition-colors'
        : 'rounded-3xl border border-gray-200 bg-white p-6 hover:border-sky-300 transition-colors shadow-sm';

    const inputClass = isDark
        ? 'rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500'
        : 'rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500';

    const types_stays = ['', 'hotel', 'bnb', 'apartment', 'villa', 'hostel'];
    const types_rides = ['', 'sedan', 'suv', 'van', 'bus', 'bike'];
    const categories_food = ['', 'appetizer', 'main', 'dessert', 'beverage', 'side'];

    return (
        <div className="space-y-8">
            <SectionHeader title="Explore" subtitle="Find stays, food, and rides across the DigitalSafaris network." />

            <div className="flex gap-2 flex-wrap">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={cardClass}>
                <div className="grid gap-4 sm:grid-cols-3">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={activeTab === 'stays' ? 'Search by city...' : activeTab === 'food' ? 'Search food...' : 'Search vehicles...'}
                        className={inputClass}
                    />
                    {activeTab === 'stays' && (
                        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                            {types_stays.map((t) => <option key={t} value={t}>{t || 'All Types'}</option>)}
                        </select>
                    )}
                    {activeTab === 'food' && (
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                            {categories_food.map((c) => <option key={c} value={c}>{c || 'All Categories'}</option>)}
                        </select>
                    )}
                    {activeTab === 'rides' && (
                        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                            {types_rides.map((t) => <option key={t} value={t}>{t || 'All Types'}</option>)}
                        </select>
                    )}
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12 gap-3">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
            )}

            {!loading && hasSearched && results.length === 0 && (
                <div className={`rounded-3xl border p-10 text-center ${isDark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    <div className="text-5xl mb-4">{activeTab === 'stays' ? '🏨' : activeTab === 'food' ? '🍽️' : '🚗'}</div>
                    <h3 className="text-xl font-semibold text-white">No results found</h3>
                    <p className="mt-2 text-sm text-slate-400">Try adjusting your search or filters.</p>
                </div>
            )}

            {!loading && !hasSearched && (
                <div className={`rounded-3xl border p-10 text-center ${isDark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    <div className="text-5xl mb-4">{activeTab === 'stays' ? '🏨' : activeTab === 'food' ? '🍽️' : '🚗'}</div>
                    <h3 className="text-xl font-semibold text-white">
                        {activeTab === 'stays' ? 'Find your perfect stay' : activeTab === 'food' ? 'Discover delicious meals' : 'Book your ride'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                        {activeTab === 'stays' ? 'Search by city or filter by type to see available accommodations.' :
                         activeTab === 'food' ? 'Browse by category or search for your favorite dishes.' :
                         'Filter by vehicle type to find the perfect ride.'}
                    </p>
                </div>
            )}

            {!loading && results.length > 0 && (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {activeTab === 'stays' && results.map((p) => (
                            <div key={p._id} className={`${cardClass} cursor-pointer`} onClick={() => window.location.href = `/property/${p._id}`}>
                                <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                                <p className="text-sm text-slate-400 mt-1 capitalize">{p.type} · {p.address?.city}, {p.address?.country}</p>
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {p.amenities?.slice(0, 3).map((a: string) => (
                                        <span key={a} className={`rounded-full px-3 py-1 text-xs ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-slate-600'}`}>{a}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-amber-400">★ {p.rating || 'New'}</span>
                                    <span className="text-xs text-slate-400">{p.reviewCount || 0} reviews</span>
                                </div>
                            </div>
                        ))}
                        {activeTab === 'food' && results.map((item) => (
                            <div key={item._id} className={cardClass}>
                                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                <p className="text-sm text-slate-400 mt-1 capitalize">{item.category}</p>
                                <p className="text-xs text-slate-500 mt-2">{item.description || ''}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xl font-bold text-white">{formatCurrency(item.price)}</span>
                                    <span className="text-xs text-slate-400">{item.prepTime} min</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); addToOrder(item); }}
                                    className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                                >
                                    Add to Order
                                </button>
                            </div>
                        ))}
                        {activeTab === 'rides' && results.map((v) => (
                            <div key={v._id} className={cardClass}>
                                <h3 className="text-lg font-semibold text-white capitalize">{v.make} {v.model}</h3>
                                <p className="text-sm text-slate-400 mt-1 capitalize">{v.type} · {v.plateNumber}</p>
                                <p className="text-xs text-slate-500 mt-2">Capacity: {v.capacity} seats</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xl font-bold text-white">{formatCurrency(v.pricePerKm)}<span className="text-sm text-slate-400">/km</span></span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${v.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>{v.status}</span>
                                </div>
                                <button
                                    onClick={() => window.location.href = `/transport?vehicle=${v._id}`}
                                    className="mt-4 w-full rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition-colors"
                                >
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>

                    {activeTab === 'food' && orderItems.length > 0 && (
                        <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 ${isDark ? 'bg-slate-900 border-t border-slate-800' : 'bg-white border-t border-gray-200 shadow-2xl'}`}>
                            <div className="max-w-4xl mx-auto flex items-center justify-between">
                                <div>
                                    <span className="font-semibold text-white">{orderItems.length} items</span>
                                    <span className="ml-2 text-slate-400">Total: {formatCurrency(getTotal())}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setOrderItems([])} className="rounded-xl bg-slate-700 px-4 py-2 text-xs font-semibold text-white">Clear</button>
                                    <button onClick={placeOrder} className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {orderPlaced && (
                        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg">
                            Order placed successfully!
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AccommodationSearchPage;