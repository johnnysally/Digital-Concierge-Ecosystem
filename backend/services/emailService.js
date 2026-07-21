const { EMAIL_PROVIDER } = require('../config/env');
const logger = require('../utils/logger');
const templates = require('./emailTemplates');

let provider;

const loadProvider = () => {
    if (EMAIL_PROVIDER === 'hdm') {
        provider = require('../config/hdmbridge');
        logger.info('Email provider: HDM Bridge');
    } else {
        provider = require('../config/brevo');
        logger.info('Email provider: Brevo');
    }
};

const send = async ({ to, subject, htmlBody, textBody }) => {
    if (!provider) loadProvider();
    return await provider.sendEmail({ to, subject, htmlBody, textBody });
};

const sendCustomerWelcome = async (user, verificationLink) => {
    const { subject, htmlBody, textBody } = templates.customer.welcome(user, verificationLink);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerPasswordReset = async (user, resetLink) => {
    const { subject, htmlBody, textBody } = templates.customer.passwordReset(user, resetLink);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerOTP = async (user, otp) => {
    const { subject, htmlBody, textBody } = templates.customer.otp(user, otp);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerBookingConfirmed = async (user, booking) => {
    const { subject, htmlBody, textBody } = templates.customer.bookingConfirmed(user, booking);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerBookingCancelled = async (user, booking) => {
    const { subject, htmlBody, textBody } = templates.customer.bookingCancelled(user, booking);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerBookingReminder = async (user, booking) => {
    const { subject, htmlBody, textBody } = templates.customer.bookingReminder(user, booking);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerPaymentReceived = async (user, payment) => {
    const { subject, htmlBody, textBody } = templates.customer.paymentReceived(user, payment);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerPaymentFailed = async (user, payment) => {
    const { subject, htmlBody, textBody } = templates.customer.paymentFailed(user, payment);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerRefund = async (user, refund) => {
    const { subject, htmlBody, textBody } = templates.customer.refund(user, refund);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerPromotionApplied = async (user, promo) => {
    const { subject, htmlBody, textBody } = templates.customer.promotionApplied(user, promo);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerReviewRequest = async (user, booking) => {
    const { subject, htmlBody, textBody } = templates.customer.reviewRequest(user, booking);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerWalletTopup = async (user, amount, balance) => {
    const { subject, htmlBody, textBody } = templates.customer.walletTopup(user, amount, balance);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendCustomerAccountChanged = async (user, changes) => {
    const { subject, htmlBody, textBody } = templates.customer.accountChanged(user, changes);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendPartnerWelcome = async (partner, verificationLink) => {
    const { subject, htmlBody, textBody } = templates.partner.welcome(partner, verificationLink);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendPartnerPasswordReset = async (partner, resetLink) => {
    const { subject, htmlBody, textBody } = templates.partner.passwordReset(partner, resetLink);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendPartnerOTP = async (partner, otp) => {
    const { subject, htmlBody, textBody } = templates.partner.otp(partner, otp);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendPartnerNewReservation = async (partner, reservation) => {
    const { subject, htmlBody, textBody } = templates.partner.newReservation(partner, reservation);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendPartnerReservationCancelled = async (partner, reservation) => {
    const { subject, htmlBody, textBody } = templates.partner.reservationCancelled(partner, reservation);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendPartnerNewReview = async (partner, review) => {
    const { subject, htmlBody, textBody } = templates.partner.newReview(partner, review);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendPartnerPayout = async (partner, payout) => {
    const { subject, htmlBody, textBody } = templates.partner.payout(partner, payout);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendPartnerPropertyPublished = async (partner, property) => {
    const { subject, htmlBody, textBody } = templates.partner.propertyPublished(partner, property);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendPartnerStaffInvite = async (staff, inviteLink, role) => {
    const { subject, htmlBody, textBody } = templates.partner.staffInvite(staff, inviteLink, role);
    await send({ to: staff.email, subject, htmlBody, textBody });
};

const sendPartnerHousekeepingAssigned = async (staff, task) => {
    const { subject, htmlBody, textBody } = templates.partner.housekeepingAssigned(staff, task);
    await send({ to: staff.email, subject, htmlBody, textBody });
};

const sendPartnerPromotionCreated = async (partner, promo) => {
    const { subject, htmlBody, textBody } = templates.partner.promotionCreated(partner, promo);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendPartnerAccountChanged = async (partner, changes) => {
    const { subject, htmlBody, textBody } = templates.partner.accountChanged(partner, changes);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendDailyDigest = async (user, summary) => {
    const { subject, htmlBody, textBody } = templates.dailyDigest(user, summary);
    await send({ to: user.email, subject, htmlBody, textBody });
};

const sendPartnerRegistrationReceived = async (partner) => {
    const { subject, htmlBody, textBody } = templates.partner.registrationReceived(partner);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

const sendPartnerApproved = async (partner) => {
    const { subject, htmlBody, textBody } = templates.partner.approved(partner);
    await send({ to: partner.email, subject, htmlBody, textBody });
};

module.exports = {
    customer: {
        sendWelcome: sendCustomerWelcome,
        sendPasswordReset: sendCustomerPasswordReset,
        sendOTP: sendCustomerOTP,
        sendBookingConfirmed: sendCustomerBookingConfirmed,
        sendBookingCancelled: sendCustomerBookingCancelled,
        sendBookingReminder: sendCustomerBookingReminder,
        sendPaymentReceived: sendCustomerPaymentReceived,
        sendPaymentFailed: sendCustomerPaymentFailed,
        sendRefund: sendCustomerRefund,
        sendPromotionApplied: sendCustomerPromotionApplied,
        sendReviewRequest: sendCustomerReviewRequest,
        sendWalletTopup: sendCustomerWalletTopup,
        sendAccountChanged: sendCustomerAccountChanged,
    },
    partner: {
        sendWelcome: sendPartnerWelcome,
        sendRegistrationReceived: sendPartnerRegistrationReceived,
        sendApproved: sendPartnerApproved,
        sendPasswordReset: sendPartnerPasswordReset,
        sendOTP: sendPartnerOTP,
        sendNewReservation: sendPartnerNewReservation,
        sendReservationCancelled: sendPartnerReservationCancelled,
        sendNewReview: sendPartnerNewReview,
        sendPayout: sendPartnerPayout,
        sendPropertyPublished: sendPartnerPropertyPublished,
        sendStaffInvite: sendPartnerStaffInvite,
        sendHousekeepingAssigned: sendPartnerHousekeepingAssigned,
        sendPromotionCreated: sendPartnerPromotionCreated,
        sendAccountChanged: sendPartnerAccountChanged,
    },
    sendDailyDigest,
    send,
};