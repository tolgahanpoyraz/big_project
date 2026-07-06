import { Logo } from '../../components/Logo';
import { Icon } from '../../components/Icon';
import { AvatarMenu } from './AvatarMenu';
import type { User } from '../../api/types';

interface TopBarProps {
  user: User;
  onPost: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onHome: () => void;
}

export function TopBar({ user, onPost, onOpenSettings, onLogout, onHome }: TopBarProps) {
  return (
    <header className="topbar">
      <Logo onClick={onHome} />
      <div className="spacer" />
      <button className="btn btn-post" onClick={onPost}>
        <Icon name="plus" size={18} stroke="#fff" strokeWidth={2.6} />
        Post
      </button>
      <AvatarMenu user={user} onOpenSettings={onOpenSettings} onLogout={onLogout} />
    </header>
  );
}
