import apiClient from "@/lib/apiClient";

export function getPublicPackages(params?: { page?: number; limit?: number }) {
    return apiClient("/premium-package/public/all", { query: params });
}