const travelerProfiles = [
    {
        name: 'Amani Hudson',
        relation: 'Family',
        status: 'Primary',
        lastTrip: 'Dubai Business Suite',
    },
    {
        name: 'Mia Park',
        relation: 'Spouse',
        status: 'Verified',
        lastTrip: 'Maldives Escape',
    },
    {
        name: 'Noah Reed',
        relation: 'Guest',
        status: 'Pending',
        lastTrip: 'Safari Essentials',
    },
];

const promotions = [
    {
        title: 'Priority Lounge Access',
        description: 'Unlock airport lounges worldwide with a single concierge pass and enjoy premium rest zones before departure.',
        tag: 'Premium',
    },
    {
        title: 'Flexible Journey Credits',
        description: 'Redeem travel credit for tickets, car transfers, or dining upgrades across our partner network.',
        tag: 'Flexible',
    },
    {
        title: 'Smart Trip Bundles',
        description: 'Receive curated travel bundles with hotel, ride, and concierge support tailored to your itinerary.',
        tag: 'Recommended',
    },
];

async function getTravelerProfiles() {
    return travelerProfiles;
}

async function getPromotions() {
    return promotions;
}

module.exports = {
    getTravelerProfiles,
    getPromotions,
};
