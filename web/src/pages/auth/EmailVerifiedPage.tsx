import { useNavigate, useSearchParams } from 'react-router-dom';
import { BrandPanel } from './BrandPanel';
import { Icon } from '../../components/Icon';

// The page the verification link can land on (desktop or phone browser). The API
// currently renders its own confirmation HTML; this route matches the design and
// is ready for the API to redirect here (?name= optional for the greeting).
export function EmailVerifiedPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const name = params.get('name');

  return (
    <div className="auth-screen">
      <BrandPanel
        variant="green"
        showLogo
        showFoot
        align="between"
        headline={name ? `You're in, ${name}.` : "You're all set."}
        body="Your @ucf.edu is verified — that's how we keep the map students-only."
      />
      <div className="auth-form-side">
        <div className="auth-form auth-center">
          <div className="auth-hero-check lg">
            <Icon name="badgeCheck" size={46} strokeWidth={1.9} />
          </div>
          <h1 className="auth-h" style={{ marginTop: 22 }}>
            Email verified
          </h1>
          <p className="auth-sub">Your account's all set. Jump in and see what's fresh near you.</p>
          <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 26 }} onClick={() => navigate('/login')}>
            Log in to Crumb
          </button>
        </div>
      </div>
    </div>
  );
}
