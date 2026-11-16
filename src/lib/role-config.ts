
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "TECHNICIAN"

// Where each role lands when they open their dashboard.
export const dashboardRoutes: Record<UserRole, string> = {
    SUPER_ADMIN: "/admin",
    ADMIN: "/admin",
    CUSTOMER: "/dashboard",
    TECHNICIAN: "/technician",
}

// Friendly names shown in badges.
export const roleLabels: Record<UserRole, string> = {
    SUPER_ADMIN: "Super admin",
    ADMIN: "Admin",
    CUSTOMER: "Customer",
    TECHNICIAN: "Technician",
}