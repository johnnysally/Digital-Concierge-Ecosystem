import { api } from '../axios';

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
    const res = await api.get('/accommodation/settings');
    return res.data.settings as AccommodationSettings;
};

export const updateAccommodationSettings = async (payload: Partial<AccommodationSettings>) => {
    const res = await api.put('/accommodation/settings', payload);
    return res.data.settings as AccommodationSettings;
};
