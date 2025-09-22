import express from 'express';

import authMiddleware from '../auth/middleware/authMiddleware.js';
import { browsersList, updateBrowserEmergencyAction } from '../controllers/UserBrowserController.js';

const router = express.Router();

router.get('/', authMiddleware, browsersList);
router.post('/:id/emergency', authMiddleware, updateBrowserEmergencyAction);

export default router;
