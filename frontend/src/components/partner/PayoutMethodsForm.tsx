import React, { useState } from 'react';

interface PayoutMethod {
    type: string;
    label: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
    branchCode: string;
    isDefault: boolean;
}

interface Props {
    methods: PayoutMethod[];
    onSave: (methods: PayoutMethod[]) => Promise<void>;
    isDark?: boolean;
}

const methodTypes = [
    { value: 'mpesa_send', label: 'M-Pesa Send Money' },
    { value: 'mpesa_till', label: 'M-Pesa Till Number' },
    { value: 'mpesa_paybill', label: 'M-Pesa Paybill' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
];

const PayoutMethodsForm = ({ methods: initialMethods, onSave, isDark = true }: Props) => {
    const [methods, setMethods] = useState<PayoutMethod[]>(initialMethods || []);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const addMethod = () => {
        setMethods([...methods, { type: 'mpesa_send', label: '', accountNumber: '', accountName: '', bankName: '', branchCode: '', isDefault: false }]);
    };

    const removeMethod = (index: number) => {
        setMethods(methods.filter((_, i) => i !== index));
    };

    const updateMethod = (index: number, field: string, value: any) => {
        const updated = [...methods];
        updated[index] = { ...updated[index], [field]: value };
        setMethods(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await onSave(methods);
            setMessage('Payout methods saved.');
        } catch {
            setMessage('Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = isDark
        ? 'w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500'
        : 'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Payout Methods</h3>
                <button onClick={addMethod}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500">+ Add Method</button>
            </div>

            {message && (
                <div className={`rounded-xl p-3 text-sm ${message.includes('Failed') ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{message}</div>
            )}

            {methods.length === 0 ? (
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No payout methods added. Add how you'd like to receive payments.</p>
            ) : (
                <div className="space-y-3">
                    {methods.map((method, index) => (
                        <div key={index} className={`rounded-xl border p-4 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex justify-between mb-3">
                                <select value={method.type} onChange={(e) => updateMethod(index, 'type', e.target.value)} className={inputClass + ' w-48'}>
                                    {methodTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                                <button onClick={() => removeMethod(index)} className="text-xs text-rose-400 hover:text-rose-300">Remove</button>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <input value={method.label} onChange={(e) => updateMethod(index, 'label', e.target.value)} placeholder="Label (e.g. Business M-Pesa)" className={inputClass} />
                                <input value={method.accountNumber} onChange={(e) => updateMethod(index, 'accountNumber', e.target.value)} placeholder="Account/Phone Number" className={inputClass} />
                                <input value={method.accountName} onChange={(e) => updateMethod(index, 'accountName', e.target.value)} placeholder="Account Name" className={inputClass} />
                                {method.type === 'bank' && (
                                    <>
                                        <input value={method.bankName} onChange={(e) => updateMethod(index, 'bankName', e.target.value)} placeholder="Bank Name" className={inputClass} />
                                        <input value={method.branchCode} onChange={(e) => updateMethod(index, 'branchCode', e.target.value)} placeholder="Branch Code" className={inputClass} />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {methods.length > 0 && (
                <button onClick={handleSave} disabled={saving}
                    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Payout Methods'}
                </button>
            )}
        </div>
    );
};

export default PayoutMethodsForm;