import express from 'express';

import authMiddleware from '../auth/middleware/authMiddleware.js';
import { checkEmergencyAction } from '../controllers/EmergencyActionController.js';

const router = express.Router();

router.get('/', authMiddleware, checkEmergencyAction);

export default router;
