import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("❌ Error caught in ErrorBoundary:", error, errorInfo);
    // Optionally log to a remote error tracking service
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRedirectToLogin = () => {
    window.location.href = "/login";
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback } = this.props;

    if (hasError) {
      if (fallback) return fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Oops!</h2>
            <p className="text-gray-700 mb-4">
              We're sorry for the inconvenience. There was an issue processing
              your request.
            </p>
            <pre className="text-xs text-gray-500 overflow-auto max-w-sm mx-auto">
              {error?.message}
            </pre>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 border border-gray-300 bg-gray-100 rounded hover:bg-gray-200 transition duration-200"
              >
                Try Again
              </button>
              <button
                onClick={this.handleRedirectToLogin}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 font-semibold"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
