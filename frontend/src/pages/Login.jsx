import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { RiFlightTakeoffLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      const loggedInUser = await login({ email, password });
      toast.success('Welcome back! 🎉');
      if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel — Hero Photo */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img src={HERO_IMAGE} alt="Mountain at golden hour" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-inverse-surface/80" />

        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-sm bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <RiFlightTakeoffLine className="text-white text-lg" />
          </div>
          <span className="font-display font-bold text-white text-lg">TravelSphere</span>
        </div>

        {/* Quote */}
        <div className="absolute bottom-12 left-10 right-10">
          <blockquote className="font-display font-semibold text-2xl text-white leading-snug mb-3">
            "Adventure awaits — your next journey begins here."
          </blockquote>
          <p className="text-white/60 text-sm">— TravelSphere</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center px-6 py-12 bg-surface">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <RiFlightTakeoffLine className="text-white text-lg" />
            </div>
            <span className="font-display font-bold text-on-surface text-lg">TravelSphere</span>
          </div>

          <h1 className="font-display font-bold text-display-sm text-on-surface mb-2">Welcome back</h1>
          <p className="text-body-md text-on-surface-variant mb-8">Sign in to access your bookings and travel plans.</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-label-md text-on-surface-variant mb-1.5 uppercase">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-label-md text-on-surface-variant uppercase">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-outline-variant/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-3 text-xs text-on-surface-variant">or continue with</span>
            </div>
          </div>

          {/* Google OAuth (stubbed) */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-sm bg-surface-container-lowest border border-outline-variant/30 text-on-surface font-medium text-sm hover:bg-surface-container transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-on-surface-variant mt-7">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign up free</Link>
          </p>

          {/* Back Home */}
          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors">
              <FiArrowLeft size={12} /> Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
