
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
          <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-red-500/30">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <div className="bg-black/50 p-4 rounded-md overflow-auto max-h-96 mb-6">
              <p className="font-mono text-red-400 mb-2">{this.state.error?.toString()}</p>
              <pre className="font-mono text-xs text-gray-400 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
