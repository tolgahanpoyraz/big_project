import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { FeedProvider } from './features/feed/FeedContext';
import { Splash } from './components/Splash';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { CheckEmailPage } from './pages/auth/CheckEmailPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { EmailVerifiedPage } from './pages/auth/EmailVerifiedPage';
import type { ReactNode } from 'react';

function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'anon') return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Auth screens bounce to the app once you're signed in.
function GuestOnly({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'authed') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const { status } = useAuth();
  if (status === 'loading') return <Splash />;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <FeedProvider>
              <DashboardPage />
            </FeedProvider>
          </RequireAuth>
        }
      />

      <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
      <Route path="/verify-email" element={<GuestOnly><VerifyEmailPage /></GuestOnly>} />
      <Route path="/forgot-password" element={<GuestOnly><ForgotPasswordPage /></GuestOnly>} />
      <Route path="/check-email" element={<GuestOnly><CheckEmailPage /></GuestOnly>} />

      {/* Reachable from an email link regardless of session state. */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/email-verified" element={<EmailVerifiedPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
