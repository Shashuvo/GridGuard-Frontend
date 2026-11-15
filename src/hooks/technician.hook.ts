import { verifyTechnicianAccount } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useVerifyTechnicianAccount() {
    return useMutation({
      mutationFn: verifyTechnicianAccount,
    });
}  