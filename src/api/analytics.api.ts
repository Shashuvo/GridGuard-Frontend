import apiClient from "@/lib/apiClient";
import type { ICustomerAnalytics } from "@/types/analytics.types";
import type { IApiResponse } from "@/types/common.types";

export function getCustomerAnalytics() {
    return apiClient<IApiResponse<ICustomerAnalytics>>("/analytics/customer-analytics");
}