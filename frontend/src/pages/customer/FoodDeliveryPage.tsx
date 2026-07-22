import React, { useEffect, useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getMenu } from '../../api/customer/menuApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { api } from '../../api/axios';
import { useAuth } from '../../context/customer/AuthContext';

const FoodDeliveryPage = () => {
    const { user } = useAuth();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryCity, setDeliveryCity] = useState('');
    const [phone, setPhone] = useState(user?.phone || '');
    const [notes, setNotes] = useState('');
    const [orderError, setOrderError] = useState('');

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
        if (orderItems.length === 0) return;
        setOrderError('');
        try {
            await api.post('/customer/orders', {
                items: orderItems,
                orderType: 'delivery',
                deliveryAddress: { street: deliveryAddress, city: deliveryCity },
                customerPhone: phone,
                notes,
            });
            setOrderItems([]);
            setDeliveryAddress('');
            setDeliveryCity('');
            setNotes('');
            setOrderPlaced(true);
            setTimeout(() => setOrderPlaced(false), 4000);
        } catch (err: any) {
            setOrderError(err?.response?.data?.message || 'Order failed. Please try again.');
        }
    };

    const categories = ['', 'appetizer', 'main', 'dessert', 'beverage', 'side'];

    return (
        <div className="space-y-8">
            <SectionHeader title="Restaurant marketplace" subtitle="Browse menus, place orders, and track deliveries." />

            {orderPlaced && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">
                    Order placed successfully! The restaurant will start preparing soon.
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

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-slate-400 py-8 text-center">Loading menu...</div>
                    ) : items.length === 0 ? (
                        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                            <div className="text-5xl mb-4">🍽️</div>
                            <h3 className="text-xl font-semibold text-white">No menu items found</h3>
                            <p className="mt-2 text-sm">Try a different category or check back later.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5 flex items-center justify-between hover:border-emerald-700 transition-colors">
                                <div className="flex-1 mr-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                        {item.partner?.cuisine && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 capitalize">{item.partner.cuisine}</span>
                                        )}
                                    </div>
                                    {item.description && <p className="text-sm text-slate-400 mt-1">{item.description}</p>}
                                    <p className="text-xs text-slate-500 mt-2">
                                        <span className="text-emerald-400 font-medium">{item.partner?.businessName || 'Restaurant'}</span>
                                        <span className="mx-1">·</span>
                                        {item.category}
                                        {item.prepTime && <span> · {item.prepTime} min</span>}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xl font-bold text-white">{formatCurrency(item.price)}</p>
                                    <button onClick={() => addToOrder(item)}
                                        className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors">
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 h-fit sticky top-24">
                    <h3 className="text-lg font-semibold text-white">Your Order</h3>
                    {orderItems.length === 0 ? (
                        <p className="text-sm text-slate-400 mt-4">No items added yet. Browse the menu and add items to your order.</p>
                    ) : (
                        <>
                            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                                {orderItems.map((oi) => (
                                    <div key={oi.menuItem} className="flex items-center justify-between text-sm">
                                        <div>
                                            <span className="text-white">{oi.name}</span>
                                            <span className="text-slate-500 ml-2">x{oi.quantity}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white">{formatCurrency(oi.price * oi.quantity)}</span>
                                            <button onClick={() => removeFromOrder(oi.menuItem)} className="text-red-400 text-xs hover:text-red-300">×</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 space-y-3">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Delivery Address *</label>
                                    <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="Street address" required
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">City</label>
                                    <input value={deliveryCity} onChange={(e) => setDeliveryCity(e.target.value)}
                                        placeholder="City"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Phone Number *</label>
                                    <input value={phone} onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Your phone number" required
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Special Instructions</label>
                                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any special requests or notes..."
                                        rows={2}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 resize-none" />
                                </div>
                            </div>

                            <div className="border-t border-slate-800 mt-4 pt-4 flex justify-between">
                                <span className="font-semibold text-white">Total</span>
                                <span className="font-bold text-xl text-white">{formatCurrency(getTotal())}</span>
                            </div>
                            {orderError && <p className="text-xs text-red-400 mt-2">{orderError}</p>}
                            <button onClick={placeOrder}
                                className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors">
                                Place Order
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodDeliveryPage;