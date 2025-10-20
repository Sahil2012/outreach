import React from 'react';
import { OutreachProvider, useOutreach } from './context/OutreachContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import RecipientInfoPage from './pages/RecipientInfoPage';
import EmailPreviewPage from './pages/EmailPreviewPage';
import SendEmailPage from './pages/SendEmailPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileCreatePage from './pages/ProfileCreatePage';
import ProfileEditPage from './pages/ProfileEditPage';
import DashboardPage from './pages/DashboardPage';
import CompanySearchPage from './pages/CompanySearchPage';
import FollowupsPage from './pages/FollowupsPage';

import './index.css';
import { Loader } from './components/ui/loader';
import { ErrorBoundary } from './components/ErrorBoundry';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';

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
      {isLoading ? <Loader size="lg" text="Generating Email..." className='h-64'/> : renderStep()}
    </div>
  );
};

function OutreachFlow() {
  return (
    <OutreachProvider>
      <MainLayout>
        <OutreachWizard />
      </MainLayout>
    </OutreachProvider>
  );
}

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
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<HomePage />}/>
              <Route path='/login' element={<LoginPage />} />
              <Route path='/signup' element={<SignupPage />} />
              <Route path='/profile/create' element={<ProfileCreatePage />} />
              <Route path='/profile/edit' element={<ProfileEditPage />} />
              <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path='/company-search' element={<ProtectedRoute><CompanySearchPage /></ProtectedRoute>} />
              <Route path='/followups' element={<FollowupsPage />} />
              <Route path='/outreach' element={<OutreachFlow />}/>
              <Route path='/error' element={<ErrorPage />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;