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

export function getErrorMessage(status: number | null): string {
  switch (status) {
    case 500:
      return "Внутренняя ошибка сервера";
    case 502:
      return "Сервер недоступен (плохой шлюз)";
    case 503:
      return "Сервис временно недоступен";
    case 504:
      return "Таймаут сервера";
    case 403:
      return "Доступ запрещён";
    case null:
    case undefined:
      return "Не удалось подключиться к серверу";
    default:
      return `Ошибка ${status}: не удалось загрузить доску`;
  }
}
