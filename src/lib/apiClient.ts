import { ofetch } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  onRequest({ options }) {
    if (typeof window === "undefined") return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    options.headers = new Headers(options.headers);
    options.headers.set("Authorization", `Bearer ${accessToken}`);
  },
});

export default apiClient;