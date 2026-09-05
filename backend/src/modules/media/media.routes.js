const express = require('express');
const mediaController = require('./media.controller');
const { uploadSingle } = require('../../common/middleware/upload.middleware');
const { protect } = require('../../common/middleware/auth.middleware');
const { restrictToAdmin } = require('../../common/middleware/admin.middleware');

const validate = require('../../common/middleware/validate.middleware');
const { deleteMediaSchema } = require('./media.validator');

const router = express.Router();

router.use(protect);
router.use(restrictToAdmin);

// General media routes
router.post('/upload', uploadSingle, mediaController.upload);
router.delete('/', validate(deleteMediaSchema), mediaController.deleteMedia);

module.exports = router;
