import { Link } from 'react-router';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';

interface AppNavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const roleConfig = {
  customer: { label: 'Customer', bg: 'bg-surface-amber', text: 'text-amber-700' },
  provider: { label: 'Provider', bg: 'bg-surface-violet', text: 'text-violet-700' },
  admin: { label: 'Admin', bg: 'bg-surface-coral', text: 'text-coral' },
  public: { label: 'Guest', bg: 'bg-surface-teal', text: 'text-primary' },
} as const;

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const avatarColors = [
  'bg-primary text-primary-foreground',
  'bg-violet text-white',
  'bg-coral text-white',
  'bg-amber text-white',
  'bg-rose text-white',
];

function pickAvatarColor(name: string): string {
  const code = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return avatarColors[code % avatarColors.length];
}

export function AppNavbar({ onMenuClick, showMenuButton }: AppNavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const homeLink = `/${user.role}`;
  const role = roleConfig[user.role as keyof typeof roleConfig] ?? roleConfig.customer;
  const initials = getInitials(user.name || 'U');
  const avatarColor = pickAvatarColor(user.name || 'User');

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    if (dropOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [dropOpen]);

  async function handleLogout() {
    setDropOpen(false);
    await logout();
    navigate('/login');
  }

  return (
    <header className="h-14 lg:h-16 bg-background border-b border-border/60 flex items-center justify-between shrink-0">
      {/* Left: logo area — same width as sidebar */}
      <div className="flex items-center gap-3 min-w-0 pl-4 pr-4 md:pl-6 md:pr-6 lg:w-64 lg:shrink-0 lg:pl-4 lg:pr-0">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="lg:hidden w-11 h-11 flex items-center justify-center -ml-2 rounded-xl hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu size={22} />
          </button>
        )}
        <Link
          to={homeLink}
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl py-1 group"
        >
          <img
            src="/atn_logo_no_bg.png"
            alt=""
            className="w-8 h-8 lg:w-9 lg:h-9 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
            aria-hidden
          />
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-base font-bold tracking-tight text-foreground leading-tight block">
              ATN
            </span>
            <span className="text-[9px] text-muted leading-tight hidden sm:block tracking-wide">
              Access Terrain Network
            </span>
          </div>
        </Link>
      </div>

      {/* Right: user info + actions */}
      <div className="relative flex items-center gap-2 shrink-0 pr-4 md:pr-6 lg:pr-[72px]" ref={dropRef}>
        {/* User dropdown trigger */}
        <button
          onClick={() => setDropOpen(!dropOpen)}
          className="flex items-center gap-2 h-11 px-2 rounded-xl hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={dropOpen}
          aria-haspopup="true"
        >
          {/* Avatar */}
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor}`}>
            {initials}
          </span>
          {/* Name */}
          <span
            className="hidden sm:block text-sm font-medium text-foreground truncate max-w-[9rem]"
            title={user.name}
          >
            {user.name}
          </span>
          <ChevronDown
            size={14}
            className={`hidden sm:block text-muted transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {dropOpen && (
          <div className="absolute top-[calc(100%+8px)] right-0 w-[calc(100vw-32px)] sm:w-56 max-w-sm bg-background border border-border rounded-2xl shadow-lg py-1.5 z-50 animate-scale-in">
            {/* User info header */}
            <div className="px-4 py-3 border-b border-border/60">
              <p className="text-base sm:text-sm font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-sm sm:text-xs text-muted truncate mt-0.5">{user.email}</p>
            </div>
            {/* Actions */}
            <div className="py-1">
              <Link
                to={`/${user.role}/settings`}
                onClick={() => setDropOpen(false)}
                className="flex items-center gap-2.5 px-4 h-11 sm:h-10 text-base sm:text-sm text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 h-11 sm:h-10 text-base sm:text-sm text-coral hover:bg-surface-coral transition-colors"
              >
                <LogOut size={18} className="sm:w-[15px] sm:h-[15px]" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
