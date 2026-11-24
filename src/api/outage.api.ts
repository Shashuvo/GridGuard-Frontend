import apiClient from "@/lib/apiClient";
import type {
  IApiResponse,
  IPublicOutage,
  IPublicScheduledOutage,
  ReportOutagePayload,
} from "@/types";

export function reportOutage(payload: ReportOutagePayload) {
  return apiClient("/unexpected-outage/report", {
    method: "POST",
    body: payload,
  });
}

export function getMyReports(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return apiClient("/unexpected-outage/my-reports", { query: params });
}

export function getPublicOutagesByArea(
  areaId: string,
  params?: { page?: number; limit?: number },
) {
  return apiClient<IApiResponse<IPublicOutage[]>>(
    `/unexpected-outage/public/area/${areaId}`,
    { query: params },
  );
}

export function getPublicScheduledOutages(params?: {
  page?: number;
  limit?: number;
  status?: string;
  areaId?: string;
}) {
  return apiClient<IApiResponse<IPublicScheduledOutage[]>>(
    "/scheduled-outage/public/all",
    { query: params },
  );
}

export function getPublicScheduledOutagesByArea(
  areaId: string,
  params?: { page?: number; limit?: number; status?: string },
) {
  return apiClient<IApiResponse<IPublicScheduledOutage[]>>(
    `/scheduled-outage/public/area/${areaId}`,
    { query: params },
  );
}
