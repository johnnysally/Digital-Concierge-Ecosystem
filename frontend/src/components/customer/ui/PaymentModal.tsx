import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../../utils/formatCurrency';
import { api } from '../../../api/axios';

interface PaymentModalProps {
    amount: number;
    bookingData?: any;
    orderData?: any;
    rideData?: any;
    onSuccess: (result?: any) => void;
    onCancel: () => void;
}

const PaymentModal = ({ amount, bookingData, orderData, rideData, onSuccess, onCancel }: PaymentModalProps) => {
    const [methods, setMethods] = useState<string[]>([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');

    useEffect(() => {
        api.get('/customer/payments/methods')
            .then((res) => setMethods(res.data.methods || []))
            .catch(() => setMethods(['mpesa', 'wallet']));
    }, []);

    const handlePay = async () => {
        if (!selectedMethod) { setError('Please select a payment method.'); return; }
        if (selectedMethod === 'mpesa' && !phone) { setError('Phone number is required for M-Pesa.'); return; }

        setLoading(true);
        setError('');
        setStep('processing');

        try {
            const payload: any = { method: selectedMethod, amount };
            if (bookingData) payload.bookingData = bookingData;
            if (orderData) payload.orderData = orderData;
            if (rideData) payload.rideData = rideData;
            if (selectedMethod === 'mpesa') payload.phone = phone;

            const res = await api.post('/customer/payments/process', payload);

            if (selectedMethod === 'wallet') {
                setStep('success');
                setTimeout(() => onSuccess(res.data.createdItem), 1500);
            } else if (selectedMethod === 'mpesa') {
                setStep('success');
                setTimeout(() => onSuccess(res.data), 2500);
            } else if (selectedMethod === 'stripe') {
                setError('Stripe coming soon. Use M-Pesa or Wallet.');
                setStep('select');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Payment failed. Please try again.');
            setStep('select');
        } finally {
            setLoading(false);
        }
    };

    const methodIcons: Record<string, string> = { wallet: '👛', mpesa: '📱', stripe: '💳' };
    const methodLabels: Record<string, string> = { wallet: 'Wallet Balance', mpesa: 'M-Pesa', stripe: 'Stripe (Card)' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                {step === 'select' && (
                    <>
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-semibold text-white">Complete Payment</h3>
                            <p className="mt-2 text-3xl font-bold text-emerald-400">{formatCurrency(amount)}</p>
                        </div>
                        {error && <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>}
                        <div className="space-y-3 mb-6">
                            {methods.map((method) => (
                                <button key={method} onClick={() => setSelectedMethod(method)}
                                    className={`w-full flex items-center gap-4 rounded-2xl border p-4 transition-all text-left ${selectedMethod === method ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-950 hover:border-slate-600'}`}>
                                    <span className="text-2xl">{methodIcons[method] || '💳'}</span>
                                    <div>
                                        <p className="font-semibold text-white">{methodLabels[method] || method}</p>
                                        <p className="text-xs text-slate-400">
                                            {method === 'wallet' ? 'Pay from your wallet balance' : method === 'mpesa' ? 'Pay via M-Pesa STK Push' : 'Pay with credit/debit card'}
                                        </p>
                                    </div>
                                    {selectedMethod === method && <span className="ml-auto text-emerald-400">✓</span>}
                                </button>
                            ))}
                        </div>
                        {selectedMethod === 'mpesa' && (
                            <div className="mb-4">
                                <label className="block text-sm text-slate-400 mb-2">M-Pesa Phone Number</label>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712345678"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={onCancel} className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800">Cancel</button>
                            <button onClick={handlePay} disabled={loading || !selectedMethod} className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
                                {loading ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
                            </button>
                        </div>
                    </>
                )}
                {step === 'processing' && (
                    <div className="text-center py-8">
                        <div className="flex justify-center gap-2 mb-6">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" />
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Processing Payment</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            {selectedMethod === 'mpesa' ? 'Check your phone for STK push and enter PIN.' : 'Please wait...'}
                        </p>
                    </div>
                )}
                {step === 'success' && (
                    <div className="text-center py-8">
                        <div className="text-5xl mb-4">✅</div>
                        <h3 className="text-xl font-semibold text-white">Payment Successful!</h3>
                        <p className="mt-2 text-sm text-slate-400">{formatCurrency(amount)} paid via {methodLabels[selectedMethod] || selectedMethod}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;