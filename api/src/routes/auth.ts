import { Router } from 'express';
import { registerUser, loginUser, verifyEmail, getMe, resendVerification, forgotPassword, resetPassword, changePassword } from '../controllers/auth.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/verify', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticate, changePassword);
router.get('/me', authenticate, getMe);

export default router;