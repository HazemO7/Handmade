const express = require('express');
const mediaController = require('./media.controller');
const { uploadSingle } = require('../../common/middleware/upload.middleware');
const { protect } = require('../../common/middleware/auth.middleware');
const { restrictToAdmin } = require('../../common/middleware/admin.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictToAdmin);

// General media routes
router.post('/upload', uploadSingle, mediaController.upload);
router.delete('/', mediaController.deleteMedia);

module.exports = router;
