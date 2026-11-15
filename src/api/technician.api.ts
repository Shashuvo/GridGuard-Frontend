import apiClient from "@/lib/apiClient";
import type { VerifyAccountPayload } from "@/types";

export function verifyTechnicianAccount(
    payload: VerifyAccountPayload,
  ){
    return apiClient("/technician/apply-as-technician/verify-email", {
      method: "POST",
      body: payload,
    });
}