const readline = require('readline');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/digital-concierge';

const Admin = require('../models/admin/Admin');
const Customer = require('../models/customer/Customer');
const AccommodationPartner = require('../models/accommodation/AccommodationPartner');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const banner = () => {
    console.clear();
    console.log('═══════════════════════════════════════════');
    console.log('  Digital Concierge - Admin CLI');
    console.log('═══════════════════════════════════════════');
    console.log(`  DB: ${MONGO_URI}`);
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('  1. List Admins');
    console.log('  2. Create Admin');
    console.log('  3. Manage Admin');
    console.log('  4. List DB Collections');
    console.log('  5. Drop Collection');
    console.log('  6. Drop Entire DB');
    console.log('  0. Exit');
    console.log('');
};

const listAdmins = async () => {
    console.log('\n--- Admins ---');
    const admins = await Admin.find().select('-password');
    if (admins.length === 0) return console.log('No admins found.\n');
    admins.forEach((a, i) => {
        console.log(`  ${i + 1}. ${a.firstName} ${a.lastName} (${a.email}) - ${a.role} [${a.isActive ? 'Active' : 'Inactive'}]`);
    });
    console.log('');
};

const createAdmin = async () => {
    console.log('\n--- Create Admin ---');
    const firstName = await question('  First Name: ');
    const lastName = await question('  Last Name: ');
    const email = await question('  Email: ');
    const password = await question('  Password: ');
    const role = await question('  Role (super_admin/admin/support) [admin]: ');
    const admin = await Admin.create({
        firstName,
        lastName,
        email,
        password,
        role: role || 'admin',
    });
    console.log(`  Admin created: ${admin.email} (${admin.role})\n`);
};

const manageAdmin = async () => {
    await listAdmins();
    const email = await question('  Enter admin email to manage: ');
    const admin = await Admin.findOne({ email });
    if (!admin) return console.log('  Admin not found.\n');

    console.log(`\n  Managing: ${admin.firstName} ${admin.lastName} (${admin.email})`);
    console.log(`  Role: ${admin.role} | Active: ${admin.isActive}`);
    console.log('  1. Toggle Active/Inactive');
    console.log('  2. Change Role');
    console.log('  3. Reset Password');
    console.log('  4. Delete Admin');
    const choice = await question('  Choose: ');

    if (choice === '1') {
        admin.isActive = !admin.isActive;
        await admin.save();
        console.log(`  Status: ${admin.isActive ? 'Active' : 'Inactive'}\n`);
    } else if (choice === '2') {
        const role = await question('  New Role (super_admin/admin/support): ');
        admin.role = role;
        await admin.save();
        console.log(`  Role updated to: ${role}\n`);
    } else if (choice === '3') {
        const password = await question('  New Password: ');
        admin.password = password;
        await admin.save();
        console.log('  Password reset.\n');
    } else if (choice === '4') {
        const confirm = await question('  Type DELETE to confirm: ');
        if (confirm === 'DELETE') {
            await Admin.findByIdAndDelete(admin._id);
            console.log('  Admin deleted.\n');
        }
    }
};

const listCollections = async () => {
    console.log('\n--- DB Collections ---');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach((c) => console.log(`  - ${c.name}`));
    console.log(`  Total: ${collections.length} collections\n`);
};

const dropCollection = async () => {
    await listCollections();
    const name = await question('  Collection name to drop: ');
    const confirm = await question(`  Type DROP to confirm dropping "${name}": `);
    if (confirm === 'DROP') {
        await mongoose.connection.db.dropCollection(name);
        console.log(`  Collection "${name}" dropped.\n`);
    }
};

const dropDatabase = async () => {
    console.log('\n  WARNING: This will delete ALL data.');
    const confirm = await question('  Type the database name to confirm: ');
    if (confirm === mongoose.connection.db.databaseName) {
        await mongoose.connection.db.dropDatabase();
        console.log('  Database dropped.\n');
        process.exit(0);
    } else {
        console.log('  Cancelled.\n');
    }
};

const main = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Connected to: ${MONGO_URI}\n`);

        while (true) {
            banner();
            const choice = await question('  Select option: ');

            if (choice === '0') break;
            if (choice === '1') await listAdmins();
            if (choice === '2') await createAdmin();
            if (choice === '3') await manageAdmin();
            if (choice === '4') await listCollections();
            if (choice === '5') await dropCollection();
            if (choice === '6') await dropDatabase();

            await question('\n  Press Enter to continue...');
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        rl.close();
        console.log('\nGoodbye.\n');
    }
};

main();