const express = require('express');
const { getTravelerProfiles, getPromotions } = require('../services/customerService');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Customer API root',
        endpoints: {
            travelerProfiles: '/api/customer/traveler-profiles',
            promotions: '/api/customer/promotions',
        },
    });
});

router.get('/traveler-profiles', async (req, res, next) => {
    try {
        const profiles = await getTravelerProfiles();
        res.json(profiles);
    } catch (error) {
        next(error);
    }
});

router.get('/promotions', async (req, res, next) => {
    try {
        const promotions = await getPromotions();
        res.json(promotions);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
