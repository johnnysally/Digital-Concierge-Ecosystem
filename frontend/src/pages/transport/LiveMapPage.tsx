import React from 'react';

const LiveMapPage = () => {
    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Live Map</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Real-time fleet map</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">Monitor vehicle locations, active rides, and transport dispatch status in real time.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                <p className="text-slate-400">Live map support is coming soon. Once transport location APIs are available, this page will show your current fleet and ride tracking data.</p>
            </div>
        </div>
    );
};

export default LiveMapPage;
