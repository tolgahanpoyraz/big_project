import { Router } from 'express';
import { registerUser, loginUser, verifyEmail } from '../controllers/auth.js';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/verify', verifyEmail);

export default router;