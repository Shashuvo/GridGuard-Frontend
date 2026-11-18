import { getAdminAnalytics } from "@/api";
import { useQuery } from "@tanstack/react-query";

// Analytics
export function useGetAdminAnalytics() {
    return useQuery({
      queryKey: ["admin-analytics"],
      queryFn: getAdminAnalytics,
    });
}