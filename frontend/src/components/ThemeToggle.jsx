import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle({ scrolled = true }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative p-2 rounded-sm transition-all duration-200 overflow-hidden
        ${scrolled || isDark
          ? 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? <FiMoon size={20} /> : <FiSun size={20} />}
      </motion.div>
    </button>
  );
}
