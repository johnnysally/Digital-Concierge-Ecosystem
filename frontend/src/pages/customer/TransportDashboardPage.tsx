import { useState } from 'react';
import TransportChoiceScreen from './TransportChoiceScreen';
import RegularTransportTab from './RegularTransportTab';
import ShuttleTransportTab from './ShuttleTransportTab';

const TransportDashboardPage = () => {
    const [mode, setMode] = useState<'choose' | 'short' | 'long'>('choose');

    if (mode === 'short') return <RegularTransportTab onBack={() => setMode('choose')} />;
    if (mode === 'long') return <ShuttleTransportTab onBack={() => setMode('choose')} />;

    return <TransportChoiceScreen onSelect={setMode} />;
};

export default TransportDashboardPage;