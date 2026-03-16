import { Outlet } from 'react-router';
import { Sidebar } from '../components/Navigation';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar type="public" />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
