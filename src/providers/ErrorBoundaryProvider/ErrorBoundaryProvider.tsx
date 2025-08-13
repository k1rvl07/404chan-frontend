"use client";
import type { WithChildren } from "@types";
import { ErrorBoundary } from "./ErrorBoundary";

export const ErrorBoundaryProvider = ({ children }: WithChildren) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
