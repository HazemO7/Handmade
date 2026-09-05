const express = require('express');
const aiController = require('./ai.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { restrictToAdmin } = require('../../common/middleware/admin.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictToAdmin);

router.post('/image-process', aiController.processImage);
router.post('/content-generate', aiController.generateContent);

router.get('/jobs/:id', aiController.getJobStatus);
router.post('/jobs/:id/retry', aiController.retryJob);
router.post('/jobs/:id/apply', aiController.applyContent);

module.exports = router;
