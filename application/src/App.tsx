import React from "react";
import { OutreachProvider } from "./context/OutreachContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import OutreachWizard from "./pages/outreach";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";
import DashboardPage from "./pages/dashboard";
import CompanySearchPage from "./pages/company-search";
import FollowupsPage from "./pages/followups";

import OnboardingLayout from "./components/layout/OnboardingLayout";
import BasicInfoPage from "./pages/onboarding/basic-info";
import ProfessionalInfoPage from "./pages/onboarding/professional-info";

import "./index.css";
import { Loader } from "./components/ui/loader";
import { ErrorBoundary } from "./components/ErrorBoundry";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import ErrorPage from "./pages/error";
import NotFound from "./pages/not-found";
import SSOCallbackPage from "./pages/auth/sso-callback";




function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isOnboarded } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is NOT onboarded and NOT on an onboarding page, redirect to onboarding
  if (!isOnboarded && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding/basic-info" />;
  }

  // If user IS onboarded and tries to access onboarding, redirect to dashboard
  if (isOnboarded && location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isOnboarded } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (user) {
    if (isOnboarded) {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/onboarding/basic-info" />;
    }
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <OutreachProvider>
            <Routes>
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
              <Route path="/sso-callback" element={<PublicRoute><SSOCallbackPage /></PublicRoute>} />

              {/* Onboarding Routes */}
              <Route path="/onboarding/basic-info" element={<ProtectedRoute><OnboardingLayout><BasicInfoPage /></OnboardingLayout></ProtectedRoute>} />
              <Route path="/onboarding/professional-info" element={<ProtectedRoute><OnboardingLayout><ProfessionalInfoPage /></OnboardingLayout></ProtectedRoute>} />

              {/* Main App Routes */}
              <Route path="/" element={<MainLayout><Navigate to="/dashboard" replace /></MainLayout>} />
              <Route path="/profile" element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
              <Route path="/company-search" element={<ProtectedRoute><MainLayout><CompanySearchPage /></MainLayout></ProtectedRoute>} />
              <Route path="/followups" element={<ProtectedRoute><MainLayout><FollowupsPage /></MainLayout></ProtectedRoute>} />
              <Route path="/outreach" element={<ProtectedRoute><MainLayout><OutreachWizard /></MainLayout></ProtectedRoute>} />
              <Route path="/error" element={<MainLayout><ErrorPage /></MainLayout>} />
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </OutreachProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
