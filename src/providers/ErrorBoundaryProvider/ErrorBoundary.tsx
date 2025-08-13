"use client";

import { ErrorPage } from "@components";
import { getErrorMessage, getErrorStatus } from "@utils";
import { env } from "@utils";
import { Component } from "react";
import type { ErrorBoundaryProps, ErrorBoundaryState } from "./types";

const { ENV } = env;

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const status = getErrorStatus(this.state.error);
      const message = getErrorMessage(status);
      const title = status?.toString() || "500";

      return (
        <ErrorPage title={title} message={message} onRetry={() => this.setState({ hasError: false, error: null })} />
      );
    }

    return this.props.children;
  }
}
