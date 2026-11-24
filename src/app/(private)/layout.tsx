import AuthGuard from "@/components/auth/auth-guard";
import { Header } from "@/components/layout/public/Header";
import type { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                {/* <Footer /> */}
            </div>
        </AuthGuard>
    );
}