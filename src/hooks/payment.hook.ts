import { buyPremium } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useBuyPremium() {
    return useMutation({
      mutationFn: buyPremium,
    });
}