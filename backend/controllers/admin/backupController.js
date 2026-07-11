const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { sendEmail } = require('../../services/emailService');
const logger = require('../../utils/logger');

const BACKUP_DIR = path.join(__dirname, '..', '..', 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const ObjectId = mongoose.Types.ObjectId;

const convertIds = (data) => {
    if (Array.isArray(data)) {
        return data.map(item => convertIds(item));
    }
    if (data && typeof data === 'object' && !(data instanceof Date)) {
        const converted = {};
        for (const [key, value] of Object.entries(data)) {
            if (key === '_id' && typeof value === 'string' && value.length === 24) {
                converted[key] = new ObjectId(value);
            } else if (key.endsWith('Id') || key === 'customer' || key === 'partner' || key === 'property' || key === 'room' || key === 'booking' || key === 'assignedTo' || key === 'resolvedBy' || key === 'updatedBy') {
                if (typeof value === 'string' && value.length === 24) {
                    converted[key] = new ObjectId(value);
                } else if (value && typeof value === 'object' && value._id) {
                    converted[key] = new ObjectId(value._id);
                } else {
                    converted[key] = convertIds(value);
                }
            } else {
                converted[key] = convertIds(value);
            }
        }
        return converted;
    }
    return data;
};

const createBackup = async (req, res, next) => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup-${timestamp}.json`;
        const filepath = path.join(BACKUP_DIR, filename);

        const collections = await mongoose.connection.db.listCollections().toArray();
        const backup = {};

        for (const col of collections) {
            const data = await mongoose.connection.db.collection(col.name).find({}).toArray();
            backup[col.name] = data.map(doc => {
                const obj = { ...doc };
                if (obj.password) delete obj.password;
                if (obj.resetPasswordToken) delete obj.resetPasswordToken;
                if (obj.verificationToken) delete obj.verificationToken;
                return obj;
            });
        }

        backup.metadata = {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            collections: collections.length,
            createdBy: req.user.email,
            size: JSON.stringify(backup).length,
        };

        fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
        logger.info(`Backup created: ${filename}`);

        res.json({
            success: true,
            backup: {
                filename,
                size: `${(backup.metadata.size / 1024).toFixed(2)} KB`,
                collections: collections.length,
                createdAt: backup.metadata.timestamp,
            },
        });
    } catch (error) {
        logger.error(`Backup failed: ${error.message}`);
        next(error);
    }
};

const listBackups = async (req, res, next) => {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.endsWith('.json'))
            .map(f => {
                const stats = fs.statSync(path.join(BACKUP_DIR, f));
                return { filename: f, size: `${(stats.size / 1024).toFixed(2)} KB`, createdAt: stats.birthtime };
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json({ success: true, backups: files });
    } catch (error) { next(error); }
};

const downloadBackup = async (req, res, next) => {
    try {
        const filepath = path.join(BACKUP_DIR, req.params.filename);
        if (!fs.existsSync(filepath)) return res.status(404).json({ success: false, message: 'Backup not found' });
        res.download(filepath);
    } catch (error) { next(error); }
};

const restoreBackup = async (req, res, next) => {
    try {
        const filepath = path.join(BACKUP_DIR, req.params.filename);
        if (!fs.existsSync(filepath)) return res.status(404).json({ success: false, message: 'Backup not found' });

        const backup = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
        const collections = Object.keys(backup).filter(k => k !== 'metadata');

        for (const col of collections) {
            if (backup[col].length > 0) {
                const converted = convertIds(backup[col]);
                await mongoose.connection.db.collection(col).deleteMany({});
                await mongoose.connection.db.collection(col).insertMany(converted);
            }
        }

        logger.info(`Backup restored: ${req.params.filename}`);
        res.json({ success: true, message: 'Backup restored successfully', collections: collections.length });
    } catch (error) {
        logger.error(`Restore failed: ${error.message}`);
        next(error);
    }
};

const uploadBackup = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        const backup = JSON.parse(req.file.buffer.toString());
        const collections = Object.keys(backup).filter(k => k !== 'metadata');

        for (const col of collections) {
            if (backup[col].length > 0) {
                const converted = convertIds(backup[col]);
                await mongoose.connection.db.collection(col).deleteMany({});
                await mongoose.connection.db.collection(col).insertMany(converted);
            }
        }

        logger.info(`Backup uploaded and restored by ${req.user.email}`);
        res.json({ success: true, message: 'Backup uploaded and restored successfully', collections: collections.length });
    } catch (error) {
        logger.error(`Upload restore failed: ${error.message}`);
        next(error);
    }
};

const sendBackupEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const filepath = path.join(BACKUP_DIR, req.params.filename);
        if (!fs.existsSync(filepath)) return res.status(404).json({ success: false, message: 'Backup not found' });

        const backupContent = fs.readFileSync(filepath, 'utf-8');
        const stats = fs.statSync(filepath);

        await sendEmail({
            to: email,
            subject: `Backup: ${req.params.filename}`,
            htmlBody: `<h2>Digital Concierge Backup</h2><p><strong>File:</strong> ${req.params.filename}</p><p><strong>Size:</strong> ${(stats.size / 1024).toFixed(2)} KB</p><p><strong>Date:</strong> ${stats.birthtime}</p><pre style="max-height:400px;overflow:auto;background:#f5f5f5;padding:16px;border-radius:8px;font-size:12px;">${backupContent}</pre>`,
            textBody: `Backup: ${req.params.filename}\nSize: ${(stats.size / 1024).toFixed(2)} KB\n\n${backupContent}`,
        });

        res.json({ success: true, message: `Backup sent to ${email}` });
    } catch (error) { next(error); }
};

const deleteBackup = async (req, res, next) => {
    try {
        const filepath = path.join(BACKUP_DIR, req.params.filename);
        if (!fs.existsSync(filepath)) return res.status(404).json({ success: false, message: 'Backup not found' });
        fs.unlinkSync(filepath);
        logger.info(`Backup deleted: ${req.params.filename}`);
        res.json({ success: true, message: 'Backup deleted' });
    } catch (error) { next(error); }
};

const getBackupSettings = async (req, res, next) => {
    try {
        const PlatformSettings = require('../../models/admin/PlatformSettings');
        const keys = ['backup_auto_enabled', 'backup_frequency', 'backup_email_enabled', 'backup_email_address', 'backup_retention_days'];
        const settings = await PlatformSettings.find({ key: { $in: keys } });
        const result = {};
        settings.forEach(s => { result[s.key] = s.value; });
        res.json({ success: true, settings: result });
    } catch (error) { next(error); }
};

const updateBackupSettings = async (req, res, next) => {
    try {
        const PlatformSettings = require('../../models/admin/PlatformSettings');
        const updates = Object.entries(req.body).map(([key, value]) =>
            PlatformSettings.findOneAndUpdate({ key }, { value, updatedBy: req.user._id }, { new: true, upsert: true })
        );
        await Promise.all(updates);
        res.json({ success: true, message: 'Backup settings updated' });
    } catch (error) { next(error); }
};

module.exports = { createBackup, listBackups, downloadBackup, restoreBackup, uploadBackup, sendBackupEmail, deleteBackup, getBackupSettings, updateBackupSettings };