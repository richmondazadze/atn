import { useAuth, type UserRole } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const ROLES: { value: UserRole; label: string; path: string }[] = [
  { value: 'customer', label: 'Customer', path: '/customer' },
  { value: 'provider', label: 'Provider', path: '/provider' },
  { value: 'admin', label: 'Admin', path: '/admin' },
];

export function RoleSwitcher() {
  const { user, setRole } = useAuth();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as UserRole;
    setRole(next);
    const target = ROLES.find(r => r.value === next);
    if (target) navigate(target.path);
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs">
      <span className="font-medium text-amber-800 whitespace-nowrap">Demo mode:</span>
      <select
        value={user.role}
        onChange={handleChange}
        className="bg-transparent text-amber-900 font-medium outline-none cursor-pointer"
        aria-label="Switch demo role"
      >
        {ROLES.map(r => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
    </div>
  );
}
