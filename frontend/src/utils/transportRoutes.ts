const TRANSPORT_PORTAL_BASE = '/transport-admin';

export const getTransportPath = (path = '') => {
    if (!path) return TRANSPORT_PORTAL_BASE;

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (normalizedPath.startsWith(TRANSPORT_PORTAL_BASE)) {
        return normalizedPath;
    }

    return `${TRANSPORT_PORTAL_BASE}${normalizedPath}`;
};