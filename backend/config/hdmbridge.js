const axios = require('axios');
const { HDM } = require('./env');

const sendEmail = async ({ to, subject, htmlBody, textBody }) => {
    try {
        const response = await axios.post(
            `${HDM.API_URL}/emails/send`,
            {
                from: HDM.FROM_EMAIL,
                fromName: HDM.FROM_NAME,
                to,
                subject,
                htmlBody,
                textBody,
            },
            {
                headers: {
                    Authorization: `Bearer ${HDM.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`HDM email failed: ${error.message}`);
    }
};

module.exports = { sendEmail };