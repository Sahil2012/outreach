import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import  Button  from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  title?: string;
  message?: string;
  showRefresh?: boolean;
  showHome?: boolean;
}

const ErrorPage = ({ 
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. Please try again or go back to the home page.",
  showRefresh = true,
  showHome = true
}: ErrorPageProps) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {title}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRefresh && (
            <Button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          )}
          
          {showHome && (
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="border-gray-300"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;