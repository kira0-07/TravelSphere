import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { RiFlightTakeoffLine } from 'react-icons/ri';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const navLinks = [
  { to: '/', hash: '#globe-destinations', label: 'Destinations' },
  { to: '/', hash: '#packages', label: 'Packages' },
  { to: '/', hash: '#hotels', label: 'Hotels' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll(); // Initialize correctly on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navBg = scrolled
    ? 'bg-surface-container-lowest/90 backdrop-blur-glass shadow-ambient'
    : 'bg-transparent';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-ambient transition-transform duration-200 group-hover:scale-105">
                <RiFlightTakeoffLine className="text-white text-lg" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight transition-colors duration-300 text-on-surface">
                TravelSphere
              </span>
            </Link>

            {/* Desktop Nav Links */}
            {!isAdmin && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map(({ to, hash, label }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={(e) => {
                      if (window.location.pathname === '/') {
                        e.preventDefault();
                        const element = document.querySelector(hash);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      } else {
                        // Let it navigate to root, then scroll (can be tricky without a timeout, but works for basic SPA)
                        setTimeout(() => {
                          const element = document.querySelector(hash);
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }}
                    className={`px-4 py-2 rounded-sm font-body font-medium text-sm transition-all duration-200 text-on-surface/80 hover:text-on-surface hover:bg-surface-container cursor-pointer`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle scrolled={scrolled} />

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    id="user-menu-btn"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm transition-all duration-200 hover:bg-surface-container"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium transition-colors duration-300 text-on-surface">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-surface-container-lowest rounded-lg shadow-ambient-lg py-1 z-50"
                      >
                        <div className="px-4 py-3 border-b border-outline-variant/20">
                          <p className="text-sm font-semibold text-on-surface">{user?.name}</p>
                          <p className="text-xs text-on-surface-variant">{user?.email}</p>
                        </div>
                        {isAdmin ? (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors">
                            <FiSettings className="text-secondary" /> Admin Dashboard
                          </Link>
                        ) : (
                          <>
                            <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors">
                              <FiUser className="text-primary" /> Dashboard
                            </Link>
                            <Link to="/my-trips" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors">
                              <FiPackage className="text-primary" /> My Trips
                            </Link>
                          </>
                        )}
                        <div className="border-t border-outline-variant/20 mt-1">
                          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors">
                            <FiLogOut /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200 text-on-surface hover:bg-surface-container">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary py-2 text-sm">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                id="mobile-menu-btn"
                className="md:hidden p-2 rounded-sm transition-colors text-on-surface hover:bg-surface-container"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-surface-container-lowest z-50 md:hidden shadow-ambient-xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
                <span className="font-display font-bold text-on-surface">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-on-surface-variant hover:text-on-surface">
                  <FiX size={22} />
                </button>
              </div>
              <nav className="px-4 pt-4 space-y-1">
                {!isAdmin && navLinks.map(({ to, hash, label }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={(e) => {
                      setMobileOpen(false);
                      if (window.location.pathname === '/') {
                        e.preventDefault();
                        const element = document.querySelector(hash);
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        setTimeout(() => {
                          const element = document.querySelector(hash);
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }}
                    className="block px-4 py-3 rounded-sm font-body font-medium text-sm transition-colors text-on-surface/80 hover:text-on-surface hover:bg-surface-container"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              {!isAuthenticated && (
                <div className="px-4 pt-6 space-y-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 rounded-sm text-sm font-medium text-on-surface border border-outline-variant/30 hover:bg-surface-container transition-colors">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center">
                    Sign Up Free
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
