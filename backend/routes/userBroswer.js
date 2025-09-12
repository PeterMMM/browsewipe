import express from 'express';

import authMiddleware from '../auth/middleware/authMiddleware.js';
import { broswersList, updateBroswerEmergencyAction } from '../controllers/UserBroswerController.js';

const router = express.Router();

router.get('/', authMiddleware, broswersList);
router.post('/:id/emergency', authMiddleware, updateBroswerEmergencyAction);

export default router;
