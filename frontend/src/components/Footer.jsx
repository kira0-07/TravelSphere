import { Link } from 'react-router-dom';
import { RiFlightTakeoffLine } from 'react-icons/ri';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMail } from 'react-icons/fi';

const quickLinks = [
  { to: '/#globe-destinations', label: 'Destinations' },
  { to: '/#packages', label: 'Tour Packages' },
  { to: '/#hotels', label: 'Hotels' },
  { to: '/#why-us', label: 'About Us' },
];

const supportLinks = [
  { to: '/faq', label: 'FAQs' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/booking-guide', label: 'Booking Guide' },
  { to: '/cancellation', label: 'Cancellation Policy' },
];

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

const socialLinks = [
  { icon: FiInstagram, href: '#', label: 'Instagram' },
  { icon: FiFacebook, href: '#', label: 'Facebook' },
  { icon: FiTwitter, href: '#', label: 'Twitter / X' },
  { icon: FiYoutube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="footer-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                <RiFlightTakeoffLine className="text-white text-lg" />
              </div>
              <span className="font-display font-bold text-lg text-white">TravelSphere</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Curating extraordinary journeys to the world's most breathtaking destinations. Your adventure begins here.
            </p>
            <div className="flex items-center gap-1 text-sm text-white/60">
              <FiMail size={14} />
              <span className="ml-1.5">hello@travelsphere.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-widest">Explore</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/60 hover:text-primary-fixed-dim transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-widest">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-white/60 hover:text-primary-fixed-dim transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Legal */}
          <div>
            <h3 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-widest">Follow Us</h3>
            <div className="flex gap-3 mb-8">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-sm bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <h3 className="font-display font-semibold text-white mb-3 text-sm uppercase tracking-widest">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-xs text-white/40 hover:text-white/60 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} TravelSphere. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Made with ♥ for adventurers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
