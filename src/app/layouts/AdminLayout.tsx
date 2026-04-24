import { useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import { AppNavbar } from '../components/AppNavbar';
import { Sidebar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import { FullPageLoader } from '../components/LoadingSpinner';

export default function AdminLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return <FullPageLoader label="Accessing Admin Dashboard..." />;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to={`/${user.role}`} replace />;

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <AppNavbar onMenuClick={() => setMobileOpen(true)} showMenuButton />
      <div className="flex flex-1 min-h-0">
        <Sidebar type="admin" mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <main className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
