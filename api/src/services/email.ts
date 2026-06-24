import sgMail from '@sendgrid/mail';
import config from '../config/env.js';

sgMail.setApiKey(config.sendgridApiKey);

export async function sendVerificationEmail(to: string, rawToken: string): Promise<void> {
    const link = `${config.appUrl}/api/auth/verify?token=${rawToken}`;

    await sgMail.send({
        to,
        from: config.sendgridFromEmail,
        subject: 'Verify your email',
        text: `Verify your account: ${link}`,
        html: `<p><a href="${link}">Verify</a></p>`
    })
}