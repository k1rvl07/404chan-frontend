import type { Services } from "@services";

type OnlyMethods<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => R : never;
};

export type ServiceMap = {
  [K in keyof Services]: OnlyMethods<Services[K]>;
};

export type ServiceName = keyof ServiceMap;
export type ServiceMethod<T extends ServiceName> = keyof ServiceMap[T];
export type ServiceMethodParams<S extends ServiceName, M extends ServiceMethod<S>> =
  | Parameters<ServiceMap[S][M]>[0]
  | undefined;

export type ServiceHookResult<S extends ServiceName, M extends ServiceMethod<S>> = {
  data: Awaited<ReturnType<ServiceMap[S][M]>> | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  error: unknown;
};

export type UseServiceOptions = {
  enabled?: boolean;
};
