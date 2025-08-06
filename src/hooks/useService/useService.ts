import { services } from "@services";
import { useQuery } from "@tanstack/react-query";
import type {
  ServiceHookResult,
  ServiceMap,
  ServiceMethod,
  ServiceMethodParams,
  ServiceName,
  UseServiceOptions,
} from "./types";

export function useService<S extends ServiceName, M extends ServiceMethod<S>>(
  serviceName: S,
  methodName: M,
  params?: ServiceMethodParams<S, M>,
  options?: UseServiceOptions,
): ServiceHookResult<S, M> {
  const query = useQuery({
    queryKey: [serviceName, methodName, params],
    queryFn: async () => {
      const service = services[serviceName];
      const method = service[methodName] as ServiceMap[S][M];

      if (params !== undefined) {
        return await method(params);
      }
      return await method();
    },
    enabled: options?.enabled !== false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    data: query.data as Awaited<ReturnType<ServiceMap[S][M]>>,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
