const ChatMessage = require('../../models/customer/ChatMessage');
const { generateResponse, saveConversation } = require('../../services/aiService');

const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;

        await ChatMessage.create({ customer: req.user._id, sender: 'customer', message });

        const aiResponse = await generateResponse(message, { userId: req.user._id });
        await ChatMessage.create({
            customer: req.user._id,
            sender: 'ai',
            message: aiResponse.reply,
            suggestions: aiResponse.suggestions,
        });

        await saveConversation(req.user._id, message, aiResponse.reply);

        res.json({ success: true, reply: aiResponse.reply, suggestions: aiResponse.suggestions });
    } catch (error) {
        next(error);
    }
};

const getChatHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const messages = await ChatMessage.find({ customer: req.user._id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ChatMessage.countDocuments({ customer: req.user._id });

        res.json({ success: true, messages: messages.reverse(), total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        next(error);
    }
};

module.exports = { sendMessage, getChatHistory };