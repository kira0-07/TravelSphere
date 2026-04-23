import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { RiFlightTakeoffLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=85';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created! Welcome to TravelSphere 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
        <img src={HERO_IMAGE} alt="Road trip adventure" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-inverse-surface/80" />
        <div className="absolute top-8 left-8 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-sm bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <RiFlightTakeoffLine className="text-white text-lg" />
          </div>
          <span className="font-display font-bold text-white text-lg">TravelSphere</span>
        </div>
        <div className="absolute bottom-12 left-10 right-10">
          <p className="font-display font-semibold text-2xl text-white leading-snug mb-3">
            "Join 10,000+ travelers discovering the world, one adventure at a time."
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center px-6 py-12 bg-surface overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <RiFlightTakeoffLine className="text-white text-lg" />
            </div>
            <span className="font-display font-bold text-on-surface text-lg">TravelSphere</span>
          </div>

          <h1 className="font-display font-bold text-display-sm text-on-surface mb-2">Create your account</h1>
          <p className="text-body-md text-on-surface-variant mb-8">Start planning your dream journeys today. Free forever.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label htmlFor="reg-name" className="block text-label-md text-on-surface-variant mb-1.5 uppercase">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                  <input id="reg-name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Alex Johnson" required className="input-field pl-10" />
                </div>
              </div>
              {/* Phone */}
              <div>
                <label htmlFor="reg-phone" className="block text-label-md text-on-surface-variant mb-1.5 uppercase">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                  <input id="reg-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" className="input-field pl-10" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-label-md text-on-surface-variant mb-1.5 uppercase">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className="input-field pl-10" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-label-md text-on-surface-variant mb-1.5 uppercase">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-label-md text-on-surface-variant mb-1.5 uppercase">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                <input id="reg-confirm" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required className="input-field pl-10" />
              </div>
            </div>

            <button id="register-submit-btn" type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>

          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors">
              <FiArrowLeft size={12} /> Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
