let platformCurrency = 'USD';

export const setPlatformCurrency = (currency: string) => {
    platformCurrency = currency;
};

export const getPlatformCurrency = () => platformCurrency;

export const formatCurrency = (amount: number, currency?: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || platformCurrency,
    }).format(amount);
};

export const formatCompact = (amount: number) => {
    if (amount >= 1000000) return `${platformCurrency} ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${platformCurrency} ${(amount / 1000).toFixed(1)}K`;
    return `${platformCurrency} ${amount}`;
};