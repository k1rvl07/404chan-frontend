import { services } from "@services";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { ServiceMap, ServiceMethod, ServiceName } from "./types";

export function useServiceMutation<
  S extends ServiceName,
  M extends ServiceMethod<S>,
  TVariables = Parameters<ServiceMap[S][M]>[0],
  TData = Awaited<ReturnType<ServiceMap[S][M]>>,
>(serviceName: S, methodName: M, options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">) {
  const service = services[serviceName];
  const method = service[methodName];

  return useMutation<TData, Error, TVariables>({
    mutationKey: [serviceName, methodName],
    mutationFn: async (variables: TVariables) => {
      if (typeof method !== "function") {
        throw new Error(`Method ${String(methodName)} is not a function`);
      }

      return variables !== undefined ? await method(variables) : await (method as () => Promise<TData>)();
    },
    ...options,
  });
}
