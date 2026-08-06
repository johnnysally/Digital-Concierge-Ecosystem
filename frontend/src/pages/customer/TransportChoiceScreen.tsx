import React from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';

type Props = {
    onSelect: (mode: 'short' | 'long') => void;
};

const TransportChoiceScreen = ({ onSelect }: Props) => {
    return (
        <div className="space-y-8">
            <SectionHeader title="Transport booking" subtitle="Choose how you'd like to travel." />

            <div className="grid gap-6 sm:grid-cols-2">
                <button
                    onClick={() => onSelect('short')}
                    className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-left hover:border-sky-500/50 hover:bg-slate-900/80 transition group"
                >
                    <div className="text-5xl mb-4">🚗</div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-sky-400 transition">Short Distance</h3>
                    <p className="mt-2 text-sm text-slate-400">Quick rides around town — taxi, sedan, SUV, bike, or tuk-tuk. Point to point, on demand.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {['Sedan', 'SUV', 'Bike', 'Tuk-tuk'].map((t) => (
                            <span key={t} className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">{t}</span>
                        ))}
                    </div>
                </button>

                <button
                    onClick={() => onSelect('long')}
                    className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-left hover:border-emerald-500/50 hover:bg-slate-900/80 transition group"
                >
                    <div className="text-5xl mb-4">🚌</div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-emerald-400 transition">Long Distance</h3>
                    <p className="mt-2 text-sm text-slate-400">Intercity travel — bus or shuttle with scheduled departures, seat selection, and fixed pricing.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {['Bus', 'Shuttle', 'Scheduled', 'Seat picker'].map((t) => (
                            <span key={t} className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-300">{t}</span>
                        ))}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default TransportChoiceScreen;