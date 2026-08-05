import React, { useEffect, useState, useMemo } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getMenu } from '../../api/customer/menuApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../context/customer/AuthContext';
import PaymentModal from '../../components/customer/ui/PaymentModal';
import RestaurantMenuView from '../../components/partner/RestaurantMenuView';

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
    const [showPayment, setShowPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [viewingMenu, setViewingMenu] = useState<{ partnerId: string; name: string } | null>(null);

    useEffect(() => {
        getMenu(category ? { category } : {})
            .then((res) => setItems(res.items || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));

        const saved = localStorage.getItem('food_cart');
        if (saved) {
            try {
                const savedItems = JSON.parse(saved);
                setOrderItems(savedItems);
                localStorage.removeItem('food_cart');
            } catch {}
        }
    }, [category]);

    const currentRestaurant = useMemo(() => {
        if (orderItems.length === 0) return null;
        const firstItem = items.find(i => i._id === orderItems[0]?.menuItem);
        return firstItem?.partner || null;
    }, [orderItems, items]);

    const addToOrder = (item: any) => {
        if (orderItems.length > 0 && currentRestaurant) {
            if (item.partner?._id !== currentRestaurant._id) {
                if (confirm(`Your cart has items from "${currentRestaurant.businessName}". Clear cart and add from "${item.partner?.businessName || 'this restaurant'}" instead?`)) {
                    setOrderItems([{ menuItem: item._id, name: item.name, quantity: 1, price: item.price }]);
                }
                return;
            }
        }

        const existing = orderItems.find((oi) => oi.menuItem === item._id);
        if (existing) {
            setOrderItems(orderItems.map((oi) => oi.menuItem === item._id ? { ...oi, quantity: oi.quantity + 1 } : oi));
        } else {
            setOrderItems([...orderItems, { menuItem: item._id, name: item.name, quantity: 1, price: item.price }]);
        }
    };

    const removeFromOrder = (id: string) => setOrderItems(orderItems.filter((oi) => oi.menuItem !== id));
    const getTotal = () => orderItems.reduce((sum, oi) => sum + oi.price * oi.quantity, 0);

    const handlePayNow = () => {
        if (orderItems.length === 0) return;
        setPaymentAmount(getTotal());
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setOrderItems([]); setDeliveryAddress(''); setDeliveryCity(''); setNotes('');
        setOrderPlaced(true);
        setTimeout(() => setOrderPlaced(false), 4000);
    };

    const categories = ['', 'appetizer', 'main', 'dessert', 'beverage', 'side'];

    return (
        <div className="space-y-8">
            <SectionHeader title="Restaurant marketplace" subtitle="Browse menus, place orders, and track deliveries." />
            {orderPlaced && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">Order placed successfully!</div>}

            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                    <button key={cat} onClick={() => setCategory(cat)} className={`rounded-xl px-4 py-2 text-sm font-medium ${category === cat ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>{cat || 'All'}</button>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <div className="space-y-3">
                    {loading ? <div className="text-slate-400 py-8 text-center">Loading menu...</div> :
                     items.length === 0 ? <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center"><div className="text-5xl mb-4">🍽️</div><h3 className="text-xl font-semibold text-white">No menu items</h3></div> :
                     items.map((item) => (
                        <div key={item._id} className={`rounded-3xl border p-5 transition-colors ${item.partner?._id === currentRestaurant?._id ? 'border-emerald-700 bg-emerald-950/20' : 'border-slate-800 bg-slate-900 hover:border-emerald-700'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                        {item.partner?.cuisine && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 capitalize">{item.partner.cuisine}</span>}
                                    </div>
                                    {item.description && <p className="text-sm text-slate-400 mt-1">{item.description}</p>}
                                    <p className="text-xs text-slate-500 mt-2">
                                        <span className="text-emerald-400 font-medium">{item.partner?.businessName || 'Restaurant'}</span>
                                        <span className="mx-1">·</span> {item.category} {item.prepTime && `· ${item.prepTime} min`}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0 flex flex-col items-end">
                                    <p className="text-xl font-bold text-white">{formatCurrency(item.price)}</p>
                                    <button onClick={() => addToOrder(item)} className="mt-2 w-20 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500">Add</button>
                                    {item.partner?._id && (
                                        <button onClick={() => setViewingMenu({ partnerId: item.partner._id, name: item.partner.businessName || 'Restaurant' })}
                                            className="mt-1 w-20 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors">
                                            📋 Menu
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 h-fit sticky top-24">
                    <h3 className="text-lg font-semibold text-white">Your Order</h3>
                    {currentRestaurant && (
                        <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                            🛒 <strong>{currentRestaurant.businessName}</strong>
                        </p>
                    )}
                    {orderItems.length === 0 ? <p className="text-sm text-slate-400 mt-4">No items added. Browse the menu to start your order.</p> : (
                        <>
                            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                                {orderItems.map((oi) => (
                                    <div key={oi.menuItem} className="flex items-center justify-between text-sm">
                                        <div><span className="text-white">{oi.name}</span><span className="text-slate-500 ml-2">x{oi.quantity}</span></div>
                                        <div className="flex items-center gap-3"><span className="text-white">{formatCurrency(oi.price * oi.quantity)}</span><button onClick={() => removeFromOrder(oi.menuItem)} className="text-red-400 text-xs">×</button></div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-3">
                                <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Street address *" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
                                <input value={deliveryCity} onChange={(e) => setDeliveryCity(e.target.value)} placeholder="City" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
                                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone *" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" />
                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" rows={2} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white resize-none" />
                            </div>
                            <div className="border-t border-slate-800 mt-4 pt-4 flex justify-between"><span className="font-semibold text-white">Total</span><span className="font-bold text-xl text-white">{formatCurrency(getTotal())}</span></div>
                            {orderError && <p className="text-xs text-red-400 mt-2">{orderError}</p>}
                            <button onClick={handlePayNow} className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">Pay Now - {formatCurrency(getTotal())}</button>
                        </>
                    )}
                </div>
            </div>

            {showPayment && (
                <PaymentModal amount={paymentAmount} orderData={{ items: orderItems, orderType: 'delivery', deliveryAddress: { street: deliveryAddress, city: deliveryCity }, customerPhone: phone, notes }}
                    onSuccess={handlePaymentSuccess} onCancel={() => setShowPayment(false)} />
            )}

            {viewingMenu && (
                <RestaurantMenuView partnerId={viewingMenu.partnerId} restaurantName={viewingMenu.name} onClose={() => setViewingMenu(null)} />
            )}
        </div>
    );
};

export default FoodDeliveryPage;