"use client";

import * as React from "react";

type MathErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  resetKey?: string | number;
};

type MathErrorBoundaryState = {
  hasError: boolean;
};

export class MathErrorBoundary extends React.Component<
  MathErrorBoundaryProps,
  MathErrorBoundaryState
> {
  state: MathErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MathErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: MathErrorBoundaryProps) {
    if (!this.state.hasError) {
      return;
    }

    const resetKeyChanged =
      prevProps.resetKey !== undefined &&
      this.props.resetKey !== undefined &&
      prevProps.resetKey !== this.props.resetKey;

    if (resetKeyChanged || prevProps.children !== this.props.children) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("MathErrorBoundary caught render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <span className="text-sm text-error" role="alert">
            Unable to render equation
          </span>
        )
      );
    }

    return this.props.children;
  }
}
