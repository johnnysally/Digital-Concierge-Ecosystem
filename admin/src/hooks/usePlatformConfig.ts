import { useEffect, useState } from 'react';
import { getPublicSettings } from '../api/settingsApi';

interface PlatformConfig {
    default_currency: string;
    site_name: string;
    primary_color: string;
    [key: string]: any;
}

const usePlatformConfig = () => {
    const [config, setConfig] = useState<PlatformConfig>({ default_currency: 'USD', site_name: 'Digital Concierge', primary_color: '#3b82f6' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPublicSettings()
            .then((res) => setConfig(res.settings || res.config || config))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { config, loading };
};

export default usePlatformConfig;