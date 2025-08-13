export type ExtendedError = Error & { onRetry?: () => void };
