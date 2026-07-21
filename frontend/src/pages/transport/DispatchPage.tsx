import React from 'react';

const DispatchPage = () => {
    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Dispatch</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Dispatch center</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Assign rides, choose drivers, and oversee transport dispatch operations.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                <p className="text-slate-400">Dispatch workflow will be enabled once transport ride assignment APIs are connected.</p>
            </div>
        </div>
    );
};

export default DispatchPage;
