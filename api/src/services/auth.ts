import crypto from 'crypto';
import { User } from '../models/User.js';
import { sendVerificationEmail } from './email.js';

const VERIFICATION_TTL = 1000 * 60 * 60 * 24;   // 24 hours

function hashToken(raw: string): string {
    return crypto.createHash('sha256').update(raw).digest('hex')
}

export async function register(email: string, password: string) {
    const existing = await User.findOne({ email });
    if (existing) {
        throw new Error('Email already in use');
    }

    const user = await User.create({ email, password })

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = hashToken(rawToken);
    user.verificationTokenExpires = new Date(Date.now() + VERIFICATION_TTL);
    await user.save();

    await sendVerificationEmail(user.email, rawToken);
    return user;
}

export async function login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
        throw new Error('Invalid credentials');
    }

    if (!user.verified) {
        throw new Error('Email not verified');
    }

    return user;
}

export async function verifyEmailToken(rawToken: string) {
    const user = await User.findOne({
        verificationToken: hashToken(rawToken),
        verificationTokenExpires: { $gt: new Date() },
    });
    if (!user) throw new Error('Invalid or expired verification token');

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    return user;
}