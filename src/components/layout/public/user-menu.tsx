"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { LayoutDashboard, LogOut, User } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetMe } from "@/hooks"
import { dashboardRoutes, roleLabels, type UserRole } from "@/lib/role-config"

// Same logout steps as before. Pass redirectTo to leave a protected page afterwards.
export function useLogout(redirectTo?: string) {
    const queryClient = useQueryClient()
    const router = useRouter()

    return () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        queryClient.setQueryData(["user"], null)
        toast.success("Logged out Successfully.", {
            description: "You have been logged out.",
            position: "top-right",
        })
        if (redirectTo) router.push(redirectTo)
    }
}

const getInitials = (name?: string | null, email?: string | null) => {
    const source = (name || email || "U").trim()
    const parts = source.split(/\s+/).filter(Boolean)
    const letters =
        parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2)
    return letters.toUpperCase()
}

export function UserMenu({ redirectTo }: { redirectTo?: string }) {
    const { data, isLoading } = useGetMe()
    const logout = useLogout(redirectTo)

    if (isLoading) return <Skeleton className="size-10 rounded-full" />

    const user = data?.data
    if (!user) return null

    const role = user.role as UserRole
    // The profile picture is stored as imageUrl (the same field the profile page uses)
    const photo = user.imageUrl || undefined
    const initials = getInitials(user.name, user.email)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Open user menu"
                    className="rounded-full p-0.5 ring-2 ring-primary/30 transition-shadow hover:ring-primary focus-visible:ring-primary focus-visible:outline-none data-[state=open]:ring-primary"
                >
                    <Avatar className="size-9">
                        {photo && <AvatarImage src={photo} alt={user.name ?? "Profile photo"} />}
                        <AvatarFallback className="bg-primary/20 text-sm font-semibold text-primary-foreground dark:text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="bottom" align="end" sideOffset={10} className="w-64 rounded-2xl p-2 shadow-lg">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-3 py-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="size-10">
                                {photo && <AvatarImage src={photo} alt="" />}
                                <AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary-foreground dark:text-primary">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-col gap-0.5">
                                <span className="truncate text-sm font-semibold text-foreground">
                                    {user.name || "GridGuard user"}
                                </span>
                                <span className="truncate text-xs font-normal text-muted-foreground">
                                    {user.email}
                                </span>
                                <span className="mt-1 w-fit rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary-foreground dark:text-primary">
                                    {roleLabels[role] ?? role}
                                </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    {[
                        { label: "Dashboard", href: dashboardRoutes[role], icon: LayoutDashboard },
                        { label: "Profile", href: "/profile", icon: User },
                    ].map(({ label, href, icon: Icon }) => (
                        <DropdownMenuItem key={label} asChild className="gap-2.5 rounded-xl px-3 py-2.5">
                            <Link href={href}>
                                <span className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
                                    <Icon className="size-3.5" aria-hidden />
                                </span>
                                {label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    className="gap-2.5 rounded-xl px-3 py-2.5"
                    onSelect={logout}
                >
                    <span className="flex size-7 items-center justify-center rounded-full bg-destructive/10">
                        <LogOut className="size-3.5" aria-hidden />
                    </span>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}