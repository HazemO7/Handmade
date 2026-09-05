const express = require('express');
const settingsController = require('./settings.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { restrictToAdmin } = require('../../common/middleware/admin.middleware');

const router = express.Router();

// Public: view store settings
router.get('/', settingsController.getSettings);

// Protected: update store settings
router.patch('/', protect, restrictToAdmin, settingsController.updateSettings);

module.exports = router;
