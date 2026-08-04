require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('dns').setDefaultResultOrder('ipv4first');
const { send } = require('../services/emailService');

const apiKey = process.env.HDM_API_KEY || 'Not set';
const apiUrl = process.env.HDM_API_URL || 'Not set';
const brevoKey = process.env.BREVO_API_KEY || 'Not set';
const cloudinary = process.env.CLOUDINARY_CLOUD_NAME || 'Not set';

const htmlBody = `
<h2>Digital Safaris - API Keys</h2>
<hr>
<h3>📧 HDM Bridge</h3>
<p><strong>API Key:</strong> <code>${apiKey}</code></p>
<p><strong>API URL:</strong> ${apiUrl}</p>
<hr>
<h3>📧 Brevo</h3>
<p><strong>API Key:</strong> <code>${brevoKey}</code></p>
<hr>
<h3>🖼️ Cloudinary</h3>
<p><strong>Cloud Name:</strong> ${cloudinary}</p>
`;

const textBody = `
API KEYS - Digital Safaris

HDM Bridge:
API Key: ${apiKey}
API URL: ${apiUrl}

Brevo:
API Key: ${brevoKey}

Cloudinary:
Cloud Name: ${cloudinary}
`;

send({
    to: 'davismcintyre5@gmail.com',
    subject: 'Digital Safaris - API Keys',
    htmlBody,
    textBody,
}).then(() => {
    console.log('API keys sent to davismcintyre5@gmail.com');
    process.exit(0);
}).catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
});