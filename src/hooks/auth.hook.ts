import { getMe, googleOAuth, userLogin } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin() {
    return useMutation({
      mutationFn: userLogin,
    });
};

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
};

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
};