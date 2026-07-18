import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { getWallet, topUp, addPaymentMethod, removePaymentMethod } from '../../api/customer/walletApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { useTheme } from '../../context/customer/ThemeContext';

const WalletPage = () => {
    const { isDark } = useTheme();
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

    if (loading) return <div className={`rounded-3xl border p-8 text-sm ${isDark ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-slate-200 bg-white text-slate-600'}`}>Loading wallet...</div>;

    const balance = wallet?.balance || 0;
    const currency = wallet?.currency || 'USD';
    const transactions = wallet?.transactions || [];
    const savedMethods = wallet?.savedMethods || [];
    const surfaceClass = isDark
        ? 'rounded-3xl border border-slate-800 bg-slate-900/95 p-4 shadow-sm sm:p-6'
        : 'rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6';
    const inputClass = isDark
        ? 'w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500'
        : 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500';
    const mutedText = isDark ? 'text-slate-400' : 'text-slate-600';
    const strongText = isDark ? 'text-white' : 'text-slate-900';

    return (
        <div className="mx-auto max-w-6xl space-y-4 px-1 sm:space-y-6 sm:px-0">
            <SectionHeader title="Digital wallet" subtitle="Top up, manage payment methods, and track transactions." />
            {message && (
                <div className={`rounded-2xl border p-3 text-sm ${message.includes('Failed') ? 'border-red-500/30 bg-red-500/10 text-red-500' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'}`}>
                    {message}
                </div>
            )}

            <div className="grid gap-4 lg:grid-cols-3">
                <div className={surfaceClass}>
                    <p className={`text-sm ${mutedText}`}>Current balance</p>
                    <p className={`mt-3 text-3xl font-bold sm:text-4xl ${strongText}`}>{formatCurrency(balance, currency)}</p>
                    <p className={`mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Rewards: {wallet?.rewardsPoints || 0} points</p>
                </div>

                <div className={`${surfaceClass} lg:col-span-2`}>
                    <h3 className={`mb-4 text-lg font-semibold ${strongText}`}>Top Up Wallet</h3>
                    <div className="grid gap-3 md:grid-cols-3">
                        <input
                            type="number"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            placeholder="Amount"
                            className={inputClass}
                        />
                        <select
                            value={topUpMethod}
                            onChange={(e) => setTopUpMethod(e.target.value)}
                            className={inputClass}
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
                                className={inputClass}
                            />
                        )}
                    </div>
                    <button
                        onClick={handleTopUp}
                        disabled={processing}
                        className="mt-4 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : `Top Up via ${topUpMethod.toUpperCase()}`}
                    </button>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className={surfaceClass}>
                    <h3 className={`mb-4 text-lg font-semibold ${strongText}`}>Saved Payment Methods</h3>
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row">
                        <select
                            value={methodType}
                            onChange={(e) => setMethodType(e.target.value)}
                            className={`${inputClass} sm:max-w-[140px]`}
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
                            className={`${inputClass} flex-1`}
                        />
                        <button onClick={handleAddMethod} className="rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500">
                            Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {savedMethods.length === 0 ? (
                            <p className={`text-sm ${mutedText}`}>No saved methods.</p>
                        ) : (
                            savedMethods.map((m: any) => (
                                <div key={m._id} className={`flex flex-col gap-2 rounded-2xl p-3 text-sm sm:flex-row sm:items-center sm:justify-between ${isDark ? 'bg-slate-950/80' : 'bg-slate-50'}`}>
                                    <span className={`${isDark ? 'text-slate-300' : 'text-slate-700'} capitalize`}>{m.type} - {m.label}</span>
                                    <button onClick={() => handleRemoveMethod(m._id)} className="text-left text-xs font-medium text-red-500 hover:text-red-600">
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={surfaceClass}>
                    <h3 className={`mb-4 text-lg font-semibold ${strongText}`}>Recent Transactions</h3>
                    <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                        {transactions.length === 0 ? (
                            <p className={`text-sm ${mutedText}`}>No transactions yet.</p>
                        ) : (
                            transactions.map((tx: any, i: number) => (
                                <div key={tx._id || i} className={`flex flex-col gap-2 rounded-2xl p-3 text-sm sm:flex-row sm:items-center sm:justify-between ${isDark ? 'bg-slate-950/80' : 'bg-slate-50'}`}>
                                    <div>
                                        <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{tx.description}</p>
                                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{new Date(tx.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`font-semibold ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>
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