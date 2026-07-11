import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getMenu } from '../../api/customer/menuApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { api } from '../../api/axios';

const FoodDeliveryPage = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        getMenu(category ? { category } : {})
            .then((res) => setItems(res.items || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [category]);

    const addToOrder = (item: any) => {
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
            await api.post('/customer/orders', { items: orderItems, orderType: 'delivery' });
            setOrderItems([]);
            setOrderPlaced(true);
            setTimeout(() => setOrderPlaced(false), 3000);
        } catch {}
    };

    const categories = ['', 'appetizer', 'main', 'dessert', 'beverage', 'side'];

    return (
        <div className="space-y-8">
            <SectionHeader title="Restaurant marketplace" subtitle="Browse menus, place orders, and track deliveries." />

            {orderPlaced && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">
                    Order placed successfully! Track it in your bookings.
                </div>
            )}

            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                    <button key={cat} onClick={() => setCategory(cat)}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${category === cat ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {cat || 'All'}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-slate-400">Loading menu...</div>
                    ) : items.length === 0 ? (
                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">No menu items found.</div>
                    ) : (
                        items.map((item) => (
                            <div key={item._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                    <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                                    <p className="text-xs text-slate-500 mt-2 capitalize">{item.category} {item.prepTime && `· ${item.prepTime} min`}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-white">{formatCurrency(item.price)}</p>
                                    <button onClick={() => addToOrder(item)}
                                        className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500">Add</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 h-fit sticky top-24">
                    <h3 className="text-lg font-semibold text-white">Your Order</h3>
                    {orderItems.length === 0 ? (
                        <p className="text-sm text-slate-400 mt-4">No items added yet.</p>
                    ) : (
                        <>
                            <div className="mt-4 space-y-3">
                                {orderItems.map((oi) => (
                                    <div key={oi.menuItem} className="flex items-center justify-between text-sm">
                                        <div>
                                            <span className="text-white">{oi.name}</span>
                                            <span className="text-slate-500 ml-2">x{oi.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white">{formatCurrency(oi.price * oi.quantity)}</span>
                                            <button onClick={() => removeFromOrder(oi.menuItem)} className="text-red-400 text-xs">×</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-slate-800 mt-4 pt-4 flex justify-between">
                                <span className="font-semibold text-white">Total</span>
                                <span className="font-bold text-xl text-white">{formatCurrency(getTotal())}</span>
                            </div>
                            <button onClick={placeOrder}
                                className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500">Place Order</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodDeliveryPage;