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

type FallbackRender = (
  error: Error,
  info: ErrorInfo | null,
  resetErrorBoundary: () => void,
) => ReactNode;

interface DefaultFallbackProps {
  error: Error;
  onRetry: () => void;
}

const DefaultFallback = ({ error, onRetry }: DefaultFallbackProps) => (
  <div
    role="alert"
    aria-live="assertive"
    className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive"
  >
    <div className="space-y-2">
      <p className="text-base font-semibold">Something went wrong</p>
      <p className="text-sm text-destructive/80">
        We hit an unexpected error while loading this section. You can try again below or refresh
        the page.
      </p>
      <p className="text-xs text-destructive/70">{error.message}</p>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button type="button" onClick={onRetry} variant="destructive">
        Try again
      </Button>
      <Button type="button" onClick={() => window.location.reload()} variant="outline">
        Reload page
      </Button>
    </div>
  </div>
);

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

  resetErrorBoundary = () => {
    this.setState({ error: null, errorInfo: null });
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ errorInfo: info });
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

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
        return (fallback as FallbackRender)(error, errorInfo, this.resetErrorBoundary);
      }
      if (fallback) {
        return fallback;
      }
      return <DefaultFallback error={error} onRetry={this.resetErrorBoundary} />;
    }

    return children;
  }
}

export default ErrorBoundary;
