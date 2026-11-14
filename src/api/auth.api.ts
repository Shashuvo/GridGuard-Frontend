import apiClient from "@/lib/apiClient";
import type { LoginPayload, RegistrationPayload } from "@/types";



export function userLogin(payload: LoginPayload) {
    return apiClient("/auth/login", { method: "POST", body: payload });
};

export function getMe() {
    return apiClient("/auth/me");
};

export function googleOAuth(payload: { idToken: string }) {
    return apiClient("/auth/google", { method: "POST", body: payload });
};

export function userRegistration(payload: RegistrationPayload) {
    return apiClient("/auth/register", { method: "POST", body: payload });
}