import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getPublicConfig } from '../api/customer/publicApi';

type BrandingContextValue = {
    logoUrl: string;
    faviconUrl: string;
    siteName: string;
};

const defaultBranding: BrandingContextValue = { logoUrl: '', faviconUrl: '', siteName: 'DigitalSafaris' };
const BrandingContext = createContext<BrandingContextValue>(defaultBranding);

const getAssetUrl = (value: unknown) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') {
        const asset = value as { url?: unknown; enabled?: unknown };
        if (typeof asset.url === 'string' && asset.enabled !== false) return asset.url;
    }
    return '';
};

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
    const [branding, setBranding] = useState<BrandingContextValue>(defaultBranding);

    useEffect(() => {
        getPublicConfig()
            .then((response) => {
                const config = response.config || {};
                setBranding({
                    logoUrl: getAssetUrl(config.site_logo),
                    faviconUrl: getAssetUrl(config.site_favicon),
                    siteName: config.site_name || 'DigitalSafaris',
                });
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!branding.faviconUrl) return;

        let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.href = branding.faviconUrl;
    }, [branding.faviconUrl]);

    return <BrandingContext.Provider value={branding}>{children}</BrandingContext.Provider>;
};

export const useBranding = () => useContext(BrandingContext);