import { useState } from 'react';
import RegularPricingTab from './RegularPricingTab';
import ShuttlePricingTab from './ShuttlePricingTab';

const tabs = [
    { key: 'regular', label: 'Regular (Sedan, SUV, Bike, TukTuk)' },
    { key: 'shuttle', label: 'Shuttle (Van, Bus)' },
];

const DestinationPricesPage = () => {
    const [activeTab, setActiveTab] = useState('regular');

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Pricing</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Destination Prices</h2>
                <p className="mt-2 text-sm text-slate-400">Set fixed prices for routes and test fare calculations.</p>
            </div>

            <div className="flex gap-2 border-b border-slate-800 pb-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-3 text-sm font-medium rounded-t-xl transition ${
                            activeTab === tab.key
                                ? 'bg-slate-900 text-white border border-b-0 border-slate-800'
                                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'regular' && <RegularPricingTab />}
            {activeTab === 'shuttle' && <ShuttlePricingTab />}
        </div>
    );
};

export default DestinationPricesPage;