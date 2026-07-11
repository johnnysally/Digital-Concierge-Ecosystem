export const formatCurrency = (amount: number, currency?: string) => {
    let curr = currency || 'KES';
    try {
        const stored = localStorage.getItem('digitalsafaris_customer');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.user?.currency) {
                curr = parsed.user.currency;
            }
        }
    } catch {}

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: curr,
    }).format(amount || 0);
};