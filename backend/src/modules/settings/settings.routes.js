const express = require('express');
const settingsController = require('./settings.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { restrictToAdmin } = require('../../common/middleware/admin.middleware');
const validate = require('../../common/middleware/validate.middleware');
const { updateSettingsSchema } = require('./settings.validator');

const router = express.Router();

// Public: view store settings
router.get('/', settingsController.getSettings);

// Protected: update store settings
router.patch('/', protect, restrictToAdmin, validate(updateSettingsSchema), settingsController.updateSettings);

module.exports = router;
