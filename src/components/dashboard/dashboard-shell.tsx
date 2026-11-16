import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar";
  import { DashboardSidebar } from "./dashboard-sidebar";
  import type { ReactNode } from "react";
  import { roleLabels, type UserRole } from "@/lib/role-config";
import { UserMenu } from "../layout/public/user-menu";
  
  export default function DashboardShell({
    children,
    role,
  }: {
    children: ReactNode;
    role: UserRole;
  }) {
    return (
      <SidebarProvider>
        <DashboardSidebar role={role} />
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60 sm:px-6">
            <SidebarTrigger className="-ml-1 size-10 rounded-full" />
            <div aria-hidden className="h-5 w-px bg-border" />
            <span className="hidden text-sm font-medium text-muted-foreground sm:block">
              {roleLabels[role]} dashboard
            </span>
  
            <div className="ml-auto">
              {/* After logging out of a protected page, send the person to login */}
              <UserMenu redirectTo="/login" />
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    );
  }