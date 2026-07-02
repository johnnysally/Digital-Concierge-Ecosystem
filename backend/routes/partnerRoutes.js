const express = require('express');
const multer = require('multer');
const partnerService = require('../services/partnerService');

const upload = multer();
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Partner API root',
        endpoints: {
            property: '/api/partners/accommodation/property',
            profile: '/api/partners/accommodation/profile',
            rooms: '/api/partners/accommodation/rooms',
            staff: '/api/partners/accommodation/staff',
            guests: '/api/partners/accommodation/guests',
            reservations: '/api/partners/accommodation/reservations',
            promotions: '/api/partners/accommodation/promotions',
            documents: '/api/partners/accommodation/documents',
            housekeeping: '/api/partners/accommodation/housekeeping',
            notifications: '/api/partners/accommodation/notifications',
            payments: '/api/partners/accommodation/payments',
            analytics: '/api/partners/accommodation/analytics',
            ai: '/api/partners/accommodation/ai',
            communication: '/api/partners/accommodation/communication',
            settings: '/api/partners/accommodation/settings',
        },
    });
});

router.get('/accommodation/profile', async (req, res, next) => {
    try {
        const profile = partnerService.listProfile();
        res.json(profile);
    } catch (error) {
        next(error);
    }
});

router.put('/accommodation/profile', async (req, res, next) => {
    try {
        const updated = partnerService.updateProfile(req.body);
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/settings', async (req, res, next) => {
    try {
        const settings = partnerService.getSettings();
        res.json(settings);
    } catch (error) {
        next(error);
    }
});

router.put('/accommodation/settings', async (req, res, next) => {
    try {
        const updated = partnerService.updateSettings(req.body);
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/property', async (req, res, next) => {
    try {
        res.json(partnerService.listProperties());
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/property/:id', async (req, res, next) => {
    try {
        const property = partnerService.getProperty(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
        res.json(property);
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/property', async (req, res, next) => {
    try {
        const property = partnerService.createProperty(req.body);
        res.status(201).json(property);
    } catch (error) {
        next(error);
    }
});

router.put('/accommodation/property/:id', async (req, res, next) => {
    try {
        const updated = partnerService.updateProperty(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Property not found' });
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/rooms/types', async (req, res, next) => {
    try {
        res.json(partnerService.listRoomTypes());
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/rooms', async (req, res, next) => {
    try {
        res.json(partnerService.listRooms());
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/rooms', async (req, res, next) => {
    try {
        const room = partnerService.createRoom(req.body);
        res.status(201).json(room);
    } catch (error) {
        next(error);
    }
});

router.put('/accommodation/rooms/:id', async (req, res, next) => {
    try {
        const updated = partnerService.updateRoom(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/staff', async (req, res, next) => {
    try {
        res.json(partnerService.listStaff());
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/staff', async (req, res, next) => {
    try {
        const staff = partnerService.createStaff(req.body);
        res.status(201).json(staff);
    } catch (error) {
        next(error);
    }
});

router.put('/accommodation/staff/:id', async (req, res, next) => {
    try {
        const updated = partnerService.updateStaff(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Staff member not found' });
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/guests', async (req, res, next) => {
    try {
        res.json(partnerService.listGuests());
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/guests/:id', async (req, res, next) => {
    try {
        const guest = partnerService.getGuest(req.params.id);
        if (!guest) return res.status(404).json({ success: false, message: 'Guest not found' });
        res.json(guest);
    } catch (error) {
        next(error);
    }
});

router.put('/accommodation/guests/:id', async (req, res, next) => {
    try {
        const updated = partnerService.updateGuest(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Guest not found' });
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/reservations', async (req, res, next) => {
    try {
        res.json(partnerService.listReservations());
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/reservations/:id', async (req, res, next) => {
    try {
        const reservation = partnerService.getReservation(req.params.id);
        if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
        res.json(reservation);
    } catch (error) {
        next(error);
    }
});

router.put('/accommodation/reservations/:id', async (req, res, next) => {
    try {
        const updated = partnerService.updateReservation(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Reservation not found' });
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/reservations/:id/cancel', async (req, res, next) => {
    try {
        const cancelled = partnerService.cancelReservation(req.params.id);
        if (!cancelled) return res.status(404).json({ success: false, message: 'Reservation not found' });
        res.json(cancelled);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/dashboard', async (req, res, next) => {
    try {
        res.json({ metrics: partnerService.getDashboardMetrics() });
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/orders', async (req, res, next) => {
    try {
        res.json({ orders: partnerService.listOrders() });
    } catch (error) {
        next(error);
    }
});

router.put('/accommodation/orders/:id/status', async (req, res, next) => {
    try {
        const updated = partnerService.updateOrderStatus(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/menu', async (req, res, next) => {
    try {
        res.json({ categories: partnerService.listMenuCategories() });
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/promotions', async (req, res, next) => {
    try {
        res.json(partnerService.listPromotions());
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/promotions', async (req, res, next) => {
    try {
        const promo = partnerService.createPromotion(req.body);
        res.status(201).json(promo);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/documents', async (req, res, next) => {
    try {
        res.json(partnerService.listDocuments());
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/documents', upload.single('file'), async (req, res, next) => {
    try {
        const documentPayload = {
            name: req.file?.originalname || req.body.name,
            type: req.file?.mimetype || req.body.type,
            size: req.file?.size ? `${req.file.size} bytes` : req.body.size || 'Unknown',
            uploadedAt: new Date().toISOString(),
            metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {},
        };
        const document = partnerService.createDocument(documentPayload);
        res.status(201).json(document);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/reviews', async (req, res, next) => {
    try {
        res.json(partnerService.listReviews());
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/reviews/:id/response', async (req, res, next) => {
    try {
        const review = partnerService.respondToReview(req.params.id, req.body.response);
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/housekeeping/tasks', async (req, res, next) => {
    try {
        res.json(partnerService.listHousekeepingTasks());
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/housekeeping/tasks/:id/assign', async (req, res, next) => {
    try {
        const task = partnerService.assignHousekeepingTask(req.params.id, req.body);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json(task);
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/housekeeping/tasks/:id/complete', async (req, res, next) => {
    try {
        const task = partnerService.completeHousekeepingTask(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json(task);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/notifications', async (req, res, next) => {
    try {
        res.json(partnerService.listNotifications());
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/notifications/:id/read', async (req, res, next) => {
    try {
        const notification = partnerService.markNotificationRead(req.params.id);
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.json(notification);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/payments/payouts', async (req, res, next) => {
    try {
        res.json(partnerService.listPayouts());
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/payments/transactions', async (req, res, next) => {
    try {
        res.json(partnerService.listTransactions());
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/analytics/occupancy', async (req, res, next) => {
    try {
        res.json(partnerService.getAnalyticsOccupancy());
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/analytics/revenue', async (req, res, next) => {
    try {
        res.json(partnerService.getAnalyticsRevenue());
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/delivery/requests', async (req, res, next) => {
    try {
        res.json({ requests: partnerService.listDeliveryRequests() });
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/payments/overview', async (req, res, next) => {
    try {
        res.json(partnerService.getPaymentsOverview());
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/analytics', async (req, res, next) => {
    try {
        res.json({ insights: partnerService.getAnalyticsSummary() });
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/ai/assistant', async (req, res, next) => {
    try {
        const response = partnerService.askAIAssistant(req.body.query || '');
        res.json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/ai/insight', async (req, res, next) => {
    try {
        const query = req.query.q || '';
        res.json(partnerService.getAIInsight(query));
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/ai/pricing/recommend', async (req, res, next) => {
    try {
        res.json(partnerService.recommendPricing(req.body));
    } catch (error) {
        next(error);
    }
});

router.post('/accommodation/communication/messages', async (req, res, next) => {
    try {
        const message = partnerService.createMessage(req.body.threadId, req.body);
        if (!message) return res.status(404).json({ success: false, message: 'Thread not found' });
        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
});

router.get('/accommodation/communication/threads/:threadId/messages', async (req, res, next) => {
    try {
        res.json(partnerService.getThreadMessages(req.params.threadId));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
