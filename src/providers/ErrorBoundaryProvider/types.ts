import type { WithChildren } from "@types";

export type ErrorBoundaryProps = WithChildren;

export type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};
