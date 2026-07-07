const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    rewardsPoints: { type: Number, default: 0 },
    savedMethods: [
        {
            type: { type: String, enum: ['visa', 'mastercard', 'mpesa', 'airtel'] },
            label: { type: String },
            masked: { type: String },
            expiry: { type: String },
            isDefault: { type: Boolean, default: false },
        },
    ],
    transactions: [
        {
            type: { type: String, enum: ['credit', 'debit'] },
            amount: { type: Number },
            description: { type: String },
            reference: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);