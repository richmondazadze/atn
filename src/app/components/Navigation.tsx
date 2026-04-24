import { Link, useLocation } from 'react-router';
import {
  Home, Search, Compass, FileText, LogIn, UserPlus, Calendar, Heart,
  Settings, LayoutDashboard, List, Clock, Star, Bot, DollarSign,
  BarChart3, Flag, Folder, BookOpen, Users, X, LogOut, Wifi,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

type NavType = 'public' | 'customer' | 'provider' | 'admin';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  exact?: boolean;
}

interface NavSection {
  group?: string;
  items: NavItem[];
}

const navSections: Record<NavType, NavSection[]> = {
  public: [
    {
      items: [
        { label: 'Home', path: '/', icon: <Home size={18} />, exact: true },
        { label: 'Browse', path: '/browse', icon: <Compass size={18} /> },
        { label: 'How It Works', path: '/how-it-works', icon: <FileText size={18} /> },
        { label: 'WiFi Hubs', path: '/wifi-hubs', icon: <Wifi size={18} /> },
        { label: 'Log In', path: '/login', icon: <LogIn size={18} /> },
        { label: 'Sign Up', path: '/signup', icon: <UserPlus size={18} /> },
      ],
    },
  ],
  customer: [
    {
      items: [
        { label: 'Home', path: '/customer', icon: <Home size={18} />, exact: true },
        { label: 'Search', path: '/customer/search', icon: <Search size={18} /> },
      ],
    },
    {
      group: 'Activity',
      items: [
        { label: 'Bookings', path: '/customer/bookings', icon: <Calendar size={18} /> },
        { label: 'Favorites', path: '/customer/favorites', icon: <Heart size={18} /> },
        { label: 'WiFi Hubs', path: '/customer/wifi-hubs', icon: <Wifi size={18} /> },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Help', path: '/customer/help', icon: <BookOpen size={18} /> },
        { label: 'Settings', path: '/customer/settings', icon: <Settings size={18} /> },
      ],
    },
  ],
  provider: [
    {
      items: [
        { label: 'Dashboard', path: '/provider', icon: <LayoutDashboard size={18} />, exact: true },
      ],
    },
    {
      group: 'Manage',
      items: [
        { label: 'Listings', path: '/provider/listings', icon: <List size={18} /> },
        { label: 'Availability', path: '/provider/availability', icon: <Clock size={18} /> },
        { label: 'Bookings', path: '/provider/bookings', icon: <Calendar size={18} /> },
        { label: 'WiFi Hubs', path: '/provider/wifi-hubs', icon: <Wifi size={18} /> },
      ],
    },
    {
      group: 'Grow',
      items: [
        { label: 'Reviews', path: '/provider/reviews', icon: <Star size={18} /> },
        { label: 'AI Coach', path: '/provider/ai-coach', icon: <Bot size={18} /> },
        { label: 'Payouts', path: '/provider/payouts', icon: <DollarSign size={18} /> },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Help', path: '/provider/help', icon: <BookOpen size={18} /> },
        { label: 'Settings', path: '/provider/settings', icon: <Settings size={18} /> },
      ],
    },
  ],
  admin: [
    {
      items: [
        { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={18} />, exact: true },
      ],
    },
    {
      group: 'Manage',
      items: [
        { label: 'Providers', path: '/admin/providers', icon: <Users size={18} /> },
        { label: 'Listings', path: '/admin/listings', icon: <List size={18} /> },
        { label: 'Disputes', path: '/admin/disputes', icon: <Flag size={18} /> },
      ],
    },
    {
      group: 'Content',
      items: [
        { label: 'Featured', path: '/admin/featured', icon: <Star size={18} /> },
        { label: 'Categories', path: '/admin/categories', icon: <Folder size={18} /> },
        { label: 'Resources', path: '/admin/resources', icon: <BookOpen size={18} /> },
        { label: 'WiFi Hubs', path: '/admin/wifi-hubs', icon: <Wifi size={18} /> },
      ],
    },
    {
      group: 'Insights',
      items: [
        { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
        { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
      ],
    },
  ],
};

function NavLinks({ type, onNav }: { type: NavType; onNav?: () => void }) {
  const location = useLocation();
  const sections = navSections[type];

  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-5">
      {sections.map((section, si) => (
        <div key={si}>
          {section.group && (
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[1.2px] uppercase text-muted-foreground/60 select-none">
              {section.group}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onNav}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground/70 hover:bg-surface-teal hover:text-primary'
                    }`}
                  >
                    <span className={`shrink-0 transition-transform duration-150 ${isActive ? '' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

interface SidebarProps {
  type: NavType;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const roleMeta: Record<NavType, { label: string; color: string }> = {
  public: { label: 'Guest', color: 'bg-surface-teal text-primary' },
  customer: { label: 'Customer', color: 'bg-surface-amber text-amber-700' },
  provider: { label: 'Provider', color: 'bg-surface-violet text-violet-700' },
  admin: { label: 'Admin', color: 'bg-surface-coral text-coral' },
};

export function Sidebar({ type, mobileOpen = false, onMobileClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const closeMobile = () => onMobileClose?.();
  const meta = roleMeta[type];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Navigation section */}

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <NavLinks type={type} onNav={closeMobile} />
      </div>

      {type !== 'public' && (
        <div className="px-3 py-3 border-t border-border/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-surface-coral hover:text-coral transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-[min(18rem,85vw)] bg-background border-r border-border shadow-2xl transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/60">
          <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground/60">
            Navigation
          </span>
          <button
            onClick={closeMobile}
            aria-label="Close navigation menu"
            className="p-2 rounded-lg hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X size={18} />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-64 flex-col shrink-0 bg-background border-r border-border/60 self-stretch"
        aria-label="Sidebar navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export function TopBar({ title, actions }: { title?: string; actions?: React.ReactNode }) {
  return (
    <header className="h-16 bg-background border-b border-border/60 px-4 sm:px-6 flex items-center justify-between">
      {title && <h1 className="text-xl font-semibold text-foreground">{title}</h1>}
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </header>
  );
}
