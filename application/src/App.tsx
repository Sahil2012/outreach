import React from "react";
import { OutreachProvider, useOutreach } from "./context/OutreachContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import TemplateSelectionPage from "./pages/outreach/template-selection";
import RecipientInfoPage from "./pages/outreach/recipient-info";
import EmailPreviewPage from "./pages/outreach/email-preview";
import SendEmailPage from "./pages/outreach/send-email";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";
import DashboardPage from "./pages/dashboard";
import CompanySearchPage from "./pages/company-search";
import FollowupsPage from "./pages/followups";

import "./index.css";
import { Loader } from "./components/ui/loader";
import { ErrorBoundary } from "./components/ErrorBoundry";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ErrorPage from "./pages/error";
import NotFound from "./pages/not-found";


const OutreachWizard: React.FC = () => {
  const { step, isLoading } = useOutreach();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <TemplateSelectionPage />;
      case 2:
        return <RecipientInfoPage />;
      case 3:
        return <EmailPreviewPage />;
      case 4:
        return <SendEmailPage />;
      default:
        return <TemplateSelectionPage />;
    }
  };

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <Loader size="lg" text="Generating Email..." className="h-64" />
      ) : (
        renderStep()
      )}
    </div>
  );
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

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

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <OutreachProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

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
