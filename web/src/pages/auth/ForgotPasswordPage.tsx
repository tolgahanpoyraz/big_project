import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandPanel } from './BrandPanel';
import { Field } from '../../components/Field';
import { Icon } from '../../components/Icon';
import { forgotPassword } from '../../api/auth';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      // Always 200 — the API won't leak whether the address exists.
      await forgotPassword(email.trim());
    } finally {
      navigate('/check-email', { state: { email: email.trim() } });
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
            Happens to
            <br />
            everyone.
          </>
        }
        body="We'll send a link to reset it. You'll be back to snagging food in a minute."
      />
      <div className="auth-form-side">
        <form className="auth-form" onSubmit={onSubmit}>
          <button type="button" className="auth-back" onClick={() => navigate('/login')}>
            <Icon name="chevronLeft" size={15} strokeWidth={2.4} />
            Back to log in
          </button>
          <h1 className="auth-h">Reset your password</h1>
          <p className="auth-sub">Enter your school email and we'll send you a reset link.</p>

          <div className="field-label" style={{ marginTop: 26 }}>
            School email
          </div>
          <Field icon="mail">
            <input
              type="email"
              autoComplete="email"
              placeholder="you@ucf.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 22 }} disabled={busy}>
            {busy ? <span className="spinner" /> : 'Send reset link'}
          </button>

          <div className="auth-alt">
            Remembered it?{' '}
            <button type="button" className="link" onClick={() => navigate('/login')}>
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
