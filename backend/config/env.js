const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI,
    
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'brevo',
    
    BREVO: {
        API_KEY: process.env.BREVO_API_KEY,
        SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
    },
    
    HDM: {
        API_KEY: process.env.HDM_API_KEY,
        API_URL: process.env.HDM_API_URL,
        FROM_EMAIL: process.env.HDM_FROM_EMAIL,
        FROM_NAME: process.env.HDM_FROM_NAME,
    },
    
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET,
    },
    
    STRIPE: {
        SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    },
    
    MPESA: {
        CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
        CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
        PASSKEY: process.env.MPESA_PASSKEY,
        SHORTCODE: process.env.MPESA_SHORTCODE,
        CALLBACK_URL: process.env.MPESA_CALLBACK_URL,
        ENV: process.env.MPESA_ENV || 'sandbox',
    },
    
    API_URL: process.env.API_URL || 'http://localhost:5000/api',
    CUSTOMER_URL: process.env.CUSTOMER_URL || 'http://localhost:5173',
    PARTNER_URL: process.env.PARTNER_URL || 'http://localhost:5174',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174',
};