// Best-effort "Open email app": jump straight to a known webmail inbox when the
// provider is recognizable, otherwise hand off to the OS default mail client.
const WEBMAIL: Record<string, string> = {
  'gmail.com': 'https://mail.google.com/mail/u/0/',
  'googlemail.com': 'https://mail.google.com/mail/u/0/',
  'outlook.com': 'https://outlook.live.com/mail/',
  'hotmail.com': 'https://outlook.live.com/mail/',
  'live.com': 'https://outlook.live.com/mail/',
  'yahoo.com': 'https://mail.yahoo.com/',
  'icloud.com': 'https://www.icloud.com/mail/',
  'proton.me': 'https://mail.proton.me/',
  'protonmail.com': 'https://mail.proton.me/',
};

export function openMailbox(email: string) {
  const domain = email.split('@')[1]?.toLowerCase();
  const url = domain ? WEBMAIL[domain] : undefined;
  if (url) {
    window.open(url, '_blank', 'noopener');
  } else {
    window.location.href = 'mailto:';
  }
}
