import React from 'react';
import { OutreachProvider, useOutreach } from './context/OutreachContext';
import MainLayout from './components/layout/MainLayout';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import RecipientInfoPage from './pages/RecipientInfoPage';
import EmailPreviewPage from './pages/EmailPreviewPage';
import SendEmailPage from './pages/SendEmailPage';

// Add global animations to index.css
import './index.css';

const OutreachWizard: React.FC = () => {
  const { step } = useOutreach();

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
      {renderStep()}
    </div>
  );
};

function App() {
  return (
    <OutreachProvider>
      <MainLayout>
        <OutreachWizard />
      </MainLayout>
    </OutreachProvider>
  );
}

export default App;