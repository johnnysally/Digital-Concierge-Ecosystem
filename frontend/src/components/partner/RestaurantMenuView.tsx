import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../api/axios';
import { formatCurrency } from '../../utils/formatCurrency';

interface MenuItem {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
    prepTime: number;
    tags: string[];
    available: boolean;
}

interface RestaurantMenuViewProps {
    partnerId: string;
    restaurantName: string;
    isOpen?: boolean;
    onClose: () => void;
}

const categoryTitles: Record<string, string> = {
    appetizer: 'Starters & Appetizers',
    main: 'Main Courses',
    dessert: 'Desserts & Sweets',
    beverage: 'Beverages & Drinks',
    side: 'Side Orders',
    combo: 'Combo Meals',
};

const categoryOrder = ['appetizer', 'main', 'dessert', 'beverage', 'side', 'combo'];

const RestaurantMenuView = ({ partnerId, restaurantName, isOpen = true, onClose }: RestaurantMenuViewProps) => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [partnerInfo, setPartnerInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        api.get('/public/menu')
            .then((res) => {
                const menuItems = (res.data.items || []).filter((item: any) =>
                    item.partner?._id === partnerId || item.partner === partnerId
                );
                setItems(menuItems);
                if (menuItems.length > 0 && menuItems[0].partner) {
                    setPartnerInfo(menuItems[0].partner);
                }
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [partnerId]);

    const groupedItems: Record<string, MenuItem[]> = {};
    items.forEach((item) => {
        if (!groupedItems[item.category]) groupedItems[item.category] = [];
        groupedItems[item.category].push(item);
    });

    const handlePrint = () => {
        window.print();
    };

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#fdf8f0] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div ref={printRef} className="p-8 print:p-4">
                    {/* Header */}
                    <div className="text-center border-b-2 border-amber-800 pb-6 mb-8 print:border-b print:pb-4 print:mb-4">
                        <div className="flex justify-center mb-3">
                            <span className="text-4xl">🍽️</span>
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-amber-900 tracking-wide">{restaurantName}</h1>
                        {partnerInfo?.cuisine && (
                            <p className="text-sm text-amber-700/60 mt-1 capitalize italic">{partnerInfo.cuisine.replace('_', ' ')} Cuisine</p>
                        )}
                        <div className="flex items-center justify-center gap-3 mt-3">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                            <span className={`text-sm font-medium ${isOpen ? 'text-emerald-700' : 'text-rose-700'}`}>{isOpen ? 'Open for Orders' : 'Currently Closed'}</span>
                        </div>
                        <p className="text-amber-700/70 text-xs mt-3 font-mono">{today}</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-16 text-slate-400">Loading menu...</div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-16 text-amber-800/60">No menu items available.</div>
                    ) : (
                        <>
                            {categoryOrder.map((cat) => {
                                const catItems = groupedItems[cat];
                                if (!catItems || catItems.length === 0) return null;
                                return (
                                    <div key={cat} className="mb-8 print:mb-6">
                                        <div className="border-b border-amber-300/50 pb-2 mb-4">
                                            <h2 className="text-lg font-serif font-bold text-amber-900 uppercase tracking-wider">
                                                {categoryTitles[cat] || cat}
                                            </h2>
                                        </div>
                                        <div className="space-y-4">
                                            {catItems.map((item) => (
                                                <div key={item._id} className={`flex items-start justify-between gap-4 py-2 border-b border-dashed border-amber-200/50 ${!item.available ? 'opacity-50' : ''}`}>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-serif font-bold text-amber-900 text-base">{item.name}</h3>
                                                            {!item.available && <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-medium">Sold Out</span>}
                                                            {item.tags?.map((tag) => (
                                                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">{tag}</span>
                                                            ))}
                                                        </div>
                                                        {item.description && <p className="text-xs text-amber-700/70 mt-1 italic leading-relaxed">{item.description}</p>}
                                                        {item.prepTime > 0 && <p className="text-[10px] text-amber-600/60 mt-1 font-mono">Prep: {item.prepTime} min</p>}
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="font-serif font-bold text-amber-900 text-lg">{formatCurrency(item.price)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Contact Footer */}
                            <div className="border-t-2 border-amber-800 mt-8 pt-6 print:mt-4 print:pt-3">
                                <div className="text-center space-y-2 mb-4">
                                    {partnerInfo?.email && (
                                        <p className="text-amber-800/60 text-xs font-mono">
                                            📧 <a href={`mailto:${partnerInfo.email}`} className="hover:text-amber-800 underline">{partnerInfo.email}</a>
                                        </p>
                                    )}
                                    {partnerInfo?.phone && (
                                        <p className="text-amber-800/60 text-xs font-mono">
                                            📞 <a href={`tel:${partnerInfo.phone}`} className="hover:text-amber-800">{partnerInfo.phone}</a>
                                        </p>
                                    )}
                                </div>
                                <p className="text-amber-800/50 text-xs font-mono text-center">All prices are in KES and include VAT</p>
                                <p className="text-amber-800/30 text-[10px] font-mono text-center mt-1">Digital Safaris · Menu as of {today}</p>
                                <p className="text-amber-800/30 text-[10px] font-mono text-center">For inquiries, contact the restaurant directly</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Action buttons */}
                <div className="sticky bottom-0 border-t border-amber-200 bg-[#fdf8f0] p-4 flex gap-3 print:hidden rounded-b-3xl">
                    <button onClick={handlePrint} className="flex-1 rounded-xl bg-amber-800 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition-colors">
                        🖨️ Print Menu
                    </button>
                    <button onClick={onClose} className="flex-1 rounded-xl border border-amber-300 px-4 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-50 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestaurantMenuView;