import apiClient from "@/lib/apiClient";
import type { TechnicianApplicationPayload, UpdateOutageStatusPayload, VerifyAccountPayload } from "@/types";

export function applyAsTechnician(
  payload: TechnicianApplicationPayload,
) {
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload.data));
  formData.append("resume", payload.resume);

  return apiClient("/technician/apply-as-technician", {
    method: "POST",
    body: formData,
  });
};

export function verifyTechnicianAccount(
    payload: VerifyAccountPayload,
  ){
    return apiClient("/technician/apply-as-technician/verify-email", {
      method: "POST",
      body: payload,
    });
}

export function getOutageDetails(id: string) {
  return apiClient(`/unexpected-outage/${id}`);
}

export function updateOutageStatus(id: string, payload: UpdateOutageStatusPayload) {
  return apiClient(`/technician/${id}/update-status`, {
    method: "PATCH",
    body: payload,
  });
}