import type { LoginPayload } from "@/types";

export type DemoRole = "admin" | "customer" | "technician";

export interface DemoAccount extends LoginPayload {
  role: DemoRole;
  label: string;
  description: string;
}

export const demoAccounts: DemoAccount[] = [
  {
    role: "admin",
    label: "Admin",
    description: "Manage users, outages and billing",
    email: "admin@gridguard.com",
    password: "GridGuard@TestAdmin2026!",
  },
  {
    role: "customer",
    label: "User",
    description: "Track outages and subscriptions",
    email: "user@gridguard.com",
    password: "GridGuard@TestUser2026!",
  },
  {
    role: "technician",
    label: "Technician",
    description: "Handle assigned repair work",
    email: "technician@gridguard.com",
    password: "GridGuard@TestTech2026!",
  },
];
