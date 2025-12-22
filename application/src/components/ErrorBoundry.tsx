import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private readonly handleRefresh = () => {
    globalThis.location.reload();
  };

  private readonly handleGoHome = () => {
    globalThis.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background font-sans text-foreground flex flex-col items-center justify-center relative overflow-hidden p-6">
          <div className="flex flex-col items-center max-w-lg w-full text-center space-y-8">
            {/* Icon / Graphic */}
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative bg-background p-5 rounded-3xl border shadow-sm ring-1 ring-border/50">
                <AlertTriangle className="h-10 w-10 text-gray-900" />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-gray-900 pb-1">
                {this.state.error?.name || 'Something went wrong'}
              </h1>
              <p className="text-lg text-muted-foreground leading-snug max-w-md mx-auto">
                {this.state.error?.message || 'We encountered an unexpected error. Please try refreshing the page or return to the dashboard.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                onClick={this.handleRefresh}
                size="lg"
                className="w-full sm:w-auto min-w-[140px] shadow-md hover:shadow-lg transition-all"
              >
                <RotateCcw className="mr-1 -ml-1 h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[140px] bg-background/50 hover:bg-accent hover:text-accent-foreground backdrop-blur-sm transition-all"
              >
                <Home className="mr-1 -ml-1 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
