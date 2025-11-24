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
import ProfileCreatePage from "./pages/profile/create";
import ProfileEditPage from "./pages/profile/edit";
import DashboardPage from "./pages/dashboard";
import CompanySearchPage from "./pages/company-search";
import FollowupsPage from "./pages/followups";

import "./index.css";
import { Loader } from "./components/ui/loader";
import { ErrorBoundary } from "./components/ErrorBoundry";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ErrorPage from "./pages/error";
import NotFound from "./pages/not-found";
import GoogleAuth from "./pages/auth/google";

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
            <MainLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile/create" element={<ProtectedRoute><ProfileCreatePage /></ProtectedRoute>} />
                <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/company-search" element={<ProtectedRoute><CompanySearchPage /></ProtectedRoute>} />
                <Route path="/followups" element={<ProtectedRoute><FollowupsPage /></ProtectedRoute>} />
                <Route path="/outreach" element={<ProtectedRoute><OutreachWizard /></ProtectedRoute>} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/auth/google" element={<GoogleAuth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </OutreachProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
