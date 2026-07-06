import { useLocation, useNavigate } from 'react-router-dom';
import { BrandPanel } from './BrandPanel';
import { Icon } from '../../components/Icon';
import { openMailbox } from '../../lib/mailbox';
import { useToast } from '../../components/Toast';
import { resendVerification } from '../../api/auth';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const email = (useLocation().state as { email?: string } | null)?.email;

  async function onResend() {
    if (!email) {
      navigate('/register');
      return;
    }
    try {
      await resendVerification(email);
      toast.success('Verification link sent again.');
    } catch {
      toast.error('Could not resend right now.');
    }
  }

  return (
    <div className="auth-screen">
      <BrandPanel
        variant="coral"
        showLogo
        showFoot
        align="between"
        headline={
          <>
            One quick step
            <br />
            and you're in.
          </>
        }
        body="We verify every .edu so the map stays students-only."
      />
      <div className="auth-form-side">
        <div className="auth-form auth-center">
          <div className="auth-hero-check">
            <Icon name="mailCheck" size={42} strokeWidth={1.8} />
          </div>
          <h1 className="auth-h" style={{ marginTop: 22 }}>
            Verify your email
          </h1>
          <p className="auth-sub">
            We sent a verification link to
            <br />
            <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{email || 'your school email'}</strong>. Click
            it to activate your account — you'll need to verify before you can log in.
          </p>
          <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 26 }} onClick={() => openMailbox(email || '')}>
            Open email app
          </button>
          <div style={{ marginTop: 20, fontSize: 13.5, color: 'var(--text-2)', fontWeight: 500 }}>
            Didn't get it?{' '}
            <button type="button" className="link" onClick={onResend}>
              Resend verification link
            </button>
          </div>
          <div className="auth-alt">
            <button type="button" className="link" onClick={() => navigate('/login')}>
              Back to log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
