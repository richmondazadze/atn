import { Link } from 'react-router';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

interface AppNavbarProps {
  onMenuClick?: () => void;
  /** Only for mobile - shows hamburger to open sidebar */
  showMenuButton?: boolean;
}

export function AppNavbar({ onMenuClick, showMenuButton }: AppNavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const homeLink = `/${user.role}`;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="h-14 lg:h-16 bg-background border-b border-border flex items-center justify-between shrink-0">
      {/* Left: same width as sidebar (w-64) with p-4 to align logo with sidebar content */}
      <div className="flex items-center gap-3 min-w-0 pl-4 pr-4 md:pl-6 md:pr-6 lg:w-64 lg:shrink-0 lg:pl-4 lg:pr-0">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="lg:hidden p-2.5 -ml-1 rounded-lg hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu size={22} />
          </button>
        )}
        <Link
          to={homeLink}
          className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg py-1"
        >
          <img
            src="/atn_logo_no_bg.png"
            alt=""
            className="w-9 h-9 lg:w-10 lg:h-10 object-contain flex-shrink-0"
            aria-hidden
          />
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-base lg:text-lg font-semibold tracking-tight text-foreground leading-tight block">
              ATN
            </span>
            <span className="text-[10px] lg:text-xs text-muted leading-tight hidden sm:block mt-0.5">
              Access Terrain Network
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 shrink-0 pl-4 pr-4 md:pl-6 md:pr-6 lg:pl-6 lg:pr-[72px]">
        <span
          className="hidden sm:block text-sm font-medium text-foreground truncate max-w-[10rem] lg:max-w-[12rem] px-2"
          title={user.name}
        >
          {user.name}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:bg-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Log out"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
