const axios = require('axios');
const { BREVO } = require('./env');

const sendEmail = async ({ to, subject, htmlBody, textBody }) => {
    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { email: BREVO.SENDER_EMAIL },
                to: [{ email: to }],
                subject,
                htmlContent: htmlBody,
                textContent: textBody,
            },
            {
                headers: {
                    'api-key': BREVO.API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`Brevo email failed: ${error.message}`);
    }
};

module.exports = { sendEmail };