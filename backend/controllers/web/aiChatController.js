const { generateResponse } = require('../../services/aiService');
const PlatformSettings = require('../../models/admin/PlatformSettings');
const logger = require('../../utils/logger');

const sendChat = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Message required' });
        }

        const enabled = await PlatformSettings.findOne({ key: 'ai_chat_enabled' });
        if (!enabled?.value) {
            return res.status(403).json({ success: false, message: 'AI chat is disabled' });
        }

        const result = await generateResponse(message.trim(), { source: 'website' });

        res.json({
            success: true,
            reply: result.reply,
            suggestions: result.suggestions || [],
        });
    } catch (error) {
        logger.error(`Web AI chat failed: ${error.message}`);
        res.status(500).json({ success: false, message: 'AI service unavailable' });
    }
};

module.exports = { sendChat };