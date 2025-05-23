import React, { useState } from 'react';
import { ArrowLeft, Send, Check, RefreshCw } from 'lucide-react';
import { useOutreach } from '../context/OutreachContext';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Mock function to simulate email sending
const mockSendEmail = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};

const SendEmailPage: React.FC = () => {
  const { step, setStep, emailDistribution, generatedEmail } = useOutreach();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendEmail = async () => {
    setSending(true);
    setError(null);
    
    try {
      // In a real application, you would send the email here using a service
      await mockSendEmail();
      setSent(true);
    } catch (err) {
      setError('An error occurred while sending the email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setStep(1);
  };

  return (
    <div className="animate-fadeIn">
      <ProgressBar currentStep={4} totalSteps={4} />

      <h1 className="font-serif text-3xl font-medium text-navy-800 mb-2">Send Your Email</h1>
      <p className="text-gray-600 mb-8">Finalize and send your outreach email.</p>

      <Card className="p-6 mb-8">
        {!sent ? (
          <div>
            <h2 className="text-xl font-medium text-gray-800 mb-4">Ready to Send</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="mb-4">
                <span className="font-medium text-gray-700">To:</span>{' '}
                <span>{emailDistribution.emailList.join(', ')}</span>
              </div>
              <div className="mb-4">
                <span className="font-medium text-gray-700">Subject:</span>{' '}
                <span>{emailDistribution.subject}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Message:</span>
                <div className="mt-2 font-mono text-sm whitespace-pre-wrap">
                  {generatedEmail.substring(0, 150)}...
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button
                variant="primary"
                size="lg"
                icon={sending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                onClick={handleSendEmail}
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Email'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Email Sent Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your email has been sent to {emailDistribution.emailList.length} recipient{emailDistribution.emailList.length !== 1 ? 's' : ''}.
            </p>
            <Button variant="primary" size="lg" onClick={handleReset}>
              Create New Email
            </Button>
          </div>
        )}
      </Card>

      {!sent && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setStep(3)}
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default SendEmailPage;