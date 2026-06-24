import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env.js'
import * as authService from '../services/auth.js';

export async function registerUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email?: string, password?: string };

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try {
        await authService.register(email, password);
        res.status(201).json({ message: 'Registered. Check your email to verify your account' });
    } catch (err) {
        if (err instanceof Error && err.message == 'Email already in use') {
            res.status(409).json({ error: err.message });
            return;
        }
        console.error('Register failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email?: string, password?: string };

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try {
        const user = await authService.login(email, password);
        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '24h' });
        res.status(200).json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
        if (err instanceof Error && err.message === 'Invalid credentials') {
            res.status(401).json({ error: err.message });
            return;
        }
        if (err instanceof Error && err.message === 'Email not verified') {
            res.status(403).json({ error: 'Please verify your email before logging in' });
            return;
        }
        console.error('Login failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
    const token = req.query.token as string | undefined;
    if (!token) {
        res.status(400).send('Missing verification token');
        return;
    }

    try {
        await authService.verifyEmailToken(token);
        res.status(200).send('<p>Email verified. You can now log in</p>');
    } catch (err) {
        if (err instanceof Error && err.message === 'Invalid or expired verification token') {
            res.status(400).send('<p>Verification failed. This email is invalid or expired</p>');
            return;
        }
        console.error('Verify failed:', err);
        res.status(500).send('Something went wrong');
    }
}