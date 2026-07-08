"use client";

import * as React from "react";

type MathErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
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
