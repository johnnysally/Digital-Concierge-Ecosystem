const { CUSTOMER_URL, PARTNER_URL } = require('../config/env');

const styles = {
    wrapper: 'max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
    container: 'background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)',
    header: 'background:#0f172a;padding:40px 32px;text-align:center',
    logo: 'color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px',
    headerSubtitle: 'color:#94a3b8;font-size:14px;margin-top:8px',
    body: 'padding:40px 32px',
    title: 'color:#0f172a;font-size:22px;font-weight:600;margin-bottom:16px',
    text: 'color:#475569;font-size:15px;line-height:1.7;margin-bottom:24px',
    card: 'background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #e2e8f0',
    cardLabel: 'color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px',
    cardValue: 'color:#0f172a;font-size:15px;font-weight:600',
    detailRow: 'display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f1f5f9',
    detailLabel: 'color:#64748b;font-size:14px',
    detailValue: 'color:#0f172a;font-size:14px;font-weight:500',
    button: 'display:inline-block;background:#0f172a;color:#ffffff;font-size:14px;font-weight:600;padding:14px 32px;border-radius:10px;text-decoration:none;margin-top:8px',
    footer: 'padding:24px 32px;background:#f8fafc;text-align:center;border-top:1px solid #e2e8f0',
    footerText: 'color:#94a3b8;font-size:12px;line-height:1.6',
    badge: 'display:inline-block;padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600',
    badgeSuccess: 'background:#dcfce7;color:#166534',
    badgeWarning: 'background:#fef9c3;color:#854d0e',
    badgeDanger: 'background:#fee2e2;color:#991b1b',
    badgeInfo: 'background:#dbeafe;color:#1e40af',
    divider: 'border:none;border-top:1px solid #e2e8f0;margin:24px 0',
};

const wrap = (content, title) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9">
  <div style="${styles.wrapper}">
    <div style="${styles.container}">
      <div style="${styles.header}">
        <div style="${styles.logo}">Digital Concierge</div>
        <div style="${styles.headerSubtitle}">${title}</div>
      </div>
      ${content}
      <div style="${styles.footer}">
        <div style="${styles.footerText}">Digital Concierge Ecosystem<br>This is an automated message, please do not reply directly.</div>
      </div>
    </div>
  </div>
</body>
</html>`;

const customerWelcome = (user, verificationLink) => ({
    subject: 'Welcome to Digital Concierge',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <h1 style="${styles.title}">Welcome, ${user.firstName}! 🎉</h1>
            <p style="${styles.text}">Your travel command center is ready. Book stays, order food, arrange transport, and chat with your AI concierge — all from one dashboard.</p>
            <a href="${verificationLink}" style="${styles.button}">Verify Your Email</a>
            <p style="${styles.text};margin-top:24px">Or copy this link:<br><span style="color:#0f172a;font-size:13px">${verificationLink}</span></p>
        </div>
    `, 'Welcome'),
    textBody: `Welcome to Digital Concierge, ${user.firstName}! Verify your email: ${verificationLink}`,
});

const customerPasswordReset = (user, resetLink) => ({
    subject: 'Reset Your Password',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <h1 style="${styles.title}">Password Reset</h1>
            <p style="${styles.text}">Hi ${user.firstName}, you requested a password reset. Click below to create a new password. This link expires in 10 minutes.</p>
            <a href="${resetLink}" style="${styles.button}">Reset Password</a>
            <p style="${styles.text};margin-top:24px;color:#ef4444;font-size:13px">If you didn't request this, ignore this email.</p>
        </div>
    `, 'Password Reset'),
    textBody: `Hi ${user.firstName}, reset your password: ${resetLink}`,
});

const customerOTP = (user, otp) => ({
    subject: 'Your Verification Code',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <h1 style="${styles.title}">Verification Code</h1>
            <p style="${styles.text}">Hi ${user.firstName}, use the code below to complete verification. It expires in 5 minutes.</p>
            <div style="text-align:center;margin:32px 0">
                <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#0f172a;background:#f8fafc;padding:16px 32px;border-radius:12px">${otp}</span>
            </div>
        </div>
    `, 'Verification'),
    textBody: `Hi ${user.firstName}, your verification code is: ${otp}`,
});

const customerBookingConfirmed = (user, booking) => ({
    subject: `Booking Confirmed — ${booking.propertyName}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeSuccess}">Confirmed</span>
            <h1 style="${styles.title};margin-top:16px">Booking Confirmed</h1>
            <p style="${styles.text}">Great news, ${user.firstName}! Your stay at <strong>${booking.propertyName}</strong> is confirmed.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Property</span><span style="${styles.detailValue}">${booking.propertyName}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Check-in</span><span style="${styles.detailValue}">${booking.checkIn}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Check-out</span><span style="${styles.detailValue}">${booking.checkOut}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Guests</span><span style="${styles.detailValue}">${booking.guests}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Total</span><span style="${styles.detailValue}">$${booking.totalAmount}</span></div>
            </div>
            <a href="${CUSTOMER_URL}/bookings/${booking.id}" style="${styles.button}">View Booking</a>
        </div>
    `, 'Booking Confirmed'),
    textBody: `Booking Confirmed! ${booking.propertyName} — ${booking.checkIn} to ${booking.checkOut}. Total: $${booking.totalAmount}`,
});

const customerBookingCancelled = (user, booking) => ({
    subject: `Booking Cancelled — ${booking.propertyName}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeDanger}">Cancelled</span>
            <h1 style="${styles.title};margin-top:16px">Booking Cancelled</h1>
            <p style="${styles.text}">Hi ${user.firstName}, your booking at <strong>${booking.propertyName}</strong> has been cancelled.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Refund Amount</span><span style="${styles.detailValue}">$${booking.refundAmount || booking.totalAmount}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Refund Status</span><span style="${styles.detailValue}">${booking.refundStatus || 'Processing'}</span></div>
            </div>
        </div>
    `, 'Booking Cancelled'),
    textBody: `Booking at ${booking.propertyName} cancelled. Refund: $${booking.refundAmount || booking.totalAmount}`,
});

const customerBookingReminder = (user, booking) => ({
    subject: `Reminder: Check-in Tomorrow — ${booking.propertyName}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeInfo}">Reminder</span>
            <h1 style="${styles.title};margin-top:16px">Check-in Tomorrow!</h1>
            <p style="${styles.text}">Hi ${user.firstName}, your stay at <strong>${booking.propertyName}</strong> starts tomorrow.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Date</span><span style="${styles.detailValue}">${booking.checkIn}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Address</span><span style="${styles.detailValue}">${booking.propertyAddress}</span></div>
            </div>
            <a href="${CUSTOMER_URL}/bookings/${booking.id}" style="${styles.button}">View Details</a>
        </div>
    `, 'Check-in Reminder'),
    textBody: `Reminder: Check-in tomorrow at ${booking.propertyName}, ${booking.propertyAddress}`,
});

const customerPaymentReceived = (user, payment) => ({
    subject: `Payment Received — $${payment.amount}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeSuccess}">Paid</span>
            <h1 style="${styles.title};margin-top:16px">Payment Received</h1>
            <p style="${styles.text}">Thanks, ${user.firstName}! Your payment has been processed.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Amount</span><span style="${styles.detailValue}">$${payment.amount}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Method</span><span style="${styles.detailValue}">${payment.method}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Reference</span><span style="${styles.detailValue}">${payment.reference}</span></div>
            </div>
        </div>
    `, 'Payment Received'),
    textBody: `Payment of $${payment.amount} received via ${payment.method}. Reference: ${payment.reference}`,
});

const customerPaymentFailed = (user, payment) => ({
    subject: 'Payment Failed — Action Required',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeDanger}">Failed</span>
            <h1 style="${styles.title};margin-top:16px">Payment Failed</h1>
            <p style="${styles.text}">Hi ${user.firstName}, your payment of <strong>$${payment.amount}</strong> via ${payment.method} didn't go through. Please update your payment method and try again.</p>
            <a href="${CUSTOMER_URL}/wallet" style="${styles.button}">Update Payment Method</a>
        </div>
    `, 'Payment Failed'),
    textBody: `Payment of $${payment.amount} failed. Update your payment method: ${CUSTOMER_URL}/wallet`,
});

const customerRefund = (user, refund) => ({
    subject: `Refund Processed — $${refund.amount}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeInfo}">Refund</span>
            <h1 style="${styles.title};margin-top:16px">Refund Processed</h1>
            <p style="${styles.text}">Hi ${user.firstName}, a refund of <strong>$${refund.amount}</strong> has been initiated.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Amount</span><span style="${styles.detailValue}">$${refund.amount}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Method</span><span style="${styles.detailValue}">${refund.method}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">ETA</span><span style="${styles.detailValue}">${refund.eta || '5-7 business days'}</span></div>
            </div>
        </div>
    `, 'Refund Processed'),
    textBody: `Refund of $${refund.amount} processed via ${refund.method}. ETA: ${refund.eta || '5-7 business days'}`,
});

const customerPromotionApplied = (user, promo) => ({
    subject: `Promo Applied — ${promo.code}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeSuccess}">Savings</span>
            <h1 style="${styles.title};margin-top:16px">Promotion Applied!</h1>
            <p style="${styles.text}">Hi ${user.firstName}, promo code <strong>${promo.code}</strong> has been applied to your booking.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Discount</span><span style="${styles.detailValue}">${promo.discount}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">You Saved</span><span style="${styles.detailValue}">$${promo.saved}</span></div>
            </div>
        </div>
    `, 'Promotion Applied'),
    textBody: `Promo ${promo.code} applied! Discount: ${promo.discount}, Saved: $${promo.saved}`,
});

const customerReviewRequest = (user, booking) => ({
    subject: `How was your stay at ${booking.propertyName}?`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <h1 style="${styles.title}">How was your stay?</h1>
            <p style="${styles.text}">Hi ${user.firstName}, we hope you enjoyed your stay at <strong>${booking.propertyName}</strong>. Share your experience to help other travelers.</p>
            <a href="${CUSTOMER_URL}/reviews/new?booking=${booking.id}" style="${styles.button}">Write a Review</a>
        </div>
    `, 'Review Request'),
    textBody: `How was your stay at ${booking.propertyName}? Leave a review: ${CUSTOMER_URL}/reviews/new?booking=${booking.id}`,
});

const customerWalletTopup = (user, amount, balance) => ({
    subject: `Wallet Topped Up — $${amount}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeSuccess}">Top-up</span>
            <h1 style="${styles.title};margin-top:16px">Wallet Topped Up</h1>
            <p style="${styles.text}">Hi ${user.firstName}, <strong>$${amount}</strong> has been added to your wallet.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Amount Added</span><span style="${styles.detailValue}">$${amount}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">New Balance</span><span style="${styles.detailValue}">$${balance}</span></div>
            </div>
        </div>
    `, 'Wallet Top-up'),
    textBody: `$${amount} added to your wallet. New balance: $${balance}`,
});

const customerAccountChanged = (user, changes) => ({
    subject: 'Account Updated',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeInfo}">Security</span>
            <h1 style="${styles.title};margin-top:16px">Account Updated</h1>
            <p style="${styles.text}">Hi ${user.firstName}, your account <strong>${changes}</strong> was changed. If this wasn't you, contact support immediately.</p>
        </div>
    `, 'Account Updated'),
    textBody: `Hi ${user.firstName}, your ${changes} was updated. If this wasn't you, contact support.`,
});

const partnerWelcome = (user, verificationLink) => ({
    subject: 'Welcome to Digital Concierge Partner Portal',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <h1 style="${styles.title}">Welcome, ${user.firstName}! 🏨</h1>
            <p style="${styles.text}">Your partner dashboard is ready. Manage properties, rooms, reservations, staff, and track revenue — all in one place.</p>
            <a href="${verificationLink}" style="${styles.button}">Verify Your Email</a>
        </div>
    `, 'Partner Welcome'),
    textBody: `Welcome to Digital Concierge Partner Portal, ${user.firstName}! Verify: ${verificationLink}`,
});

const partnerRegistrationReceived = (user) => ({
    subject: 'Registration Received - Pending Approval',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeWarning}">Pending</span>
            <h1 style="${styles.title};margin-top:16px">Registration Received</h1>
            <p style="${styles.text}">Hi ${user.firstName}, your registration for <strong>${user.businessName}</strong> has been received and is pending admin approval.</p>
            <p style="${styles.text}">Our team will review your application within 24-48 hours. You'll receive another email once your account is approved.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Business</span><span style="${styles.detailValue}">${user.businessName}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Status</span><span style="${styles.detailValue}">Pending Approval</span></div>
            </div>
        </div>
    `, 'Registration Received'),
    textBody: `Hi ${user.firstName}, your registration for ${user.businessName} is pending admin approval. We'll notify you once approved.`,
});

const partnerApproved = (user) => ({
    subject: 'Account Approved - Start Operating! 🎉',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeSuccess}">Approved</span>
            <h1 style="${styles.title};margin-top:16px">Account Approved!</h1>
            <p style="${styles.text}">Congratulations ${user.firstName}! Your business <strong>${user.businessName}</strong> has been approved and is now active.</p>
            <p style="${styles.text}">You can now login to your partner dashboard and start managing your operations.</p>
            <a href="${PARTNER_URL || process.env.PARTNER_URL || 'http://localhost:3000'}/login" style="${styles.button}">Go to Dashboard</a>
        </div>
    `, 'Account Approved'),
    textBody: `Congratulations ${user.firstName}! Your business ${user.businessName} has been approved. Login to start operating.`,
});

const partnerPasswordReset = (user, resetLink) => ({
    subject: 'Reset Your Partner Password',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <h1 style="${styles.title}">Password Reset</h1>
            <p style="${styles.text}">Hi ${user.firstName}, click below to reset your partner account password.</p>
            <a href="${resetLink}" style="${styles.button}">Reset Password</a>
        </div>
    `, 'Password Reset'),
    textBody: `Hi ${user.firstName}, reset your password: ${resetLink}`,
});

const partnerOTP = (user, otp) => ({
    subject: 'Your Verification Code',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <h1 style="${styles.title}">Verification Code</h1>
            <p style="${styles.text}">Hi ${user.firstName}, use this code to continue:</p>
            <div style="text-align:center;margin:32px 0">
                <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#0f172a;background:#f8fafc;padding:16px 32px;border-radius:12px">${otp}</span>
            </div>
        </div>
    `, 'Verification'),
    textBody: `Hi ${user.firstName}, your code: ${otp}`,
});

const partnerNewReservation = (user, reservation) => ({
    subject: `New Reservation — ${reservation.propertyName}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeSuccess}">New Booking</span>
            <h1 style="${styles.title};margin-top:16px">New Reservation</h1>
            <p style="${styles.text}">A guest has booked <strong>${reservation.propertyName}</strong>.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Guest</span><span style="${styles.detailValue}">${reservation.guestName}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Room</span><span style="${styles.detailValue}">${reservation.roomNumber}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Check-in</span><span style="${styles.detailValue}">${reservation.checkIn}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Check-out</span><span style="${styles.detailValue}">${reservation.checkOut}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Amount</span><span style="${styles.detailValue}">$${reservation.totalAmount}</span></div>
            </div>
            <a href="${PARTNER_URL}/reservations/${reservation.id}" style="${styles.button}">View Reservation</a>
        </div>
    `, 'New Reservation'),
    textBody: `New reservation: ${reservation.guestName} — ${reservation.propertyName}, ${reservation.checkIn} to ${reservation.checkOut}. $${reservation.totalAmount}`,
});

const partnerReservationCancelled = (user, reservation) => ({
    subject: `Reservation Cancelled — ${reservation.propertyName}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeDanger}">Cancelled</span>
            <h1 style="${styles.title};margin-top:16px">Reservation Cancelled</h1>
            <p style="${styles.text}">A reservation for <strong>${reservation.propertyName}</strong> has been cancelled.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Guest</span><span style="${styles.detailValue}">${reservation.guestName}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Dates</span><span style="${styles.detailValue}">${reservation.checkIn} — ${reservation.checkOut}</span></div>
            </div>
        </div>
    `, 'Reservation Cancelled'),
    textBody: `Reservation cancelled: ${reservation.guestName} — ${reservation.propertyName}`,
});

const partnerNewReview = (user, review) => ({
    subject: `New Review — ${review.propertyName} — ${review.rating}/5`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeInfo}">New Review</span>
            <h1 style="${styles.title};margin-top:16px">New Review Received</h1>
            <p style="${styles.text}"><strong>${review.guestName}</strong> left a ${review.rating}-star review for ${review.propertyName}.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Rating</span><span style="${styles.detailValue}">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Comment</span><span style="${styles.detailValue}">${review.comment}</span></div>
            </div>
            <a href="${PARTNER_URL}/reviews" style="${styles.button}">View All Reviews</a>
        </div>
    `, 'New Review'),
    textBody: `New ${review.rating}-star review from ${review.guestName} for ${review.propertyName}: "${review.comment}"`,
});

const partnerPayout = (user, payout) => ({
    subject: `Payout Processed — $${payout.amount}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeSuccess}">Payout</span>
            <h1 style="${styles.title};margin-top:16px">Payout Processed</h1>
            <p style="${styles.text}">Hi ${user.firstName}, a payout of <strong>$${payout.amount}</strong> has been sent.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Amount</span><span style="${styles.detailValue}">$${payout.amount}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Method</span><span style="${styles.detailValue}">${payout.method}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Reference</span><span style="${styles.detailValue}">${payout.reference}</span></div>
            </div>
        </div>
    `, 'Payout Processed'),
    textBody: `Payout of $${payout.amount} processed via ${payout.method}. Reference: ${payout.reference}`,
});

const partnerPropertyPublished = (user, property) => ({
    subject: `Property Published — ${property.name}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeSuccess}">Live</span>
            <h1 style="${styles.title};margin-top:16px">Property Published</h1>
            <p style="${styles.text}"><strong>${property.name}</strong> is now live and visible to customers.</p>
            <a href="${PARTNER_URL}/properties/${property.id}" style="${styles.button}">View Property</a>
        </div>
    `, 'Property Published'),
    textBody: `Your property "${property.name}" is now live!`,
});

const partnerStaffInvite = (user, inviteLink, role) => ({
    subject: `You've been invited as ${role}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <h1 style="${styles.title}">Team Invitation</h1>
            <p style="${styles.text}">Hi ${user.firstName}, you've been invited to join as <strong>${role}</strong>. Click below to set up your account.</p>
            <a href="${inviteLink}" style="${styles.button}">Accept Invitation</a>
        </div>
    `, 'Team Invitation'),
    textBody: `You've been invited as ${role}. Accept: ${inviteLink}`,
});

const partnerHousekeepingAssigned = (user, task) => ({
    subject: `Task Assigned — Room ${task.roomNumber}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeWarning}">New Task</span>
            <h1 style="${styles.title};margin-top:16px">Housekeeping Task Assigned</h1>
            <p style="${styles.text}">Hi ${user.firstName}, a new task has been assigned to you.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Room</span><span style="${styles.detailValue}">${task.roomNumber}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Task</span><span style="${styles.detailValue}">${task.type}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Priority</span><span style="${styles.detailValue}">${task.priority}</span></div>
            </div>
        </div>
    `, 'Task Assigned'),
    textBody: `New task: Room ${task.roomNumber} — ${task.type} (${task.priority})`,
});

const partnerPromotionCreated = (user, promo) => ({
    subject: `Promotion Live — ${promo.code}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeSuccess}">Live</span>
            <h1 style="${styles.title};margin-top:16px">Promotion Created</h1>
            <p style="${styles.text}">Your promotion <strong>${promo.code}</strong> is now live.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Code</span><span style="${styles.detailValue}">${promo.code}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Discount</span><span style="${styles.detailValue}">${promo.discount}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Valid Until</span><span style="${styles.detailValue}">${promo.expiry}</span></div>
            </div>
        </div>
    `, 'Promotion Created'),
    textBody: `Promo ${promo.code} is live! Discount: ${promo.discount}, Expires: ${promo.expiry}`,
});

const partnerAccountChanged = (user, changes) => ({
    subject: 'Partner Account Updated',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeInfo}">Security</span>
            <h1 style="${styles.title};margin-top:16px">Account Updated</h1>
            <p style="${styles.text}">Hi ${user.firstName}, your account <strong>${changes}</strong> was changed. If this wasn't you, contact support immediately.</p>
        </div>
    `, 'Account Updated'),
    textBody: `Hi ${user.firstName}, your ${changes} was updated. If this wasn't you, contact support.`,
});

const dailyDigest = (user, summary) => ({
    subject: `Your Daily Digest — ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <h1 style="${styles.title}">Daily Digest</h1>
            <p style="${styles.text}">Hi ${user.firstName}, here's your summary for today.</p>
            ${summary.map(item => `
                <div style="${styles.card}">
                    <span style="${styles.badge};${item.badgeStyle || styles.badgeInfo}">${item.badge}</span>
                    <p style="margin-top:12px;color:#0f172a;font-weight:600">${item.title}</p>
                    <p style="color:#64748b;font-size:13px">${item.description}</p>
                </div>
            `).join('')}
        </div>
    `, 'Daily Digest'),
    textBody: `Hi ${user.firstName}, here's your daily summary.`,
});

const partnerNewRegistration = (admin, partner) => ({
    subject: `New Partner Registration - ${partner.businessName}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeInfo}">New Registration</span>
            <h1 style="${styles.title};margin-top:16px">New Partner Registration</h1>
            <p style="${styles.text}">Hi ${admin.firstName}, a new partner has registered on the platform and requires your review.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Business</span><span style="${styles.detailValue}">${partner.businessName}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Contact</span><span style="${styles.detailValue}">${partner.firstName} ${partner.lastName}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Email</span><span style="${styles.detailValue}">${partner.email}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Type</span><span style="${styles.detailValue}">${partner.businessType || partner.cuisine || 'N/A'}</span></div>
            </div>
            <a href="${process.env.ADMIN_URL || 'http://localhost:3001'}/partners" style="${styles.button}">Review Partner</a>
        </div>
    `, 'New Partner Registration'),
    textBody: `New partner registration: ${partner.businessName} (${partner.email}). Review: ${process.env.ADMIN_URL || 'http://localhost:3001'}/partners`,
});

const partnerAccountDeleted = (partner) => ({
    subject: 'Your Partner Account Has Been Removed',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeDanger}">Account Removed</span>
            <h1 style="${styles.title};margin-top:16px">Account Removed</h1>
            <p style="${styles.text}">Hi ${partner.firstName}, your partner account for <strong>${partner.businessName}</strong> has been permanently removed from the Digital Concierge platform.</p>
            <p style="${styles.text}">If you believe this was a mistake, please contact our support team at ${process.env.SUPPORT_EMAIL || 'support@digitalconcierge.com'}.</p>
        </div>
    `, 'Account Removed'),
    textBody: `Hi ${partner.firstName}, your partner account for ${partner.businessName} has been removed. Contact support if this was a mistake.`,
});

const customerAccountDeleted = (customer) => ({
    subject: 'Your Account Has Been Removed',
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeDanger}">Account Removed</span>
            <h1 style="${styles.title};margin-top:16px">Account Removed</h1>
            <p style="${styles.text}">Hi ${customer.firstName}, your Digital Concierge account has been permanently removed from the platform.</p>
            <p style="${styles.text}">If you believe this was a mistake, please contact our support team at ${process.env.SUPPORT_EMAIL || 'support@digitalconcierge.com'}.</p>
        </div>
    `, 'Account Removed'),
    textBody: `Hi ${customer.firstName}, your Digital Concierge account has been removed. Contact support if this was a mistake.`,
});

module.exports = {
    customer: {
        welcome: customerWelcome,
        passwordReset: customerPasswordReset,
        otp: customerOTP,
        bookingConfirmed: customerBookingConfirmed,
        bookingCancelled: customerBookingCancelled,
        bookingReminder: customerBookingReminder,
        paymentReceived: customerPaymentReceived,
        paymentFailed: customerPaymentFailed,
        refund: customerRefund,
        promotionApplied: customerPromotionApplied,
        reviewRequest: customerReviewRequest,
        walletTopup: customerWalletTopup,
        accountChanged: customerAccountChanged,
        accountDeleted: customerAccountDeleted,
    },
    partner: {
        welcome: partnerWelcome,
        registrationReceived: partnerRegistrationReceived,
        approved: partnerApproved,
        passwordReset: partnerPasswordReset,
        otp: partnerOTP,
        newReservation: partnerNewReservation,
        reservationCancelled: partnerReservationCancelled,
        newReview: partnerNewReview,
        payout: partnerPayout,
        propertyPublished: partnerPropertyPublished,
        staffInvite: partnerStaffInvite,
        housekeepingAssigned: partnerHousekeepingAssigned,
        promotionCreated: partnerPromotionCreated,
        accountChanged: partnerAccountChanged,
        newPartnerRegistration: partnerNewRegistration,
        accountDeleted: partnerAccountDeleted,
    },
    dailyDigest,
};