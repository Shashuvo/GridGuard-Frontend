import apiClient from "@/lib/apiClient";
import type { IAdminAnalytics } from "@/types";
import type { IApiResponse } from "@/types/common.types";

export function getAdminAnalytics() {
    return apiClient<IApiResponse<IAdminAnalytics>>("/analytics/admin-analytics");
}