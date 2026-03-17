import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] p-6 sm:p-8 text-center" role="alert">
          <AlertTriangle size={40} className="text-destructive mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-muted mb-6 max-w-sm">{this.state.message || 'An unexpected error occurred.'}</p>
          <Button onClick={() => this.setState({ hasError: false, message: '' })} aria-label="Retry loading the page">
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
