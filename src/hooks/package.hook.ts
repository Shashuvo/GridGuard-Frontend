import { getPublicPackages } from "@/api/package.api";
import { useQuery } from "@tanstack/react-query";

export function useGetPublicPackages(params?: { page?: number; limit?: number }) {
    return useQuery({
      queryKey: ["packages", params],
      queryFn: () => getPublicPackages(params),
    });
}