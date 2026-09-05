const express = require('express');
const aiController = require('./ai.controller');
const { protect } = require('../../common/middleware/auth.middleware');
const { restrictToAdmin } = require('../../common/middleware/admin.middleware');
const { aiLimiter } = require('../../common/middleware/rateLimiter.middleware');

const validate = require('../../common/middleware/validate.middleware');
const { processImageSchema, generateContentSchema, jobIdSchema } = require('./ai.validator');

const router = express.Router();

router.use(protect);
router.use(restrictToAdmin);
router.use(aiLimiter);

router.post('/image-process', validate(processImageSchema), aiController.processImage);
router.post('/content-generate', validate(generateContentSchema), aiController.generateContent);

router.get('/jobs/:id', validate(jobIdSchema, 'params'), aiController.getJobStatus);
router.post('/jobs/:id/retry', validate(jobIdSchema, 'params'), aiController.retryJob);
router.post('/jobs/:id/apply', validate(jobIdSchema, 'params'), aiController.applyContent);

module.exports = router;
