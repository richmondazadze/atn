import { useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import { AppNavbar } from '../components/AppNavbar';
import { Sidebar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

export default function ProviderLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role !== 'provider') return <Navigate to={`/${user.role}`} replace />;

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <AppNavbar onMenuClick={() => setMobileOpen(true)} showMenuButton />
      <div className="flex flex-1 min-h-0">
        <Sidebar type="provider" mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <main className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
