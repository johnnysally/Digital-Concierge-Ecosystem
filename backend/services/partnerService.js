const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const profile = {
    id: 'profile-1',
    name: 'Oceanview Suites',
    email: 'owner@oceanview.com',
    phone: '+1 555 123 4567',
    city: 'Miami',
    country: 'USA',
    currency: 'USD',
    timezone: 'America/New_York',
};

const settings = {
    id: 'settings-1',
    notificationsEnabled: true,
    autoAcceptBookings: false,
    currency: 'USD',
    timezone: 'America/New_York',
};

const properties = [
    {
        id: 'property-1',
        name: 'Oceanview Suites',
        location: 'Miami Beach',
        status: 'Active',
        rooms: 24,
        rating: 4.8,
    },
];

const rooms = [
    {
        id: 'room-1',
        name: 'Deluxe Ocean Suite',
        type: 'Suite',
        price: 320,
        status: 'Available',
    },
    {
        id: 'room-2',
        name: 'Executive King',
        type: 'King',
        price: 220,
        status: 'Occupied',
    },
];

const roomTypes = [
    { id: 'type-1', name: 'Suite' },
    { id: 'type-2', name: 'King' },
    { id: 'type-3', name: 'Twin' },
];

const staff = [
    { id: 'staff-1', name: 'Sophia Nguyen', role: 'Front Desk', email: 'sophia@oceanview.com' },
    { id: 'staff-2', name: 'Carlos Mendes', role: 'Housekeeping', email: 'carlos@oceanview.com' },
];

const guests = [
    { id: 'guest-1', name: 'Amani Hudson', email: 'amani@example.com', status: 'Checked in' },
    { id: 'guest-2', name: 'Noah Reed', email: 'noah@example.com', status: 'Reserved' },
];

const reservations = [
    {
        id: 'reservation-1',
        guestName: 'Amani Hudson',
        property: 'Oceanview Suites',
        room: 'Deluxe Ocean Suite',
        checkIn: '2026-07-10',
        checkOut: '2026-07-14',
        status: 'Confirmed',
        total: 1280,
    },
];

const orders = [
    { id: 'order-1', customer: 'Amani Hudson', status: 'Preparing', total: '$45.00', eta: '20 min' },
    { id: 'order-2', customer: 'Noah Reed', status: 'Out for delivery', total: '$32.50', eta: '12 min' },
];

const menuCategories = [
    {
        id: 'cat-1',
        name: 'Starters',
        description: 'Begin with our chef-recommended small plates.',
        items: [
            { id: 'item-1', name: 'Crispy Calamari', description: 'Lightly breaded with lemon aioli.', price: '$12' },
            { id: 'item-2', name: 'Bruschetta Trio', description: 'Tomato, mushroom, and pesto toppings.', price: '$10' },
        ],
    },
    {
        id: 'cat-2',
        name: 'Mains',
        description: 'Hearty entrees to satisfy every appetite.',
        items: [
            { id: 'item-3', name: 'Sea Bass', description: 'Pan-seared with herb butter.', price: '$28' },
            { id: 'item-4', name: 'Steak Frites', description: 'Grilled sirloin with fries.', price: '$32' },
        ],
    },
];

const deliveryRequests = [
    { id: 'delivery-1', orderId: 'order-1', deliveryType: 'Delivery', rider: 'Liam', eta: '20 min', status: 'Assigned' },
    { id: 'delivery-2', orderId: 'order-2', deliveryType: 'Pickup', rider: null, eta: 'Ready in 10 min', status: 'Ready' },
];

const paymentsOverview = {
    balance: '$5,420.00',
    pending: '$680.00',
    totalRevenue: '$38,240.00',
    commissions: '$3,820.00',
};

const analyticsSummary = [
    { label: 'Occupancy', value: '85%' },
    { label: 'Revenue', value: '$4.8K' },
    { label: 'Average Daily Orders', value: '32' },
];

const aiResponses = [];

const promotions = [
    { id: 'promo-1', title: 'Summer Launch Offer', description: '15% off ocean-view suites this month.', discount: 15 },
];

const documents = [
    { id: 'doc-1', name: 'Brand Guidelines', type: 'PDF', size: '1.4MB', uploadedAt: '2026-06-10' },
];

const reviews = [
    { id: 'review-1', guestName: 'Amani Hudson', rating: 5, comment: 'Excellent stay and service.', responded: false },
];

const housekeepingTasks = [
    { id: 'task-1', title: 'Clean suite 301', status: 'Pending', assignedTo: 'Carlos Mendes' },
];

const notifications = [
    { id: 'notification-1', title: 'New reservation', body: 'Guest booked Deluxe Ocean Suite for July 10.', read: false },
];

const payouts = [
    { id: 'payout-1', date: '2026-06-25', amount: 5400, status: 'Paid' },
];

const transactions = [
    { id: 'txn-1', date: '2026-06-24', amount: 320, type: 'Booking', status: 'Settled' },
];

const analyticsOccupancy = [
    { date: '2026-06-21', occupancy: 78 },
    { date: '2026-06-22', occupancy: 85 },
];

const analyticsRevenue = [
    { date: '2026-06-21', revenue: 4200 },
    { date: '2026-06-22', revenue: 4800 },
];

const threads = [
    { id: 'thread-1', subject: 'Room service inquiry', messages: [{ id: 'msg-1', from: 'guest', text: 'Can I get extra towels?', sentAt: '2026-06-23T10:05:00Z' }] },
];

const payments = {
    payouts,
    transactions,
};

function listProfile() {
    return profile;
}

function updateProfile(payload) {
    Object.assign(profile, payload);
    return profile;
}

function getSettings() {
    return settings;
}

function updateSettings(payload) {
    Object.assign(settings, payload);
    return settings;
}

function listProperties() {
    return properties;
}

function getProperty(id) {
    return properties.find((item) => item.id === id);
}

function createProperty(payload) {
    const property = { id: generateId(), ...payload };
    properties.push(property);
    return property;
}

function updateProperty(id, payload) {
    const property = getProperty(id);
    if (!property) return null;
    Object.assign(property, payload);
    return property;
}

function listRooms() {
    return rooms;
}

function listRoomTypes() {
    return roomTypes;
}

function createRoom(payload) {
    const room = { id: generateId(), ...payload };
    rooms.push(room);
    return room;
}

function updateRoom(id, payload) {
    const room = rooms.find((item) => item.id === id);
    if (!room) return null;
    Object.assign(room, payload);
    return room;
}

function listStaff() {
    return staff;
}

function createStaff(payload) {
    const member = { id: generateId(), ...payload };
    staff.push(member);
    return member;
}

function updateStaff(id, payload) {
    const member = staff.find((item) => item.id === id);
    if (!member) return null;
    Object.assign(member, payload);
    return member;
}

function listGuests() {
    return guests;
}

function getGuest(id) {
    return guests.find((item) => item.id === id);
}

function updateGuest(id, payload) {
    const guest = getGuest(id);
    if (!guest) return null;
    Object.assign(guest, payload);
    return guest;
}

function listReservations() {
    return reservations;
}

function getReservation(id) {
    return reservations.find((item) => item.id === id);
}

function updateReservation(id, payload) {
    const reservation = getReservation(id);
    if (!reservation) return null;
    Object.assign(reservation, payload);
    return reservation;
}

function cancelReservation(id) {
    const reservation = getReservation(id);
    if (!reservation) return null;
    reservation.status = 'Cancelled';
    return reservation;
}

function listPromotions() {
    return promotions;
}

function createPromotion(payload) {
    const promo = { id: generateId(), ...payload };
    promotions.push(promo);
    return promo;
}

function listOrders() {
    return orders;
}

function updateOrderStatus(id, payload) {
    const order = orders.find((item) => item.id === id);
    if (!order) return null;
    order.status = payload.status || order.status;
    return order;
}

function listMenuCategories() {
    return menuCategories;
}

function getDashboardMetrics() {
    return analyticsSummary.map((item) => ({ ...item, description: `Summary metric for ${item.label.toLowerCase()}.` }));
}

function listDeliveryRequests() {
    return deliveryRequests;
}

function getPaymentsOverview() {
    return paymentsOverview;
}

function getAnalyticsSummary() {
    return analyticsSummary;
}

function askAIAssistant(query) {
    const response = {
        response: query
            ? `AI recommendation based on your input: ${query}`
            : 'Ask me anything about restaurant operations, ordering, or revenue optimization.',
    };
    aiResponses.push({ id: generateId(), query, response: response.response, createdAt: new Date().toISOString() });
    return response;
}

function listDocuments() {
    return documents;
}

function createDocument(payload) {
    const document = { id: generateId(), ...payload };
    documents.push(document);
    return document;
}

function listReviews() {
    return reviews;
}

function respondToReview(id, response) {
    const review = reviews.find((item) => item.id === id);
    if (!review) return null;
    review.response = response;
    review.responded = true;
    review.responseAt = new Date().toISOString();
    return review;
}

function listHousekeepingTasks() {
    return housekeepingTasks;
}

function assignHousekeepingTask(id, payload) {
    const task = housekeepingTasks.find((item) => item.id === id);
    if (!task) return null;
    task.assignedTo = payload.staffId;
    task.status = 'Assigned';
    return task;
}

function completeHousekeepingTask(id) {
    const task = housekeepingTasks.find((item) => item.id === id);
    if (!task) return null;
    task.status = 'Completed';
    return task;
}

function listNotifications() {
    return notifications;
}

function markNotificationRead(id) {
    const notification = notifications.find((item) => item.id === id);
    if (!notification) return null;
    notification.read = true;
    return notification;
}

function listPayouts() {
    return payouts;
}

function listTransactions() {
    return transactions;
}

function getAnalyticsOccupancy() {
    return analyticsOccupancy;
}

function getAnalyticsRevenue() {
    return analyticsRevenue;
}

function getThreadMessages(threadId) {
    const thread = threads.find((item) => item.id === threadId);
    return thread ? thread.messages : [];
}

function createMessage(threadId, payload) {
    const thread = threads.find((item) => item.id === threadId);
    if (!thread) return null;
    const message = { id: generateId(), ...payload, sentAt: new Date().toISOString() };
    thread.messages.push(message);
    return message;
}

function getAIInsight(query) {
    return { query, insight: `Sample insight for query '${query}'` };
}

function recommendPricing(payload) {
    return { ...payload, suggestedPrice: payload.basePrice ? payload.basePrice * 1.12 : 0 };
}

module.exports = {
    listProfile,
    updateProfile,
    getSettings,
    updateSettings,
    listProperties,
    getProperty,
    createProperty,
    updateProperty,
    listRooms,
    listRoomTypes,
    createRoom,
    updateRoom,
    listStaff,
    createStaff,
    updateStaff,
    listGuests,
    getGuest,
    updateGuest,
    listReservations,
    getReservation,
    updateReservation,
    cancelReservation,
    listPromotions,
    createPromotion,
    listOrders,
    updateOrderStatus,
    listMenuCategories,
    getDashboardMetrics,
    listDeliveryRequests,
    getPaymentsOverview,
    getAnalyticsSummary,
    askAIAssistant,
    listDocuments,
    createDocument,
    listReviews,
    respondToReview,
    listHousekeepingTasks,
    assignHousekeepingTask,
    completeHousekeepingTask,
    listNotifications,
    markNotificationRead,
    listPayouts,
    listTransactions,
    getAnalyticsOccupancy,
    getAnalyticsRevenue,
    getThreadMessages,
    createMessage,
    getAIInsight,
    recommendPricing,
};
