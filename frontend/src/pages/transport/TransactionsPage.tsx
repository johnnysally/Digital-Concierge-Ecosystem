import React from 'react';

const TransactionsPage = () => {
    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Transactions</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Transport transactions</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Review transport payment records, refunds, and transaction history.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                <p className="text-slate-400">Transactions will appear here once wallet and payment APIs are connected for transport operations.</p>
            </div>
        </div>
    );
};

export default TransactionsPage;
