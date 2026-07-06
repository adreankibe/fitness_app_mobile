import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/http/client";

type HealthResponse = {
  status?: string;
  ok?: boolean;
};

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => apiClient.get<HealthResponse>("/v1/health"),
    retry: 1,
  });
}
