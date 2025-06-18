import React from 'react';
import { OutreachProvider, useOutreach } from './context/OutreachContext';
import MainLayout from './components/layout/MainLayout';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import RecipientInfoPage from './pages/RecipientInfoPage';
import EmailPreviewPage from './pages/EmailPreviewPage';
import SendEmailPage from './pages/SendEmailPage';

import './index.css';
import { Loader } from './components/ui/loader';
import { ErrorBoundary } from './components/ErrorBoundry';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function Index() {
  return (
    <OutreachProvider>
      <MainLayout>
        <OutreachWizard />
      </MainLayout>
    </OutreachProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Index />}/>
          <Route path='/error' element={<ErrorPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;