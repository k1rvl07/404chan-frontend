import type { AxiosError } from "./types";

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object"
  );
}

function hasStatusProperty(error: unknown): error is { status: unknown } {
  return typeof error === "object" && error !== null && "status" in error;
}

export function getErrorStatus(error: unknown): number | null {
  if (isAxiosError(error) && error.response?.status) {
    return error.response.status;
  }

  if (hasStatusProperty(error)) {
    const status = error.status;
    if (typeof status === "number") {
      return status;
    }
  }

  return null;
}
