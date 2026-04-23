import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center section-surface px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl"
        >
          <div className="text-8xl mb-6">🗺️</div>
          <h1 className="font-display font-bold text-display-sm text-on-surface mb-3">
            Page Not Found
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-8">
            Looks like you've wandered off the map. The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
            <Link to="/#globe-destinations" className="btn-secondary">
              Explore Destinations
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
