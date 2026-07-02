const logger = require('../utils/logger');

const conversationHistory = [];

const generateResponse = async (message, context = {}) => {
    logger.info(`AI query: "${message}" from ${context.userId || 'anonymous'}`);

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
            reply: 'You have 2 active bookings. Your upcoming check-in is on May 12 at Hilton Grand Suite. Would you like to view details, modify, or cancel any bookings?',
            suggestions: ['View my bookings', 'Modify check-in dates', 'Cancel a booking'],
        };
    }

    return {
        reply: "I'm here to help with your travel needs. I can assist with accommodations, dining, transport, bookings, payments, and local recommendations. What would you like to know?",
        suggestions: ['Find a hotel', 'Order food', 'Book a ride', 'Check my bookings'],
    };
};

const saveConversation = async (userId, message, reply) => {
    conversationHistory.push({
        userId,
        message,
        reply,
        timestamp: new Date(),
    });
};

const getConversationHistory = async (userId, limit = 20) => {
    return conversationHistory
        .filter((c) => c.userId === userId)
        .slice(-limit)
        .map((c) => ({ message: c.message, reply: c.reply, timestamp: c.timestamp }));
};

module.exports = { generateResponse, saveConversation, getConversationHistory };