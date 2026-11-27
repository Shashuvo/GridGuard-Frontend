"use client";

import { usePathname } from "next/navigation";

const SITE_NAME = "GridGuard";

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/about": "About us",
  "/schedules": "Scheduled outages",
  "/outages": "Outages",
  "/login": "Login",
  "/register": "Register",
  "/register/verify-account": "Verify account",
  "/reset-password": "Reset password",
  "/apply": "Apply",
  "/apply/verify-account": "Verify account",
  "/profile": "Profile",
  "/dashboard": "Dashboard",
  "/dashboard/report-outage": "Report outage",
  "/dashboard/my-reports": "My reports",
  "/dashboard/payments": "Payments",
  "/technician": "Dashboard",
  "/technician/assignments": "Assignments",
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/technicians": "Technicians",
  "/admin/areas": "Areas",
  "/admin/packages": "Packages",
  "/admin/scheduled-outages": "Scheduled outages",
  "/admin/unexpected-outages": "Unexpected outages",
  "/admin/payments": "Payments",
};

function resolveTitle(pathname: string): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  const pageTitle =
    pageTitles[path] ??
    path
      .split("/")
      .filter(Boolean)
      .at(-1)
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
}

export function PageTitle() {
  const pathname = usePathname();

  return <title>{resolveTitle(pathname)}</title>;
}
