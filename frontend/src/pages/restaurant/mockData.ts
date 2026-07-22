type RestaurantProfile = {
    businessName: string;
    cuisine: string;
    phone: string;
    isOpen: boolean;
    deliveryEnabled: boolean;
};

type RestaurantMenuItem = {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    available: boolean;
};

type RestaurantOrder = {
    _id: string;
    customer: { firstName: string; lastName: string; phone: string };
    items: Array<{ _id: string; name: string; quantity: number; price: number }>;
    status: string;
    orderType: string;
    total: number;
    deliveryAddress: string;
    notes: string;
    paymentStatus: string;
};

type RestaurantStaffMember = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    active: boolean;
};

type RestaurantPromotion = {
    _id: string;
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    minAmount: number;
    maxUses: number;
    isActive: boolean;
    startDate: string;
    expiryDate: string;
};

type RestaurantPayment = {
    _id: string;
    reference: string;
    status: string;
    amount: number;
    currency: string;
};

type RestaurantReview = {
    _id: string;
    customerName: string;
    rating: number;
    comment: string;
    responded: boolean;
};

type RestaurantSettings = {
    notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    operations: {
        autoAcceptOrders: boolean;
        allowPickup: boolean;
        showBusyStatus: boolean;
        defaultPrepTime: number;
    };
};

type RestaurantMockState = {
    profile: RestaurantProfile;
    settings: RestaurantSettings;
    menu: RestaurantMenuItem[];
    orders: RestaurantOrder[];
    staff: RestaurantStaffMember[];
    promotions: RestaurantPromotion[];
    payments: RestaurantPayment[];
    reviews: RestaurantReview[];
};

const STORAGE_KEY = 'digitalsafaris_restaurant_scaffold';

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const defaultState: RestaurantMockState = {
    profile: {
        businessName: 'Digital Safaris Kitchen',
        cuisine: 'african',
        phone: '+254 700 000 000',
        isOpen: true,
        deliveryEnabled: true,
    },
    settings: {
        notifications: {
            email: true,
            sms: true,
            push: true,
        },
        operations: {
            autoAcceptOrders: true,
            allowPickup: true,
            showBusyStatus: true,
            defaultPrepTime: 25,
        },
    },
    menu: [
        { _id: createId('menu'), name: 'Nyama Choma Platter', description: 'Signature grilled meat platter for groups.', category: 'main', price: 1800, available: true },
        { _id: createId('menu'), name: 'Coconut Rice Bowl', description: 'Tropical rice bowl with roasted vegetables.', category: 'main', price: 950, available: true },
        { _id: createId('menu'), name: 'Mango Smoothie', description: 'Fresh tropical smoothie.', category: 'beverage', price: 450, available: true },
    ],
    orders: [
        { _id: createId('order'), customer: { firstName: 'Njeri', lastName: 'Otieno', phone: '+254 712 111 111' }, items: [{ _id: createId('item'), name: 'Nyama Choma Platter', quantity: 2, price: 1800 }], status: 'ready', orderType: 'delivery', total: 3600, deliveryAddress: 'Kilimani, Nairobi', notes: 'Add extra sauce', paymentStatus: 'paid' },
        { _id: createId('order'), customer: { firstName: 'Alex', lastName: 'Mwangi', phone: '+254 723 222 222' }, items: [{ _id: createId('item'), name: 'Coconut Rice Bowl', quantity: 1, price: 950 }], status: 'preparing', orderType: 'pickup', total: 950, deliveryAddress: 'Westlands, Nairobi', notes: '', paymentStatus: 'pending' },
    ],
    staff: [
        { _id: createId('staff'), firstName: 'Asha', lastName: 'Kariuki', email: 'asha@digitalsafaris.com', phone: '+254 710 555 555', role: 'manager', active: true },
        { _id: createId('staff'), firstName: 'Daniel', lastName: 'Kiptoo', email: 'daniel@digitalsafaris.com', phone: '+254 711 666 666', role: 'chef', active: true },
    ],
    promotions: [
        { _id: createId('promo'), code: 'LUNCH10', description: '10% off lunch orders', discountType: 'percentage', discountValue: 10, minAmount: 1000, maxUses: 50, isActive: true, startDate: '2026-07-01', expiryDate: '2026-07-31' },
    ],
    payments: [
        { _id: createId('payment'), reference: 'PMT-1001', status: 'completed', amount: 3600, currency: 'KES' },
        { _id: createId('payment'), reference: 'PMT-1002', status: 'pending', amount: 950, currency: 'KES' },
    ],
    reviews: [
        { _id: createId('review'), customerName: 'Fatma', rating: 5, comment: 'Excellent service and quick delivery.', responded: true },
        { _id: createId('review'), customerName: 'Kibet', rating: 4, comment: 'Food arrived warm and delicious.', responded: false },
    ],
};

const loadState = (): RestaurantMockState => {
    if (typeof window === 'undefined') return defaultState;
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) return defaultState;
        const parsed = JSON.parse(stored);
        return { ...defaultState, ...parsed };
    } catch {
        return defaultState;
    }
};

const saveState = (state: RestaurantMockState) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getRestaurantProfile = () => loadState().profile;
export const setRestaurantProfile = (profile: RestaurantProfile) => {
    const state = loadState();
    state.profile = profile;
    saveState(state);
};

export const getRestaurantSettings = () => loadState().settings;
export const setRestaurantSettings = (settings: RestaurantSettings) => {
    const state = loadState();
    state.settings = settings;
    saveState(state);
};

export const getRestaurantMenu = () => loadState().menu;
export const setRestaurantMenu = (menu: RestaurantMenuItem[]) => {
    const state = loadState();
    state.menu = menu;
    saveState(state);
};

export const getRestaurantOrders = () => loadState().orders;
export const setRestaurantOrders = (orders: RestaurantOrder[]) => {
    const state = loadState();
    state.orders = orders;
    saveState(state);
};

export const getRestaurantStaff = () => loadState().staff;
export const setRestaurantStaff = (staff: RestaurantStaffMember[]) => {
    const state = loadState();
    state.staff = staff;
    saveState(state);
};

export const getRestaurantPromotions = () => loadState().promotions;
export const setRestaurantPromotions = (promotions: RestaurantPromotion[]) => {
    const state = loadState();
    state.promotions = promotions;
    saveState(state);
};

export const getRestaurantPayments = () => loadState().payments;
export const setRestaurantPayments = (payments: RestaurantPayment[]) => {
    const state = loadState();
    state.payments = payments;
    saveState(state);
};

export const getRestaurantReviews = () => loadState().reviews;
export const setRestaurantReviews = (reviews: RestaurantReview[]) => {
    const state = loadState();
    state.reviews = reviews;
    saveState(state);
};

export const resetRestaurantMockData = () => {
    saveState(defaultState);
};
