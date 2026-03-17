import { Outlet, Navigate } from 'react-router';
import { Sidebar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

export default function CustomerLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role !== 'customer') return <Navigate to={`/${user.role}`} replace />;

  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar type="customer" />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-[env(safe-area-inset-bottom)]">
        <Outlet />
      </main>
    </div>
  );
}
