import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getWallet, topUp, addPaymentMethod, removePaymentMethod } from '../../api/customer/walletApi';
import { formatCurrency } from '../../utils/formatCurrency';

const WalletPage = () => {
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [topUpMethod, setTopUpMethod] = useState('mpesa');
    const [topUpPhone, setTopUpPhone] = useState('');
    const [methodType, setMethodType] = useState('');
    const [methodLabel, setMethodLabel] = useState('');
    const [message, setMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchWallet = async () => {
        try {
            const res = await getWallet();
            setWallet(res.wallet);
        } catch { setMessage('Failed to load wallet.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchWallet(); }, []);

    const handleTopUp = async () => {
        if (!topUpAmount || parseFloat(topUpAmount) <= 0) return;
        setProcessing(true);
        setMessage('');
        try {
            const res = await topUp({
                amount: parseFloat(topUpAmount),
                method: topUpMethod,
                phone: topUpMethod === 'mpesa' ? topUpPhone : undefined,
            });
            if (topUpMethod === 'stripe' && res.payment?.clientSecret) {
                setMessage('Stripe payment initiated. Complete payment in the popup.');
            } else if (topUpMethod === 'mpesa' && res.payment?.checkoutRequestId) {
                setMessage('M-Pesa push sent to your phone. Enter PIN to complete.');
            }
            setTopUpAmount('');
            setTopUpPhone('');
            setTimeout(() => fetchWallet(), 5000);
        } catch { setMessage('Top-up failed. Try again.'); }
        finally { setProcessing(false); }
    };

    const handleAddMethod = async () => {
        if (!methodType || !methodLabel) return;
        try {
            await addPaymentMethod({ type: methodType, label: methodLabel, masked: '****' });
            setMethodType('');
            setMethodLabel('');
            setMessage('Payment method added.');
            fetchWallet();
        } catch { setMessage('Failed to add method.'); }
    };

    const handleRemoveMethod = async (id: string) => {
        try {
            await removePaymentMethod(id);
            setMessage('Payment method removed.');
            fetchWallet();
        } catch { setMessage('Failed to remove method.'); }
    };

    if (loading) return <div className="p-8 text-slate-400">Loading wallet...</div>;

    const balance = wallet?.balance || 0;
    const currency = wallet?.currency || 'USD';
    const transactions = wallet?.transactions || [];
    const savedMethods = wallet?.savedMethods || [];

    return (
        <div className="space-y-8">
            <SectionHeader title="Digital wallet" subtitle="Top up, manage payment methods, and track transactions." />
            {message && (
                <div className={`rounded-xl p-3 text-sm ${message.includes('Failed') ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                    {message}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <p className="text-sm text-slate-400">Current balance</p>
                    <p className="mt-3 text-4xl font-bold text-white">{formatCurrency(balance, currency)}</p>
                    <p className="mt-2 text-xs text-slate-500">Rewards: {wallet?.rewardsPoints || 0} points</p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4">Top Up Wallet</h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <input
                            type="number"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            placeholder="Amount"
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                        />
                        <select
                            value={topUpMethod}
                            onChange={(e) => setTopUpMethod(e.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                        >
                            <option value="mpesa">M-Pesa</option>
                            <option value="stripe">Stripe</option>
                        </select>
                        {topUpMethod === 'mpesa' && (
                            <input
                                type="text"
                                value={topUpPhone}
                                onChange={(e) => setTopUpPhone(e.target.value)}
                                placeholder="Phone (07XX...)"
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500"
                            />
                        )}
                    </div>
                    <button
                        onClick={handleTopUp}
                        disabled={processing}
                        className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                    >
                        {processing ? 'Processing...' : `Top Up via ${topUpMethod.toUpperCase()}`}
                    </button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Saved Payment Methods</h3>
                    <div className="flex gap-2 mb-4">
                        <select
                            value={methodType}
                            onChange={(e) => setMethodType(e.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                        >
                            <option value="">Type</option>
                            <option value="visa">Visa</option>
                            <option value="mastercard">Mastercard</option>
                            <option value="mpesa">M-Pesa</option>
                            <option value="airtel">Airtel Money</option>
                        </select>
                        <input
                            value={methodLabel}
                            onChange={(e) => setMethodLabel(e.target.value)}
                            placeholder="Label (e.g. Personal Visa)"
                            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                        />
                        <button onClick={handleAddMethod}
                            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500">Add</button>
                    </div>
                    <div className="space-y-2">
                        {savedMethods.length === 0 ? (
                            <p className="text-sm text-slate-400">No saved methods.</p>
                        ) : (
                            savedMethods.map((m: any) => (
                                <div key={m._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 text-sm">
                                    <span className="text-slate-300 capitalize">{m.type} - {m.label}</span>
                                    <button onClick={() => handleRemoveMethod(m._id)}
                                        className="text-xs text-red-400 hover:text-red-300">Remove</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {transactions.length === 0 ? (
                            <p className="text-sm text-slate-400">No transactions yet.</p>
                        ) : (
                            transactions.map((tx: any, i: number) => (
                                <div key={tx._id || i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 text-sm">
                                    <div>
                                        <p className="text-slate-300">{tx.description}</p>
                                        <p className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`font-semibold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;