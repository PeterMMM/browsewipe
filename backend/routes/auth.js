import express from 'express';

import authMiddleware from '../auth/middleware/authMiddleware.js';
import { AppLogin, Login, Profile, Register, validateToken } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/login', Login);
router.post('/app-login', AppLogin);
router.post('/register', Register);
router.get('/profile', authMiddleware, Profile);
router.get('/validate-token', authMiddleware, validateToken)
export default router;
