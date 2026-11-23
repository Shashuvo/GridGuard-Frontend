import apiClient from "@/lib/apiClient";
import type { ICustomerAnalytics, ITechnicianAnalytics } from "@/types/analytics.types";
import type { IApiResponse } from "@/types/common.types";

export function getCustomerAnalytics() {
    return apiClient<IApiResponse<ICustomerAnalytics>>("/analytics/customer-analytics");
}

export function getTechnicianAnalytics() {
    return apiClient<IApiResponse<ITechnicianAnalytics>>("/analytics/technician-analytics");
}