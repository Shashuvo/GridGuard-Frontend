"use client";

import { useGoogleOAuth } from "@/hooks";
import { GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GoogleLoginComponent() {
    const router = useRouter();
    const { mutate: googleLogin } = useGoogleOAuth();
    const queryClient = useQueryClient();

    const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
        const idToken = credentialResponse.credential;

        if (!idToken) {
            toast.error("Google OAuth Failed",{
                description: "Something went wrong. Please try again",
            })
            return;
        }

        googleLogin(
            { idToken },
            {
                onSuccess: (res) => {
                    const { accessToken, refreshToken } = res.data;

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);

                    toast.success("Login Successfully.",{
                        description: "Welcome back to GridGuard.",
                        position: "top-right",
                      },);
                    queryClient.invalidateQueries({ queryKey: ["user"] });
                    router.push("/");
                },
                onError: (err) => {
                    toast.error("Google OAuth Failed",{
                        description: err.message,
                    })
                },
            },
        );
    };

    const handleGoogleError = () => {
        toast.error("Google OAuth Failed",{
            description: "Something went wrong. Please try again",
        })
    };

    return (
        <GoogleLogin
            theme="outline"
            shape="pill"
            text="continue_with"
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
        />
    );
}