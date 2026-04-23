import { NavLink } from 'react-router-dom';
import { FiPackage, FiMapPin, FiHome, FiCheckSquare, FiGrid, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar() {
  const { logout } = useAuth();

  const navItems = [
    { icon: FiGrid, label: 'Dashboard', path: '/admin' },
    { icon: FiPackage, label: 'Packages', path: '/admin/packages' },
    { icon: FiMapPin, label: 'Destinations', path: '/admin/destinations' },
    { icon: FiHome, label: 'Hotels', path: '/admin/hotels' },
    { icon: FiCheckSquare, label: 'Bookings', path: '/admin/bookings' },
  ];

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col h-[calc(100vh-64px)] sticky top-16">
      <div className="p-6">
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">Management</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-outline-variant/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-all"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
