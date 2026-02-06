import { createBrowserRouter, Outlet } from "react-router";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import SSOCallbackPage from "@/pages/auth/sso-callback";
import { Loader } from "@/components/ui/loader";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { ReactNode } from "react";
import OnboardingLayout from "@/components/layout/OnboardingLayout";
import BasicInfoPage from "@/pages/onboarding/basic-info";
import ProfessionalInfoPage from "@/pages/onboarding/professional-info";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/pages/dashboard";
import OutreachWizard from "@/pages/outreach";
import OutreachDetailPage from "@/pages/outreach/detail";
import SelectTemplatePage from "@/pages/outreach/select-template";
import RecipientInfoPage from "@/pages/outreach/recipient-info";
import EmailPreviewPage from "@/pages/outreach/email-preview";
import SendEmailPage from "@/pages/outreach/send-email";
import DraftsPage from "@/pages/drafts";
import NotFound from "@/pages/not-found";
import { useLocation } from "react-router";
import SettingsPage from "./pages/settings";
import ProfilePage from "./pages/profile";
import GlobalError from "./components/function/global-error";
import { useProfile } from "@/hooks/profile/useProfileData";

function ProtectedRoute() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { data: profile, isLoading, error } = useProfile();
  const location = useLocation();

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
    return (
      <Navigate to="/login" state={{ appRedirectUrl: window.location.href }} />
    );
  }

  // If user is not onboarded then, redirect to onboarding pages
  if (
    profile.status === "INCOMPLETE" &&
    !location.pathname.startsWith("/onboarding")
  )
    return <Navigate to="/onboarding/basic-info" replace />;
  if (
    (profile.status === "PARTIAL" || profile.status === "PROCESSING") &&
    !location.pathname.startsWith("/onboarding")
  )
    return <Navigate to="/onboarding/professional-info" />;

  // If user is onboarded and tries to access onboarding, redirect to dashboard
  if (
    profile.status === "COMPLETE" &&
    location.pathname.startsWith("/onboarding")
  ) {
    return <Navigate to="/dashboard" />;
  }

  return <>{<Outlet />}</>;
}

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  if (!isUserLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const routes = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: GlobalError,
    children: [
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        ),
      },
      {
        path: "sso-callback",
        element: (
          <PublicRoute>
            <SSOCallbackPage />
          </PublicRoute>
        ),
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: "/onboarding",
            Component: OnboardingLayout,
            children: [
              {
                path: "basic-info",
                Component: BasicInfoPage,
              },
              {
                path: "professional-info",
                Component: ProfessionalInfoPage,
              },
            ],
          },
          {
            Component: MainLayout,
            children: [
              {
                index: true,
                element: <Navigate to="dashboard" replace />,
              },
              {
                path: "dashboard",
                Component: DashboardPage,
              },
              {
                path: "drafts",
                Component: DraftsPage,
              },
              {
                path: "settings",
                Component: SettingsPage,
              },
              {
                path: "profile",
                Component: ProfilePage,
              },
              {
                path: "outreach",
                children: [
                  {
                    path: "view/:id",
                    Component: OutreachDetailPage,
                  },
                  {
                    Component: OutreachWizard,
                    children: [
                      {
                        index: true,
                        element: <Navigate to="templates" replace />,
                      },
                      {
                        path: "templates",
                        element: <SelectTemplatePage />,
                      },
                      {
                        path: "recipient-info",
                        element: <RecipientInfoPage />,
                      },
                      {
                        path: "preview/:id",
                        element: <EmailPreviewPage />,
                      },
                      {
                        path: "send/:id",
                        element: <SendEmailPage />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);

export default routes;
