import { useState } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import RegularTransportTab from './RegularTransportTab';
import ShuttleTransportTab from './ShuttleTransportTab';

const tabs = [
    { key: 'regular', label: 'Short Distance (Sedan, SUV, Bike, TukTuk)' },
    { key: 'shuttle', label: 'Long Distance (Van, Bus)' },
];

const TransportDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('regular');

    return (
        <div className="space-y-8">
            <SectionHeader title="Transport booking" subtitle="Book taxis, shuttles, and ride-hailing services." />

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

            {activeTab === 'regular' && <RegularTransportTab />}
            {activeTab === 'shuttle' && <ShuttleTransportTab />}
        </div>
    );
};

export default TransportDashboardPage;