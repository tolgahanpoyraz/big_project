import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Modal } from '../../components/Modal';
import { Icon } from '../../components/Icon';
import { Avatar } from '../../components/Avatar';
import { Field, PasswordInput } from '../../components/Field';
import { PasswordStrength } from '../../components/PasswordStrength';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../components/Toast';
import { changePassword, uploadAvatar } from '../../api/auth';
import { toJpegBlob } from '../../lib/imageConvert';
import { bumpAvatarCache } from '../../lib/images';
import { ApiError } from '../../api/client';

type Tab = 'profile' | 'security';

interface SettingsModalProps {
  initialTab?: Tab;
  onClose: () => void;
}

export function SettingsModal({ initialTab = 'profile', onClose }: SettingsModalProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Modal onClose={onClose} className="settings-modal" labelledBy="settings-title">
      <nav className="settings-nav">
        <div className="t" id="settings-title">
          Settings
        </div>
        <button className={`item ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
          <Icon name="user" size={17} strokeWidth={2} />
          Profile
        </button>
        <button className={`item ${tab === 'security' ? 'active' : ''}`} onClick={() => setTab('security')}>
          <Icon name="lock" size={17} strokeWidth={2} />
          Security
        </button>
      </nav>
      <div className="settings-panel cw-scroll">
        {tab === 'profile' ? <ProfileTab onClose={onClose} /> : <SecurityTab onClose={onClose} />}
      </div>
    </Modal>
  );
}

function PanelHeader({ title, sub, onClose }: { title: string; sub: string; onClose: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div className="modal-title">{title}</div>
        <div className="modal-sub">{sub}</div>
      </div>
      <button className="icon-btn" onClick={onClose} aria-label="Close">
        <Icon name="x" size={16} strokeWidth={2.3} />
      </button>
    </div>
  );
}

function ProfileTab({ onClose }: { onClose: () => void }) {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  }

  async function onSave() {
    if (busy) return;
    if (!file) {
      onClose();
      return;
    }
    setBusy(true);
    try {
      const blob = await toJpegBlob(file, 512, 0.9);
      const { user: updated } = await uploadAvatar(blob);
      bumpAvatarCache();
      updateUser(updated);
      toast.success('Profile photo updated.');
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) {
        toast.error('Photo uploads aren’t set up on the server yet.');
      } else {
        toast.error(err instanceof Error ? err.message : 'Could not save your photo.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PanelHeader title="Profile" sub="This is how you show up around campus." onClose={onClose} />

      <div className="settings-avatar-row">
        <div className="avatar-ring" style={{ background: 'var(--border)' }}>
          <div className="inner" style={{ background: 'var(--panel-bg)' }}>
            {preview ? (
              <img className="avatar" src={preview} alt="" width={72} height={72} style={{ width: 72, height: 72 }} />
            ) : (
              <Avatar name={user!.displayName} avatarKey={user!.avatarKey} size={72} />
            )}
          </div>
        </div>
        <div>
          <button className="btn btn-secondary" style={{ height: 40, padding: '0 16px', fontSize: 13.5 }} onClick={() => fileRef.current?.click()}>
            Change photo
          </button>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500, marginTop: 7 }}>JPG or PNG, up to 5 MB.</div>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPick} style={{ display: 'none' }} />
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div className="field-label">Display name</div>
        {/* The API has no profile-update endpoint, so the name is read-only here. */}
        <Field disabled>
          <input type="text" value={user!.displayName} readOnly />
        </Field>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="field-label">School email</div>
        <Field icon="mail" disabled trailing={<span className="badge-verified">Verified</span>}>
          <span className="field-static">{user!.email}</span>
        </Field>
      </div>

      <div className="modal-actions">
        <button className="btn btn-secondary btn-sm" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary btn-sm" onClick={onSave} disabled={busy}>
          {busy ? <span className="spinner" /> : 'Save changes'}
        </button>
      </div>
    </>
  );
}

function SecurityTab({ onClose }: { onClose: () => void }) {
  const { setSessionToken } = useAuth();
  const toast = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (next.length < 8) return setError('New password must be at least 8 characters.');
    if (next !== confirm) return setError('New passwords do not match.');

    setBusy(true);
    try {
      const { token } = await changePassword(current, next);
      // A password change invalidates other tokens; keep this session on the new one.
      setSessionToken(token);
      toast.success('Password updated.');
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Current password is incorrect.');
      } else {
        setError(err instanceof Error ? err.message : 'Could not update password.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <PanelHeader title="Change password" sub="Pick something you don't use elsewhere." onClose={onClose} />

      <div className="field-label" style={{ marginTop: 24 }}>
        Current password
      </div>
      <PasswordInput
        small
        autoComplete="current-password"
        placeholder="Enter current password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        required
      />

      <div className="field-label" style={{ marginTop: 16 }}>
        New password
      </div>
      <Field icon="lock" small>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Create a new password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
        />
      </Field>
      <PasswordStrength password={next} />

      <div className="field-label" style={{ marginTop: 16 }}>
        Confirm new password
      </div>
      <Field icon="lock" small>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </Field>

      {error && (
        <div className="form-error">
          <Icon name="info" size={16} strokeWidth={2} />
          {error}
        </div>
      )}

      <div style={{ flex: 1 }} />
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>
          {busy ? <span className="spinner" /> : 'Update password'}
        </button>
      </div>
    </form>
  );
}
