import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import MainLayout from "@/components/layout/MainLayout";
import OutreachWizard from "@/pages/outreach";
import OutreachDetailPage from "@/pages/outreach/detail";
import TemplateSelectionPage from "@/pages/outreach/template-selection";
import RecipientInfoPage from "@/pages/outreach/recipient-info";
import EmailPreviewPage from "@/pages/outreach/email-preview";
import SendEmailPage from "@/pages/outreach/send-email";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";
import DashboardPage from "@/pages/dashboard";
import DraftsPage from "@/pages/drafts";
import BasicInfoPage from "@/pages/onboarding/basic-info";
import ProfessionalInfoPage from "@/pages/onboarding/professional-info";

import { Loader } from "@/components/ui/loader";
import { ErrorBoundary } from "@/components/ErrorBoundry";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import NotFound from "@/pages/not-found";
import SSOCallbackPage from "@/pages/auth/sso-callback";
import { Toaster } from "@/components/ui/sonner";
import "@/index.css";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import { useProfile } from "./hooks/useProfile";

function ProtectedRoute({ children }: { readonly children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { profile, isLoading, error } = useProfile();
  const location = useLocation();
  const [firstLoad, setFirstLoad] = useState(true);

  if (error) {
    const err = new Error("Failed to fetch profile. Please try again later");
    err.name = "Unable to reach servers";
    throw err;
  }

  const loading = !isUserLoaded || isLoading || !profile;

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

  const navigateToOnboarding = () => {
    if (profile.resumeUrl) {
      return <Navigate to="/professional-info" />;
    } else {
      return <Navigate to="/onboarding/basic-info" />;
    }
  };

  // If app is loaded for the first time, evaluate which onboarding step to show
  if (firstLoad) {
    setFirstLoad(false);
    navigateToOnboarding();
  }

  if ((profile.status === "INCOMPLETE" || profile.status === "PARTIAL") && (firstLoad || !location.pathname.startsWith("/onboarding"))) {
    return navigateToOnboarding();
  }

  // If user is onboarded and tries to access onboarding, redirect to dashboard
  if (profile.status === "COMPLETE" && location.pathname.startsWith("/onboarding")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { readonly children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { profile, isLoading, error } = useProfile();

  if (error) {
    const err = new Error("Failed to fetch profile. Please try again later");
    err.name = "Unable to reach servers";
    throw err;
  }

  const loading = !isUserLoaded || isLoading || !profile;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (user) {
    if (profile.status === "COMPLETE") {
      return <Navigate to="/dashboard" replace />;
    } else {
      if (profile.resumeUrl) {
        return <Navigate to="/onboarding/professional-info" replace />;
      }
      return <Navigate to="/onboarding/basic-info" replace />;
    }
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/sso-callback"
            element={
              <PublicRoute>
                <SSOCallbackPage />
              </PublicRoute>
            }
          />

          {/* Onboarding Routes */}
          <Route
            path="/onboarding/basic-info"
            element={
              <ProtectedRoute>
                <OnboardingLayout>
                  <BasicInfoPage />
                </OnboardingLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/professional-info"
            element={
              <ProtectedRoute>
                <OnboardingLayout>
                  <ProfessionalInfoPage />
                </OnboardingLayout>
              </ProtectedRoute>
            }
          />

          {/* Main App Routes */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Navigate to="/dashboard" replace />
              </MainLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SettingsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/drafts"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DraftsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/outreach/view/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <OutreachDetailPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/outreach"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <OutreachWizard />
                </MainLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="templates" replace />} />
            <Route path="templates" element={<TemplateSelectionPage />} />
            <Route path="recipient-info" element={<RecipientInfoPage />} />
            <Route path="preview/:id" element={<EmailPreviewPage />} />
            <Route path="send/:id" element={<SendEmailPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
