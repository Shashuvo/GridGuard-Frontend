import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getMyReports,
  getPublicOutagesByArea,
  getPublicScheduledOutages,
  getPublicScheduledOutagesByArea,
  reportOutage,
} from "@/api";

export function useReportOutage() {
  return useMutation({
    mutationFn: reportOutage,
  });
}

export function useGetMyReports(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["my-reports", params],
    queryFn: () => getMyReports(params),
  });
}

export function useGetPublicOutagesByArea(
  areaId?: string,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["unexpected-outages-by-area", areaId, params],
    queryFn: () => getPublicOutagesByArea(areaId as string, params),
    enabled: !!areaId,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

export function useGetPublicScheduledOutages(
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    areaId?: string;
  },
  enabled = true,
) {
  return useQuery({
    queryKey: ["scheduled-outages", params],
    queryFn: () => getPublicScheduledOutages(params),
    enabled,
    staleTime: 10_000,
    refetchInterval: 60_000,
  });
}

export function useGetPublicScheduledOutagesByArea(
  areaId?: string,
  params?: { page?: number; limit?: number; status?: string },
) {
  return useQuery({
    queryKey: ["scheduled-outages-by-area", areaId, params],
    queryFn: () => getPublicScheduledOutagesByArea(areaId as string, params),
    enabled: !!areaId,
    staleTime: 10_000,
    refetchInterval: 60_000,
  });
}
