import React from 'react';

const SupportPage = () => {
    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Support</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Support center</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Get help with transport operations, account issues, and partner support.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                <p className="text-slate-400">Support actions will be available once the helpdesk APIs are integrated for transport partners.</p>
            </div>
        </div>
    );
};

export default SupportPage;
