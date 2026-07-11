const router = require('express').Router();
const { createBackup, listBackups, downloadBackup, restoreBackup, uploadBackup, sendBackupEmail, deleteBackup, getBackupSettings, updateBackupSettings } = require('../../controllers/admin/backupController');
const adminAuth = require('../../middleware/admin/adminAuth');
const upload = require('../../middleware/global/upload');

router.use(adminAuth);

router.get('/settings', getBackupSettings);
router.put('/settings', updateBackupSettings);

router.post('/create', createBackup);
router.get('/', listBackups);
router.get('/download/:filename', downloadBackup);
router.post('/restore/:filename', restoreBackup);
router.post('/upload', upload.single('backup'), uploadBackup);
router.post('/send/:filename', sendBackupEmail);
router.delete('/:filename', deleteBackup);

module.exports = router;