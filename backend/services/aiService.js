const axios = require('axios');
const PlatformSettings = require('../models/admin/PlatformSettings');
const logger = require('../utils/logger');

const conversationHistory = [];

const getSetting = async (key) => {
    try {
        const setting = await PlatformSettings.findOne({ key });
        return setting?.value || null;
    } catch {
        return null;
    }
};

const getProvider = async () => {
    const provider = await getSetting('ai_provider');
    return provider || 'keyword';
};

const getPlatformContext = async () => {
    try {
        const Property = require('../models/accommodation/Property');
        const Room = require('../models/accommodation/Room');
        const MenuItem = require('../models/restaurant/MenuItem');
        const Vehicle = require('../models/transport/Vehicle');

        const [properties, rooms, menuItems, vehicles, siteName, supportEmail, supportPhone, defaultCurrency] = await Promise.all([
            Property.find({ published: true }).limit(10).lean(),
            Room.find({ status: 'available' }).populate('property', 'name').limit(20).lean(),
            MenuItem.find({ available: true }).populate('partner', 'businessName').limit(10).lean(),
            Vehicle.find({ status: 'available' }).populate('partner', 'businessName').limit(10).lean(),
            getSetting('site_name'),
            getSetting('support_email'),
            getSetting('support_phone'),
            getSetting('default_currency'),
        ]);

        const currency = defaultCurrency || 'KES';

        const propertyList = properties.length > 0
            ? properties.map(p => `- ${p.name} (${p.type}) in ${p.address?.city}, ${p.address?.country}. Rating: ${p.rating || 'New'} (${p.reviewCount || 0} reviews). Amenities: ${p.amenities?.join(', ') || 'N/A'}. Check-in: ${p.checkInTime || '14:00'}, Check-out: ${p.checkOutTime || '11:00'}`).join('\n')
            : 'No properties currently listed.';

        const roomList = rooms.length > 0
            ? rooms.map(r => `- ${r.property?.name || 'Property'} - ${r.type} Room ${r.roomNumber}: ${currency} ${r.price.toLocaleString()}/night, Capacity: ${r.capacity} guest(s). Status: ${r.status}. Amenities: ${r.amenities?.join(', ') || 'N/A'}. Floor: ${r.floor || 'N/A'}`).join('\n')
            : 'No rooms available.';

        const menuList = menuItems.length > 0
            ? menuItems.map(m => `- ${m.name} (${m.category}) from ${m.partner?.businessName || 'Restaurant'} - ${currency} ${m.price.toLocaleString()}. Prep time: ${m.prepTime}min. ${m.description || ''}`).join('\n')
            : 'No menu items currently listed.';

        const vehicleList = vehicles.length > 0
            ? vehicles.map(v => `- ${v.make} ${v.model} (${v.type}) from ${v.partner?.businessName || 'Transport'}. Plate: ${v.plateNumber}. ${currency} ${v.pricePerKm.toLocaleString()}/km. Capacity: ${v.capacity} seats. Status: ${v.status}. Base fare: ${currency} ${(v.baseFare || 0).toLocaleString()}`).join('\n')
            : 'No vehicles currently listed.';

        return {
            siteName: siteName || 'Digital Concierge',
            supportEmail: supportEmail || 'support@digitalconcierge.com',
            supportPhone: supportPhone || 'N/A',
            currency,
            propertyList,
            roomList,
            menuList,
            vehicleList,
            totalProperties: properties.length,
            totalRooms: rooms.length,
            totalMenuItems: menuItems.length,
            totalVehicles: vehicles.length,
        };
    } catch (error) {
        logger.error(`Failed to load platform context: ${error.message}`);
        return {
            siteName: 'Digital Concierge',
            supportEmail: 'support@digitalconcierge.com',
            supportPhone: 'N/A',
            currency: 'KES',
            propertyList: 'Unable to load properties.',
            roomList: 'Unable to load rooms.',
            menuList: 'Unable to load menu.',
            vehicleList: 'Unable to load vehicles.',
            totalProperties: 0,
            totalRooms: 0,
            totalMenuItems: 0,
            totalVehicles: 0,
        };
    }
};

const buildSystemPrompt = (ctx) => `You are the ${ctx.siteName} AI assistant, a travel concierge for a unified travel platform.

PLATFORM SUMMARY:
- ${ctx.totalProperties} properties, ${ctx.totalRooms} available rooms
- ${ctx.totalMenuItems} menu items, ${ctx.totalVehicles} vehicles
- Support: ${ctx.supportEmail} | ${ctx.supportPhone}
- Currency: ${ctx.currency}

AVAILABLE ACCOMMODATIONS (Properties):
${ctx.propertyList}

AVAILABLE ROOMS & PRICES:
${ctx.roomList}

AVAILABLE RESTAURANT MENU ITEMS:
${ctx.menuList}

AVAILABLE TRANSPORT VEHICLES:
${ctx.vehicleList}

IMPORTANT INSTRUCTIONS:
- Always give exact prices and details from the data above when available.
- If exact prices aren't listed, tell the user where to find them.
- Suggest specific properties, rooms, menu items, or vehicles by name.
- For bookings: direct to Search page to view properties and book rooms.
- For food orders: direct to Food page to browse menus and place orders.
- For rides: direct to Transport page to book vehicles.
- For wallet/payments: direct to Wallet page.
- For account issues: direct to Profile or Settings page.
- For help: direct to Support page or provide support contact info.
- Be friendly, conversational, and helpful. Use emojis occasionally.
- Keep responses concise but informative.`;

const keywordResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hotel') || lowerMessage.includes('stay') || lowerMessage.includes('accommodation')) {
        return {
            reply: 'I found several great options for you. Based on your preferences, I recommend checking properties in the city center with ratings above 4.5. Would you like me to filter by budget or amenities?',
            suggestions: ['Show budget-friendly options', 'Filter by pool and gym', 'Show family-friendly stays'],
        };
    }
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('dining')) {
        return {
            reply: 'There are excellent dining options near your location. I can help you find restaurants by cuisine, rating, or delivery time. What are you in the mood for?',
            suggestions: ['Italian nearby', 'Fast delivery under 30min', 'Top rated this week'],
        };
    }
    if (lowerMessage.includes('transport') || lowerMessage.includes('ride') || lowerMessage.includes('taxi')) {
        return {
            reply: 'I can help you book a ride. Current availability is good in your area. Would you like a standard ride, premium, or airport transfer?',
            suggestions: ['Standard ride now', 'Airport transfer', 'Schedule for later'],
        };
    }
    if (lowerMessage.includes('booking') || lowerMessage.includes('reservation')) {
        return {
            reply: 'You can manage your bookings from the Bookings page. Would you like to view details, modify, or cancel any bookings?',
            suggestions: ['View my bookings', 'Modify check-in dates', 'Cancel a booking'],
        };
    }
    if (lowerMessage.includes('wallet') || lowerMessage.includes('payment') || lowerMessage.includes('balance')) {
        return {
            reply: 'Your wallet is ready for payments. You can top up via M-Pesa or Stripe from the Wallet page. Would you like me to guide you?',
            suggestions: ['Top up wallet', 'View payment history', 'Add payment method'],
        };
    }

    return {
        reply: "I'm here to help with your travel needs. I can assist with accommodations, dining, transport, bookings, payments, and local recommendations. What would you like to know?",
        suggestions: ['Find a hotel', 'Order food', 'Book a ride', 'Check my bookings'],
    };
};

const openaiResponse = async (message) => {
    try {
        const apiKey = await getSetting('openai_api_key');
        if (!apiKey) {
            logger.warn('OpenAI API key not set, falling back to keyword');
            return keywordResponse(message);
        }

        const ctx = await getPlatformContext();
        const systemPrompt = buildSystemPrompt(ctx);

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message },
                ],
                max_tokens: 500,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            reply: response.data.choices[0].message.content,
            suggestions: [],
        };
    } catch (error) {
        logger.error(`OpenAI error: ${error.message}`);
        return keywordResponse(message);
    }
};

const hdmaiResponse = async (message) => {
    try {
        const baseUrl = await getSetting('hdm_ai_url');
        const apiKey = await getSetting('hdm_ai_api_key');

        if (!baseUrl || !apiKey) {
            logger.warn('HDM AI not configured, falling back to keyword');
            return keywordResponse(message);
        }

        const ctx = await getPlatformContext();
        const systemPrompt = buildSystemPrompt(ctx);

        const apiUrl = baseUrl.replace(/\/$/, '') + '/api/v1/projects/general/public-chat';

        const response = await axios.post(
            apiUrl,
            { message, system_prompt: systemPrompt },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data?.success && response.data?.data?.reply) {
            return {
                reply: response.data.data.reply,
                suggestions: [],
            };
        }

        logger.warn('HDM AI unexpected response format');
        return keywordResponse(message);
    } catch (error) {
        logger.error(`HDM AI error: ${error.message}`);
        return keywordResponse(message);
    }
};

const generateResponse = async (message, context = {}) => {
    logger.info(`AI query: "${message}" from ${context.userId || 'anonymous'}`);

    const provider = await getProvider();

    if (provider === 'openai') {
        return await openaiResponse(message);
    } else if (provider === 'hdm') {
        return await hdmaiResponse(message);
    }

    return keywordResponse(message);
};

const saveConversation = async (userId, message, reply) => {
    conversationHistory.push({ userId, message, reply, timestamp: new Date() });
};

const getConversationHistory = async (userId, limit = 20) => {
    return conversationHistory
        .filter((c) => c.userId === userId)
        .slice(-limit)
        .map((c) => ({ message: c.message, reply: c.reply, timestamp: c.timestamp }));
};

module.exports = { generateResponse, saveConversation, getConversationHistory };