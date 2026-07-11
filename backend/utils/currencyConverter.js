const PlatformSettings = require('../models/admin/PlatformSettings');

const getDefaultCurrency = async () => {
    try {
        const setting = await PlatformSettings.findOne({ key: 'default_currency' });
        return setting?.value || 'KES';
    } catch {
        return 'KES';
    }
};

const getExchangeRates = async () => {
    try {
        const setting = await PlatformSettings.findOne({ key: 'exchange_rates' });
        return setting?.value || { KES: 1, USD: 0.0077, EUR: 0.0071, GBP: 0.0061 };
    } catch {
        return { KES: 1 };
    }
};

module.exports = { getDefaultCurrency, getExchangeRates };