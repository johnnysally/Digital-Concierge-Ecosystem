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
};

const wrap = (content, title) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9">
  <div style="${styles.wrapper}">
    <div style="${styles.container}">
      <div style="${styles.header}">
        <div style="${styles.logo}">Digital Safaris</div>
        <div style="${styles.headerSubtitle}">${title}</div>
      </div>
      ${content}
      <div style="${styles.footer}">
        <div style="${styles.footerText}">Digital Safaris Ecosystem<br>This is an automated message, please do not reply directly.</div>
      </div>
    </div>
  </div>
</body>
</html>`;

const customerWelcome = (user, verificationLink) => ({
    subject: 'Welcome to Digital Safaris',
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">Welcome, ${user.firstName}! 🎉</h1><p style="${styles.text}">Your travel command center is ready. Book stays, order food, arrange transport, and chat with your AI concierge — all from one dashboard.</p><a href="${verificationLink}" style="${styles.button}">Verify Your Email</a></div>`, 'Welcome'),
    textBody: `Welcome to Digital Safaris, ${user.firstName}! Verify: ${verificationLink}`,
});

const customerPasswordReset = (user, resetLink) => ({
    subject: 'Reset Your Password',
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">Password Reset</h1><p style="${styles.text}">Hi ${user.firstName}, click below to reset your password. Expires in 10 minutes.</p><a href="${resetLink}" style="${styles.button}">Reset Password</a></div>`, 'Password Reset'),
    textBody: `Hi ${user.firstName}, reset: ${resetLink}`,
});

const customerOTP = (user, otp) => ({
    subject: 'Your Verification Code',
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">Verification Code</h1><p style="${styles.text}">Hi ${user.firstName}, use this code. Expires in 5 minutes.</p><div style="text-align:center;margin:32px 0"><span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#0f172a;background:#f8fafc;padding:16px 32px;border-radius:12px">${otp}</span></div></div>`, 'Verification'),
    textBody: `Code: ${otp}`,
});

const customerBookingConfirmed = (user, booking) => ({
    subject: `Booking Confirmed — ${booking.propertyName}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeSuccess}">Confirmed</span><h1 style="${styles.title};margin-top:16px">Booking Confirmed</h1><p style="${styles.text}">Great news, ${user.firstName}! Your stay at <strong>${booking.propertyName}</strong> is confirmed.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Property</span><span style="${styles.detailValue}">${booking.propertyName}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Check-in</span><span style="${styles.detailValue}">${booking.checkIn}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Check-out</span><span style="${styles.detailValue}">${booking.checkOut}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Guests</span><span style="${styles.detailValue}">${booking.guests}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Total</span><span style="${styles.detailValue}">KES ${(booking.totalAmount || 0).toLocaleString()}</span></div></div><a href="${CUSTOMER_URL}/bookings/${booking.id}" style="${styles.button}">View Booking</a></div>`, 'Booking Confirmed'),
    textBody: `Booking Confirmed! ${booking.propertyName} — ${booking.checkIn} to ${booking.checkOut}. Total: KES ${(booking.totalAmount || 0).toLocaleString()}`,
});

const customerBookingCancelled = (user, booking) => ({
    subject: `Booking Cancelled — ${booking.propertyName}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeDanger}">Cancelled</span><h1 style="${styles.title};margin-top:16px">Booking Cancelled</h1><p style="${styles.text}">Hi ${user.firstName}, your booking at <strong>${booking.propertyName}</strong> has been cancelled.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Refund</span><span style="${styles.detailValue}">KES ${(booking.refundAmount || booking.totalAmount || 0).toLocaleString()}</span></div></div></div>`, 'Booking Cancelled'),
    textBody: `Booking cancelled: ${booking.propertyName}. Refund: KES ${(booking.refundAmount || booking.totalAmount || 0).toLocaleString()}`,
});

const customerBookingReminder = (user, booking) => ({
    subject: `Reminder: Check-in Tomorrow — ${booking.propertyName}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeInfo}">Reminder</span><h1 style="${styles.title};margin-top:16px">Check-in Tomorrow!</h1><p style="${styles.text}">Hi ${user.firstName}, your stay at <strong>${booking.propertyName}</strong> starts tomorrow.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Date</span><span style="${styles.detailValue}">${booking.checkIn}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Address</span><span style="${styles.detailValue}">${booking.propertyAddress}</span></div></div></div>`, 'Check-in Reminder'),
    textBody: `Reminder: Check-in tomorrow at ${booking.propertyName}`,
});

const customerPaymentReceived = (user, payment) => ({
    subject: `Payment Received — KES ${(payment.amount || 0).toLocaleString()}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeSuccess}">Paid</span><h1 style="${styles.title};margin-top:16px">Payment Received</h1><p style="${styles.text}">Thanks, ${user.firstName}! Your payment has been processed.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Amount</span><span style="${styles.detailValue}">KES ${(payment.amount || 0).toLocaleString()}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Method</span><span style="${styles.detailValue}">${payment.method}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Reference</span><span style="${styles.detailValue}">${payment.reference}</span></div></div></div>`, 'Payment Received'),
    textBody: `Payment of KES ${(payment.amount || 0).toLocaleString()} received via ${payment.method}. Ref: ${payment.reference}`,
});

const customerPaymentFailed = (user, payment) => ({
    subject: 'Payment Failed — Action Required',
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeDanger}">Failed</span><h1 style="${styles.title};margin-top:16px">Payment Failed</h1><p style="${styles.text}">Hi ${user.firstName}, your payment of <strong>KES ${(payment.amount || 0).toLocaleString()}</strong> via ${payment.method} didn't go through.</p><a href="${CUSTOMER_URL}/wallet" style="${styles.button}">Update Payment Method</a></div>`, 'Payment Failed'),
    textBody: `Payment of KES ${(payment.amount || 0).toLocaleString()} failed. Update method: ${CUSTOMER_URL}/wallet`,
});

const customerRefund = (user, refund) => ({
    subject: `Refund Processed — KES ${(refund.amount || 0).toLocaleString()}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeInfo}">Refund</span><h1 style="${styles.title};margin-top:16px">Refund Processed</h1><p style="${styles.text}">Hi ${user.firstName}, a refund of <strong>KES ${(refund.amount || 0).toLocaleString()}</strong> has been initiated.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Amount</span><span style="${styles.detailValue}">KES ${(refund.amount || 0).toLocaleString()}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Method</span><span style="${styles.detailValue}">${refund.method}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">ETA</span><span style="${styles.detailValue}">${refund.eta || '5-7 business days'}</span></div></div></div>`, 'Refund Processed'),
    textBody: `Refund of KES ${(refund.amount || 0).toLocaleString()} via ${refund.method}. ETA: ${refund.eta || '5-7 days'}`,
});

const customerPromotionApplied = (user, promo) => ({
    subject: `Promo Applied — ${promo.code}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeSuccess}">Savings</span><h1 style="${styles.title};margin-top:16px">Promotion Applied!</h1><p style="${styles.text}">Hi ${user.firstName}, promo code <strong>${promo.code}</strong> applied.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Discount</span><span style="${styles.detailValue}">${promo.discount}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Saved</span><span style="${styles.detailValue}">KES ${(promo.saved || 0).toLocaleString()}</span></div></div></div>`, 'Promotion Applied'),
    textBody: `Promo ${promo.code} applied! Saved: KES ${(promo.saved || 0).toLocaleString()}`,
});

const customerReviewRequest = (user, booking) => ({
    subject: `How was your stay at ${booking.propertyName}?`,
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">How was your stay?</h1><p style="${styles.text}">Hi ${user.firstName}, share your experience at <strong>${booking.propertyName}</strong>.</p><a href="${CUSTOMER_URL}/reviews/new?booking=${booking.id}" style="${styles.button}">Write a Review</a></div>`, 'Review Request'),
    textBody: `Review ${booking.propertyName}: ${CUSTOMER_URL}/reviews/new?booking=${booking.id}`,
});

const customerWalletTopup = (user, amount, balance) => ({
    subject: `Wallet Topped Up — KES ${(amount || 0).toLocaleString()}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeSuccess}">Top-up</span><h1 style="${styles.title};margin-top:16px">Wallet Topped Up</h1><p style="${styles.text}">Hi ${user.firstName}, <strong>KES ${(amount || 0).toLocaleString()}</strong> added.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Added</span><span style="${styles.detailValue}">KES ${(amount || 0).toLocaleString()}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Balance</span><span style="${styles.detailValue}">KES ${(balance || 0).toLocaleString()}</span></div></div></div>`, 'Wallet Top-up'),
    textBody: `KES ${(amount || 0).toLocaleString()} added. Balance: KES ${(balance || 0).toLocaleString()}`,
});

const customerAccountChanged = (user, changes) => ({
    subject: 'Account Updated',
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeInfo}">Security</span><h1 style="${styles.title};margin-top:16px">Account Updated</h1><p style="${styles.text}">Hi ${user.firstName}, your <strong>${changes}</strong> was changed.</p></div>`, 'Account Updated'),
    textBody: `Hi ${user.firstName}, your ${changes} was updated.`,
});

const customerAccountDeleted = (customer) => ({
    subject: 'Your Digital Safaris Account Has Been Removed',
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeDanger}">Account Removed</span><h1 style="${styles.title};margin-top:16px">Account Removed</h1><p style="${styles.text}">Hi ${customer.firstName}, your account has been permanently removed.</p></div>`, 'Account Removed'),
    textBody: `Hi ${customer.firstName}, your account has been removed.`,
});

const customerOrderConfirmed = (user, order) => ({
    subject: `Order Confirmed — ${order.restaurantName} — KES ${(order.total || 0).toLocaleString()}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeSuccess}">Confirmed</span>
            <h1 style="${styles.title};margin-top:16px">Order Confirmed!</h1>
            <p style="${styles.text}">Great news, ${user.firstName}! Your order from <strong>${order.restaurantName}</strong> has been placed and is being prepared.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Restaurant</span><span style="${styles.detailValue}">${order.restaurantName}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Items</span><span style="${styles.detailValue}">${order.itemsCount} items</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Order Type</span><span style="${styles.detailValue}">${order.orderType || 'delivery'}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Total</span><span style="${styles.detailValue}">KES ${(order.total || 0).toLocaleString()}</span></div>
                ${order.estimatedTime ? `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Est. Delivery</span><span style="${styles.detailValue}">${order.estimatedTime} minutes</span></div>` : ''}
                ${order.deliveryAddress ? `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Delivery Address</span><span style="${styles.detailValue}">${order.deliveryAddress}</span></div>` : ''}
                ${order.phone ? `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Phone</span><span style="${styles.detailValue}">${order.phone}</span></div>` : ''}
            </div>
            <h3 style="margin-top:20px;color:#0f172a;">Order Items</h3>
            ${(order.items || []).map(item => `
                <div style="${styles.card}">
                    <div style="${styles.detailRow}">
                        <span style="${styles.detailLabel}">${item.name} x${item.quantity}</span>
                        <span style="${styles.detailValue}">KES ${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                </div>
            `).join('')}
            ${order.notes ? `<p style="${styles.text};margin-top:16px;font-style:italic">Notes: ${order.notes}</p>` : ''}
        </div>
    `, 'Order Confirmed'),
    textBody: `Order Confirmed! ${order.restaurantName} — ${order.itemsCount} items — KES ${(order.total || 0).toLocaleString()}. Est. delivery: ${order.estimatedTime || 'N/A'} min.`,
});

const customerRideConfirmed = (user, ride) => ({
    subject: `Ride Booked — ${ride.vehicleName}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeSuccess}">Confirmed</span><h1 style="${styles.title};margin-top:16px">Ride Booked!</h1><p style="${styles.text}">Your ride has been booked.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Vehicle</span><span style="${styles.detailValue}">${ride.vehicleName}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Pickup</span><span style="${styles.detailValue}">${ride.pickup}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Dropoff</span><span style="${styles.detailValue}">${ride.dropoff}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Fare</span><span style="${styles.detailValue}">KES ${(ride.total || 0).toLocaleString()}</span></div></div></div>`, 'Ride Booked'),
    textBody: `Ride booked: ${ride.vehicleName}. Fare: KES ${(ride.total || 0).toLocaleString()}`,
});

const partnerWelcome = (user, verificationLink) => ({
    subject: 'Welcome to Digital Safaris Partner Portal',
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">Welcome, ${user.firstName}! 🏨</h1><p style="${styles.text}">Your partner dashboard is ready. Manage your business all in one place.</p><a href="${verificationLink}" style="${styles.button}">Verify Your Email</a></div>`, 'Partner Welcome'),
    textBody: `Welcome, ${user.firstName}! Verify: ${verificationLink}`,
});

const partnerRegistrationReceived = (user) => ({
    subject: 'Registration Received - Pending Approval',
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeWarning}">Pending</span><h1 style="${styles.title};margin-top:16px">Registration Received</h1><p style="${styles.text}">Hi ${user.firstName}, your registration for <strong>${user.businessName}</strong> is pending approval.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Business</span><span style="${styles.detailValue}">${user.businessName}</span></div></div></div>`, 'Registration Received'),
    textBody: `Hi ${user.firstName}, registration for ${user.businessName} is pending approval.`,
});

const partnerApproved = (user) => ({
    subject: 'Account Approved - Start Operating! 🎉',
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeSuccess}">Approved</span><h1 style="${styles.title};margin-top:16px">Account Approved!</h1><p style="${styles.text}">Congratulations ${user.firstName}! <strong>${user.businessName}</strong> is now active.</p><a href="${PARTNER_URL || 'http://localhost:3000'}/login" style="${styles.button}">Go to Dashboard</a></div>`, 'Account Approved'),
    textBody: `Congratulations ${user.firstName}! ${user.businessName} is now active.`,
});

const partnerPasswordReset = (user, resetLink) => ({
    subject: 'Reset Your Partner Password',
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">Password Reset</h1><p style="${styles.text}">Hi ${user.firstName}, click below to reset your password.</p><a href="${resetLink}" style="${styles.button}">Reset Password</a></div>`, 'Password Reset'),
    textBody: `Reset: ${resetLink}`,
});

const partnerOTP = (user, otp) => ({
    subject: 'Your Verification Code',
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">Verification Code</h1><p style="${styles.text}">Hi ${user.firstName}, use this code:</p><div style="text-align:center;margin:32px 0"><span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#0f172a;background:#f8fafc;padding:16px 32px;border-radius:12px">${otp}</span></div></div>`, 'Verification'),
    textBody: `Code: ${otp}`,
});

const partnerNewReservation = (user, reservation) => ({
    subject: `New Reservation — ${reservation.propertyName}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeSuccess}">New Booking</span><h1 style="${styles.title};margin-top:16px">New Reservation</h1><p style="${styles.text}">A guest has booked <strong>${reservation.propertyName}</strong>.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Guest</span><span style="${styles.detailValue}">${reservation.guestName}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Room</span><span style="${styles.detailValue}">${reservation.roomNumber}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Check-in</span><span style="${styles.detailValue}">${reservation.checkIn}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Check-out</span><span style="${styles.detailValue}">${reservation.checkOut}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Amount</span><span style="${styles.detailValue}">KES ${(reservation.totalAmount || 0).toLocaleString()}</span></div></div></div>`, 'New Reservation'),
    textBody: `New reservation: ${reservation.guestName} — ${reservation.propertyName}, KES ${(reservation.totalAmount || 0).toLocaleString()}`,
});

const partnerReservationCancelled = (user, reservation) => ({
    subject: `Reservation Cancelled — ${reservation.propertyName}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeDanger}">Cancelled</span><h1 style="${styles.title};margin-top:16px">Reservation Cancelled</h1><p style="${styles.text}">A reservation for <strong>${reservation.propertyName}</strong> has been cancelled.</p></div>`, 'Reservation Cancelled'),
    textBody: `Reservation cancelled: ${reservation.propertyName}`,
});

const partnerNewReview = (user, review) => ({
    subject: `New Review — ${review.propertyName} — ${review.rating}/5`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeInfo}">New Review</span><h1 style="${styles.title};margin-top:16px">New Review</h1><p style="${styles.text}"><strong>${review.guestName}</strong> left a ${review.rating}-star review.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Comment</span><span style="${styles.detailValue}">${review.comment}</span></div></div></div>`, 'New Review'),
    textBody: `New ${review.rating}-star review from ${review.guestName}: "${review.comment}"`,
});

const partnerPayout = (user, payout) => ({
    subject: `Payout Processed — KES ${(payout.amount || 0).toLocaleString()}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeSuccess}">Payout</span><h1 style="${styles.title};margin-top:16px">Payout Processed</h1><p style="${styles.text}">Hi ${user.firstName}, a payout of <strong>KES ${(payout.amount || 0).toLocaleString()}</strong> has been sent.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Amount</span><span style="${styles.detailValue}">KES ${(payout.amount || 0).toLocaleString()}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Method</span><span style="${styles.detailValue}">${payout.method}</span></div></div></div>`, 'Payout Processed'),
    textBody: `Payout of KES ${(payout.amount || 0).toLocaleString()} via ${payout.method}.`,
});

const partnerPropertyPublished = (user, property) => ({
    subject: `Property Published — ${property.name}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeSuccess}">Live</span><h1 style="${styles.title};margin-top:16px">Property Published</h1><p style="${styles.text}"><strong>${property.name}</strong> is now live.</p></div>`, 'Property Published'),
    textBody: `"${property.name}" is now live!`,
});

const partnerStaffInvite = (user, inviteLink, role) => ({
    subject: `You've been invited as ${role}`,
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">Team Invitation</h1><p style="${styles.text}">Hi ${user.firstName}, you've been invited as <strong>${role}</strong>.</p><a href="${inviteLink}" style="${styles.button}">Accept Invitation</a></div>`, 'Team Invitation'),
    textBody: `You've been invited as ${role}. Accept: ${inviteLink}`,
});

const partnerHousekeepingAssigned = (user, task) => ({
    subject: `Task Assigned — Room ${task.roomNumber}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeWarning}">New Task</span><h1 style="${styles.title};margin-top:16px">Task Assigned</h1><p style="${styles.text}">Hi ${user.firstName}, a new task has been assigned.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Room</span><span style="${styles.detailValue}">${task.roomNumber}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Task</span><span style="${styles.detailValue}">${task.type}</span></div></div></div>`, 'Task Assigned'),
    textBody: `New task: Room ${task.roomNumber} — ${task.type}`,
});

const partnerPromotionCreated = (user, promo) => ({
    subject: `Promotion Live — ${promo.code}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeSuccess}">Live</span><h1 style="${styles.title};margin-top:16px">Promotion Created</h1><p style="${styles.text}">Your promotion <strong>${promo.code}</strong> is now live.</p></div>`, 'Promotion Created'),
    textBody: `Promo ${promo.code} is live!`,
});

const partnerAccountChanged = (user, changes) => ({
    subject: 'Partner Account Updated',
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeInfo}">Security</span><h1 style="${styles.title};margin-top:16px">Account Updated</h1><p style="${styles.text}">Hi ${user.firstName}, your account <strong>${changes}</strong> was changed.</p></div>`, 'Account Updated'),
    textBody: `Hi ${user.firstName}, your ${changes} was updated.`,
});

const partnerNewRegistration = (admin, partner) => ({
    subject: `New Partner Registration — ${partner.businessName}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeInfo}">New Registration</span><h1 style="${styles.title};margin-top:16px">New Partner Registration</h1><p style="${styles.text}">A new partner requires review.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Business</span><span style="${styles.detailValue}">${partner.businessName}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Email</span><span style="${styles.detailValue}">${partner.email}</span></div></div><a href="${process.env.ADMIN_URL || 'http://localhost:3001'}/partners" style="${styles.button}">Review Partner</a></div>`, 'New Partner'),
    textBody: `New partner: ${partner.businessName} (${partner.email})`,
});

const partnerAccountDeleted = (partner) => ({
    subject: 'Your Partner Account Has Been Removed',
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeDanger}">Account Removed</span><h1 style="${styles.title};margin-top:16px">Account Removed</h1><p style="${styles.text}">Hi ${partner.firstName}, your partner account for <strong>${partner.businessName}</strong> has been removed.</p></div>`, 'Account Removed'),
    textBody: `Hi ${partner.firstName}, your account for ${partner.businessName} has been removed.`,
});

const partnerNewOrder = (partner, order) => ({
    subject: `New Order — ${order.customerName} — KES ${(order.total || 0).toLocaleString()}`,
    htmlBody: wrap(`
        <div style="${styles.body}">
            <span style="${styles.badge};${styles.badgeInfo}">New Order</span>
            <h1 style="${styles.title};margin-top:16px">New Order Received!</h1>
            <p style="${styles.text}">You have a new order from <strong>${order.customerName}</strong>.</p>
            <div style="${styles.card}">
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Items</span><span style="${styles.detailValue}">${order.itemsCount} items</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Order Type</span><span style="${styles.detailValue}">${order.orderType || 'delivery'}</span></div>
                <div style="${styles.detailRow}"><span style="${styles.detailLabel}">Total</span><span style="${styles.detailValue}">KES ${(order.total || 0).toLocaleString()}</span></div>
                ${order.phone ? `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Phone</span><span style="${styles.detailValue}">${order.phone}</span></div>` : ''}
                ${order.deliveryAddress ? `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Delivery</span><span style="${styles.detailValue}">${order.deliveryAddress}</span></div>` : ''}
                ${order.notes ? `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Notes</span><span style="${styles.detailValue}">${order.notes}</span></div>` : ''}
            </div>
            <h3 style="margin-top:20px;color:#0f172a;">Order Items</h3>
            ${(order.items || []).map(item => `
                <div style="${styles.card}">
                    <div style="${styles.detailRow}">
                        <span style="${styles.detailLabel}">${item.name} x${item.quantity}</span>
                        <span style="${styles.detailValue}">KES ${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                </div>
            `).join('')}
            <a href="${PARTNER_URL || 'http://localhost:3000'}/orders/${order.id}" style="${styles.button}">View Order</a>
        </div>
    `, 'New Order'),
    textBody: `New order from ${order.customerName}: ${order.itemsCount} items — KES ${(order.total || 0).toLocaleString()}. ${order.deliveryAddress || ''}`,
});

const partnerNewRide = (partner, ride) => ({
    subject: `New Ride — ${ride.customerName} — ${ride.vehicleName}`,
    htmlBody: wrap(`<div style="${styles.body}"><span style="${styles.badge};${styles.badgeInfo}">New Ride</span><h1 style="${styles.title};margin-top:16px">New Ride!</h1><p style="${styles.text}">From <strong>${ride.customerName}</strong>.</p><div style="${styles.card}"><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Vehicle</span><span style="${styles.detailValue}">${ride.vehicleName}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Pickup</span><span style="${styles.detailValue}">${ride.pickup || 'N/A'}</span></div><div style="${styles.detailRow}"><span style="${styles.detailLabel}">Dropoff</span><span style="${styles.detailValue}">${ride.dropoff || 'N/A'}</span></div>${ride.seats > 1 ? `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Seats</span><span style="${styles.detailValue}">${ride.seats}</span></div>` : ''}<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Fare</span><span style="${styles.detailValue}">KES ${(ride.total || 0).toLocaleString()}</span></div>${ride.distance ? `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Distance</span><span style="${styles.detailValue}">${ride.distance} km</span></div>` : ''}${ride.scheduledTime ? `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Scheduled</span><span style="${styles.detailValue}">${new Date(ride.scheduledTime).toLocaleString()}</span></div>` : ''}${ride.phone ? `<div style="${styles.detailRow}"><span style="${styles.detailLabel}">Phone</span><span style="${styles.detailValue}">${ride.phone}</span></div>` : ''}</div></div>`, 'New Ride'),
    textBody: `New ride from ${ride.customerName}: ${ride.vehicleName}, ${ride.pickup || ''} → ${ride.dropoff || ''}, KES ${(ride.total || 0).toLocaleString()}. Seats: ${ride.seats || 1}.`,
});

const dailyDigest = (user, summary) => ({
    subject: `Daily Digest — ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`,
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">Daily Digest</h1><p style="${styles.text}">Hi ${user.firstName}, here's your summary.</p>${summary.map(item => `<div style="${styles.card}"><span style="${styles.badge};${item.badgeStyle || styles.badgeInfo}">${item.badge}</span><p style="margin-top:12px;color:#0f172a;font-weight:600">${item.title}</p></div>`).join('')}</div>`, 'Daily Digest'),
    textBody: `Hi ${user.firstName}, here's your daily summary.`,
});

const customerRestaurantReviewRequest = (user, data) => ({
    subject: `How was your meal at ${data.restaurantName}?`,
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">How was your meal?</h1><p style="${styles.text}">Hi ${user.firstName}, we hope you enjoyed your meal at <strong>${data.restaurantName}</strong>. Share your experience!</p><a href="${CUSTOMER_URL}/reviews?orderId=${data.id}&restaurantId=${data.restaurantId}&name=${encodeURIComponent(data.restaurantName)}" style="${styles.button}">Write a Review</a></div>`, 'Review Request'),
    textBody: `How was your meal at ${data.restaurantName}? Review: ${CUSTOMER_URL}/reviews`,
});

const customerTransportReviewRequest = (user, data) => ({
    subject: `How was your ride with ${data.vehicleName}?`,
    htmlBody: wrap(`<div style="${styles.body}"><h1 style="${styles.title}">How was your ride?</h1><p style="${styles.text}">Hi ${user.firstName}, we hope you enjoyed your ride with <strong>${data.vehicleName}</strong>. Share your experience!</p><a href="${CUSTOMER_URL}/reviews?rideId=${data.id}&vehicleId=${data.vehicleId}&name=${encodeURIComponent(data.vehicleName)}" style="${styles.button}">Write a Review</a></div>`, 'Review Request'),
    textBody: `How was your ride with ${data.vehicleName}? Review: ${CUSTOMER_URL}/reviews`,
});

module.exports = {
    customer: {
        welcome: customerWelcome, passwordReset: customerPasswordReset, otp: customerOTP,
        bookingConfirmed: customerBookingConfirmed, bookingCancelled: customerBookingCancelled,
        bookingReminder: customerBookingReminder, paymentReceived: customerPaymentReceived,
        paymentFailed: customerPaymentFailed, refund: customerRefund,
        promotionApplied: customerPromotionApplied, reviewRequest: customerReviewRequest,
        walletTopup: customerWalletTopup, accountChanged: customerAccountChanged,
        accountDeleted: customerAccountDeleted, orderConfirmed: customerOrderConfirmed,
        rideConfirmed: customerRideConfirmed,
        restaurantReviewRequest: customerRestaurantReviewRequest,
        transportReviewRequest: customerTransportReviewRequest,
    },
    partner: {
        welcome: partnerWelcome, registrationReceived: partnerRegistrationReceived,
        approved: partnerApproved, passwordReset: partnerPasswordReset, otp: partnerOTP,
        newReservation: partnerNewReservation, reservationCancelled: partnerReservationCancelled,
        newReview: partnerNewReview, payout: partnerPayout, propertyPublished: partnerPropertyPublished,
        staffInvite: partnerStaffInvite, housekeepingAssigned: partnerHousekeepingAssigned,
        promotionCreated: partnerPromotionCreated, accountChanged: partnerAccountChanged,
        newPartnerRegistration: partnerNewRegistration, accountDeleted: partnerAccountDeleted,
        newOrder: partnerNewOrder, newRide: partnerNewRide,
    },
    dailyDigest,
};