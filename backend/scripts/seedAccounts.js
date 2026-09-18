const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/digital-concierge';

const Admin = require('../models/admin/Admin');
const Customer = require('../models/customer/Customer');
const AccommodationPartner = require('../models/accommodation/AccommodationPartner');
const RestaurantPartner = require('../models/restaurant/RestaurantPartner');
const TransportPartner = require('../models/transport/TransportPartner');

const demoPassword = 'Password123!';

const seedAccounts = async () => {
    try {
        console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        // 1. Admin Account
        const adminEmail = 'admin@digitalconcierge.com';
        let admin = await Admin.findOne({ email: adminEmail });
        if (!admin) {
            admin = new Admin({
                firstName: 'Demo',
                lastName: 'Admin',
                email: adminEmail,
                password: demoPassword,
                role: 'super_admin',
                isActive: true,
            });
            await admin.save();
            console.log(`✓ Admin created: ${adminEmail}`);
        } else {
            admin.password = demoPassword;
            admin.isActive = true;
            await admin.save();
            console.log(`✓ Admin updated: ${adminEmail}`);
        }

        // 2. Customer Account
        const customerEmail = 'demo.user@digitalconcierge.com';
        let customer = await Customer.findOne({ email: customerEmail });
        if (!customer) {
            customer = new Customer({
                firstName: 'Alex',
                lastName: 'Customer',
                email: customerEmail,
                password: demoPassword,
                phone: '+254712345678',
                isVerified: true,
                isActive: true,
            });
            await customer.save();
            console.log(`✓ Customer created: ${customerEmail}`);
        } else {
            customer.password = demoPassword;
            customer.isVerified = true;
            customer.isActive = true;
            await customer.save();
            console.log(`✓ Customer updated: ${customerEmail}`);
        }

        // 3. Accommodation Partner Account
        const hotelEmail = 'hotel.partner@digitalconcierge.com';
        let hotel = await AccommodationPartner.findOne({ email: hotelEmail });
        if (!hotel) {
            hotel = new AccommodationPartner({
                firstName: 'Sarah',
                lastName: 'Hotelier',
                email: hotelEmail,
                password: demoPassword,
                phone: '+254722000111',
                businessName: 'Safari Haven Luxury Lodge',
                businessType: 'hotel',
                isVerified: true,
                isActive: true,
            });
            await hotel.save();
            console.log(`✓ Accommodation Partner created: ${hotelEmail}`);
        } else {
            hotel.password = demoPassword;
            hotel.isVerified = true;
            hotel.isActive = true;
            await hotel.save();
            console.log(`✓ Accommodation Partner updated: ${hotelEmail}`);
        }

        // 4. Restaurant Partner Account
        const restaurantEmail = 'restaurant.partner@digitalconcierge.com';
        let restaurant = await RestaurantPartner.findOne({ email: restaurantEmail });
        if (!restaurant) {
            restaurant = new RestaurantPartner({
                firstName: 'Chef',
                lastName: 'Mario',
                email: restaurantEmail,
                password: demoPassword,
                phone: '+254733000222',
                businessName: 'Savanna Bistro & Grill',
                cuisine: 'african',
                isVerified: true,
                isActive: true,
                isOpen: true,
            });
            await restaurant.save();
            console.log(`✓ Restaurant Partner created: ${restaurantEmail}`);
        } else {
            restaurant.password = demoPassword;
            restaurant.isVerified = true;
            restaurant.isActive = true;
            restaurant.isOpen = true;
            await restaurant.save();
            console.log(`✓ Restaurant Partner updated: ${restaurantEmail}`);
        }

        // 5. Transport Partner Account
        const transportEmail = 'transport.partner@digitalconcierge.com';
        let transport = await TransportPartner.findOne({ email: transportEmail });
        if (!transport) {
            transport = new TransportPartner({
                firstName: 'David',
                lastName: 'Driver',
                email: transportEmail,
                password: demoPassword,
                phone: '+254744000333',
                businessName: 'Safari Rides Express',
                businessType: 'ride_hailing',
                isVerified: true,
                isActive: true,
            });
            await transport.save();
            console.log(`✓ Transport Partner created: ${transportEmail}`);
        } else {
            transport.password = demoPassword;
            transport.isVerified = true;
            transport.isActive = true;
            await transport.save();
            console.log(`✓ Transport Partner updated: ${transportEmail}`);
        }

        console.log('\nAll test accounts successfully initialized!');
    } catch (err) {
        console.error('Error seeding accounts:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedAccounts();
