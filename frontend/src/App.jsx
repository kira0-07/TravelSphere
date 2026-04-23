import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import DestinationDetail from './pages/DestinationDetail';
import PackageDetail from './pages/PackageDetail';
import HotelDetail from './pages/HotelDetail';
import MyTrips from './pages/MyTrips';

// Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';
import AdminLayout from './components/AdminLayout';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManagePackages from './pages/ManagePackages';
import ManageDestinations from './pages/ManageDestinations';
import ManageHotels from './pages/ManageHotels';
import ManageBookings from './pages/ManageBookings';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/packages" element={<ManagePackages />} />
          <Route path="/admin/destinations" element={<ManageDestinations />} />
          <Route path="/admin/hotels" element={<ManageHotels />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#191c1e',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(25, 28, 30, 0.10)',
            border: '1px solid rgba(188, 201, 198, 0.3)',
          },
          success: {
            iconTheme: { primary: '#00685f', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#ba1a1a', secondary: '#ffffff' },
          },
        }}
      />
    </BrowserRouter>
  );
}
