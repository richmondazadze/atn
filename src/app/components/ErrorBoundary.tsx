import { Component, type ReactNode } from 'react';
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
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-muted mb-6 max-w-sm">{this.state.message || 'An unexpected error occurred.'}</p>
          <Button onClick={() => this.setState({ hasError: false, message: '' })}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
