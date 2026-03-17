import { Outlet, Navigate } from 'react-router';
import { Sidebar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

export default function ProviderLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

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
    <div className="flex min-h-screen bg-secondary">
      <Sidebar type="provider" />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-[env(safe-area-inset-bottom)]">
        <Outlet />
      </main>
    </div>
  );
}
