
import apiClient from "@/lib/apiClient";
import type { IAreaResponse } from "@/types";

export function getPublicAreas() {
  return apiClient<IAreaResponse>("/area/public/all");
}