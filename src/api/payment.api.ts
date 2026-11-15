import apiClient from "@/lib/apiClient";
import type { BuyPremiumPayload } from "@/types";

export function buyPremium(payload: BuyPremiumPayload) {
    return apiClient("/payment/buy-premium", { method: "POST", body: payload });
}