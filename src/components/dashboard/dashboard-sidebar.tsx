"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import type { SidebarItems } from "@/types";
import { adminRoutes, customerRoutes, technicianRoutes } from "@/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { roleLabels, type UserRole } from "@/lib/role-config";
import { LogoMark } from "../layout/public/LogoMark";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
  SUPER_ADMIN: adminRoutes,
  ADMIN: adminRoutes,
  CUSTOMER: customerRoutes,
  TECHNICIAN: technicianRoutes,
};

// Pill-shaped items. The data-[active=true] classes replace the sidebar's default grey highlight.
const itemClass =
  "h-10 rounded-full px-4 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-primary/15 hover:text-sidebar-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground";

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const routes: SidebarItems = sidebarRoutes[role] || [];
  // On phones the sidebar is a slide-in sheet, so close it after choosing a page
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="gap-3 p-4">
        <Link
          href="/"
          aria-label="GridGuard home"
          onClick={() => setOpenMobile(false)}
          className="group flex items-center gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <LogoMark className="size-10 drop-shadow-sm transition-transform duration-200 group-hover:scale-105" />
          <span className="font-serif text-xl font-semibold tracking-tight">
            Grid
            <span className="text-primary-foreground dark:text-primary">
              Guard
            </span>
          </span>
        </Link>
        <span className="w-fit rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary-foreground dark:text-primary">
          {roleLabels[role]} dashboard
        </span>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-4 text-[11px] font-semibold tracking-wider uppercase">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className={itemClass}
                    >
                      <Link
                        href={item.url}
                        onClick={() => setOpenMobile(false)}
                        aria-current={pathname === item.url ? "page" : undefined}
                      >
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={itemClass}>
              <Link href="/" onClick={() => setOpenMobile(false)}>
                <ArrowLeft className="size-4" aria-hidden />
                Back to website
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}