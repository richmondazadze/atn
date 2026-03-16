import { Outlet, Navigate } from 'react-router';
import { Sidebar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';

export default function ProviderLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role !== 'provider') return <Navigate to={`/${user.role}`} replace />;

  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar type="provider" />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
