import { Router } from 'express';
import { createPost, getFeed } from '../controllers/posts.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', getFeed);
router.post('/', authenticate, createPost);

export default router;