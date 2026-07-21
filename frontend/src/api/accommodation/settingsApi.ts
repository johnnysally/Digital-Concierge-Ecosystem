import { api } from '../axios';

let accommodationSettingsRequest: Promise<AccommodationSettings | null> | null = null;

const hasAccommodationSession = () => {
    if (typeof window === 'undefined') return false;
    try {
        const storedValue = window.localStorage.getItem('digitalsafaris_accommodation');
        if (!storedValue) return false;
        const parsedValue = JSON.parse(storedValue);
        return Boolean(parsedValue?.token);
    } catch {
        return false;
    }
};

export interface AccommodationSettings {
    businessName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    timezone: string;
    currency: string;
    language: string;
    portalName: string;
    portalTagline: string;
    accentColor: string;
    secondaryColor: string;
    defaultView: string;
    allowInstantBooking: boolean;
    requireApproval: boolean;
    autoConfirmReservations: boolean;
    sendArrivalReminders: boolean;
    sendCheckoutReminders: boolean;
    sendHousekeepingAlerts: boolean;
    enableEmailNotifications: boolean;
    enableSmsNotifications: boolean;
    enableGuestMessaging: boolean;
    enableReviewRequests: boolean;
    paymentProvider: string;
    calendarSync: boolean;
    cloudStorage: boolean;
    supportEmail: string;
    supportPhone: string;
    termsUrl: string;
    privacyUrl: string;
    maintenanceMode: boolean;
    themeMode: 'light' | 'dark' | 'system';
    themePreset: 'professional' | 'emerald' | 'ocean' | 'midnight';
}

export const getAccommodationSettings = async () => {
    if (!hasAccommodationSession()) {
        return {} as AccommodationSettings;
    }

    if (!accommodationSettingsRequest) {
        accommodationSettingsRequest = api.get('/accommodation/settings')
            .then((res) => res.data.settings as AccommodationSettings)
            .finally(() => {
                accommodationSettingsRequest = null;
            });
    }

    return accommodationSettingsRequest;
};

export const updateAccommodationSettings = async (payload: Partial<AccommodationSettings>) => {
    const res = await api.put('/accommodation/settings', payload);
    return res.data.settings as AccommodationSettings;
};
