import { useState } from 'react';
import TownsPage from './TownsPage';
import DestinationsPage from './DestinationsPage';

const LocationsPage = () => {
    const [tab, setTab] = useState<'towns' | 'destinations'>('towns');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Locations</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage towns and their destinations for transport routes.</p>
            </div>

            <div className="flex gap-2">
                <button onClick={() => setTab('towns')} className={`rounded-xl px-4 py-2 text-sm font-medium ${tab === 'towns' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>Towns</button>
                <button onClick={() => setTab('destinations')} className={`rounded-xl px-4 py-2 text-sm font-medium ${tab === 'destinations' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>Destinations</button>
            </div>

            {tab === 'towns' ? <TownsPage /> : <DestinationsPage />}
        </div>
    );
};

export default LocationsPage;