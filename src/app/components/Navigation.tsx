import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Home, Search, Compass, FileText, LogIn, UserPlus, Calendar, Heart,
  Settings, LayoutDashboard, List, Clock, Star, Bot, DollarSign,
  BarChart3, Flag, Folder, BookOpen, Users, Menu, X, LogOut, Wifi,
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

const navItems: Record<NavType, NavItem[]> = {
  public: [
    { label: 'Home', path: '/', icon: <Home size={20} />, exact: true },
    { label: 'Browse', path: '/browse', icon: <Compass size={20} /> },
    { label: 'How It Works', path: '/how-it-works', icon: <FileText size={20} /> },
    { label: 'WiFi Hubs', path: '/wifi-hubs', icon: <Wifi size={20} /> },
    { label: 'Log In', path: '/login', icon: <LogIn size={20} /> },
    { label: 'Sign Up', path: '/signup', icon: <UserPlus size={20} /> },
  ],
  customer: [
    { label: 'Home', path: '/customer', icon: <Home size={20} />, exact: true },
    { label: 'Search', path: '/customer/search', icon: <Search size={20} /> },
    { label: 'Bookings', path: '/customer/bookings', icon: <Calendar size={20} /> },
    { label: 'Favorites', path: '/customer/favorites', icon: <Heart size={20} /> },
    { label: 'WiFi Hubs', path: '/customer/wifi-hubs', icon: <Wifi size={20} /> },
    { label: 'Help', path: '/customer/help', icon: <BookOpen size={20} /> },
    { label: 'Settings', path: '/customer/settings', icon: <Settings size={20} /> },
  ],
  provider: [
    { label: 'Dashboard', path: '/provider', icon: <LayoutDashboard size={20} />, exact: true },
    { label: 'Listings', path: '/provider/listings', icon: <List size={20} /> },
    { label: 'Availability', path: '/provider/availability', icon: <Clock size={20} /> },
    { label: 'Bookings', path: '/provider/bookings', icon: <Calendar size={20} /> },
    { label: 'WiFi Hubs', path: '/provider/wifi-hubs', icon: <Wifi size={20} /> },
    { label: 'Reviews', path: '/provider/reviews', icon: <Star size={20} /> },
    { label: 'AI Coach', path: '/provider/ai-coach', icon: <Bot size={20} /> },
    { label: 'Payouts', path: '/provider/payouts', icon: <DollarSign size={20} /> },
    { label: 'Help', path: '/provider/help', icon: <BookOpen size={20} /> },
    { label: 'Settings', path: '/provider/settings', icon: <Settings size={20} /> },
  ],
  admin: [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
    { label: 'Providers', path: '/admin/providers', icon: <Users size={20} /> },
    { label: 'Listings', path: '/admin/listings', icon: <List size={20} /> },
    { label: 'Disputes', path: '/admin/disputes', icon: <Flag size={20} /> },
    { label: 'Featured', path: '/admin/featured', icon: <Star size={20} /> },
    { label: 'Categories', path: '/admin/categories', icon: <Folder size={20} /> },
    { label: 'Resources', path: '/admin/resources', icon: <BookOpen size={20} /> },
    { label: 'WiFi Hubs', path: '/admin/wifi-hubs', icon: <Wifi size={20} /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ],
};

function NavLinks({ type, onNav }: { type: NavType; onNav?: () => void }) {
  const location = useLocation();
  const items = navItems[type];

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={onNav}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface SidebarProps {
  type: NavType;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ type, mobileOpen = false, onMobileClose }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const closeMobile = () => onMobileClose?.();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <NavLinks type={type} onNav={closeMobile} />
      </div>
      {type !== 'public' && (
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded text-sm font-medium text-muted hover:bg-secondary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut size={18} />
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
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-[min(18rem,85vw)] bg-background border-r border-border shadow-xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ top: 0 }}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-sm font-medium text-muted">Menu</span>
          <button
            onClick={closeMobile}
            aria-label="Close navigation menu"
            className="p-2.5 rounded-lg hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X size={20} />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex w-64 flex-col shrink-0 bg-background border-r border-border self-stretch"
        aria-label="Sidebar navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export function TopBar({ title, actions }: { title?: string; actions?: React.ReactNode }) {
  return (
    <header className="h-16 bg-background border-b border-border px-4 sm:px-6 flex items-center justify-between">
      {title && <h1 className="text-xl font-semibold text-foreground">{title}</h1>}
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </header>
  );
}
