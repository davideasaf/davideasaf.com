import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | FallbackRender;
  onError?: (error: Error, info: ErrorInfo) => void;
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

type FallbackRender = (error: Error, info: ErrorInfo | null) => ReactNode;

const haveResetKeysChanged = (prev?: unknown[], next?: unknown[]) => {
  if (prev === next) return false;
  if (!prev || !next) return Boolean(prev) !== Boolean(next);
  if (prev.length !== next.length) return true;
  for (let i = 0; i < prev.length; i += 1) {
    if (!Object.is(prev[i], next[i])) {
      return true;
    }
  }
  return false;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ errorInfo: info });
    if (this.props.onError) {
      this.props.onError(error, info);
    } else {
      console.error("Error Boundary caught an error:", error, info);
    }
  }

  resetErrorBoundary = () => {
    this.setState({ error: null, errorInfo: null });
  };

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (haveResetKeysChanged(prevProps.resetKeys, this.props.resetKeys)) {
      this.resetErrorBoundary();
    }
  }

  render(): ReactNode {
    const { children, fallback } = this.props;
    const { error, errorInfo } = this.state;

    if (error) {
      if (typeof fallback === "function") {
        return (fallback as FallbackRender)(error, errorInfo);
      }
      if (fallback) {
        return fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-4 text-center">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
              <p className="text-muted-foreground mb-4">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>
            <Button onClick={this.resetErrorBoundary} variant="default" size="lg">
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
