import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { NotificationDrawer } from './components/NotificationDrawer';

import { HomePage } from './pages/HomePage';
import { StatesPage } from './pages/StatesPage';
import { CentersPage } from './pages/CentersPage';
import { MandiStatusPage } from './pages/MandiStatusPage';
import { LoginPage } from './pages/LoginPage';
import { FarmerRegisterPage } from './pages/FarmerRegisterPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { SlotBookingPage } from './pages/SlotBookingPage';
import { LiveQueuePage } from './pages/LiveQueuePage';
import { ProcurementTrackingPage } from './pages/ProcurementTrackingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MandiOfficerDashboardPage } from './pages/MandiOfficerDashboardPage';
import { DistrictAdminPage } from './pages/DistrictAdminPage';
import { StateAdminPage } from './pages/StateAdminPage';
import { SuperAdminPage } from './pages/SuperAdminPage';
import { HelpPage } from './pages/HelpPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-agri-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading KisanSetu...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans">
      <DemoBanner />
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Default Opening Route: LoginPage */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/states" element={<StatesPage />} />
          <Route path="/centers" element={<CentersPage />} />
          <Route path="/mandi-status" element={<MandiStatusPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Farmer Routes */}
          <Route path="/farmer/register" element={<FarmerRegisterPage />} />
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute>
                <FarmerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/book-slot"
            element={
              <ProtectedRoute>
                <SlotBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/queue"
            element={
              <ProtectedRoute>
                <LiveQueuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/procurement"
            element={
              <ProtectedRoute>
                <ProcurementTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Officer Dashboard */}
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute>
                <MandiOfficerDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* District Admin */}
          <Route
            path="/district-admin"
            element={
              <ProtectedRoute>
                <DistrictAdminPage />
              </ProtectedRoute>
            }
          />

          {/* State Admin */}
          <Route
            path="/state-admin"
            element={
              <ProtectedRoute>
                <StateAdminPage />
              </ProtectedRoute>
            }
          />

          {/* Super Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <SuperAdminPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <NotificationDrawer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
