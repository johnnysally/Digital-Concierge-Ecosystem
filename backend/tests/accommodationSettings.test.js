const test = require('node:test');
const assert = require('node:assert/strict');
const { mergeSettings } = require('../controllers/accommodation/settingsController');

test('mergeSettings keeps defaults and applies overrides', () => {
    const defaults = {
        businessName: 'Digital Safaris Partner',
        portalName: 'Digital Safaris Accommodation',
        allowInstantBooking: true,
        enableEmailNotifications: true,
    };

    const merged = mergeSettings(defaults, {
        businessName: 'Sunset Stay',
        allowInstantBooking: false,
    });

    assert.equal(merged.businessName, 'Sunset Stay');
    assert.equal(merged.portalName, 'Digital Safaris Accommodation');
    assert.equal(merged.allowInstantBooking, false);
    assert.equal(merged.enableEmailNotifications, true);
});
