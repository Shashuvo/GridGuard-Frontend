"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    Activity,
    CalendarClock,
    House,
    Info,
    LayoutDashboard,
    LogOut,
    Menu,
    User,
    X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LogoMark } from "./LogoMark"
import { useGetMe } from "@/hooks"
import { dashboardRoutes, type UserRole } from "@/lib/role-config"
import { UserMenu, useLogout } from "./user-menu"

const navItems = [
    { label: "Home", href: "/", icon: House },
    { label: "Schedules", href: "/schedules", icon: CalendarClock },
    { label: "Outages", href: "/outages", icon: Activity },
    { label: "About Us", href: "/about", icon: Info },
]

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    const { data, isLoading } = useGetMe()
    const user = data?.data
    const logout = useLogout()

    // Logged-in people get a Dashboard link that goes to the right place for their role
    const items = [
        ...navItems,
        ...(user
            ? [
                  {
                      label: "Dashboard",
                      href: dashboardRoutes[user.role as UserRole],
                      icon: LayoutDashboard,
                  },
              ]
            : []),
    ]

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
            <nav className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                {/* Logo */}
                <Link href="/" aria-label="GridGuard home" className="group flex items-center gap-1 text-lg font-semibold">
                    <LogoMark className="size-10 drop-shadow-sm transition-transform duration-200 group-hover:scale-105" />
                    <span className="font-serif text-xl tracking-tight">
                        Grid
                        <span className="text-primary-foreground dark:text-primary">Guard</span>
                    </span>
                </Link>

                {/* Desktop nav links */}
                <ul className="hidden items-center gap-1 rounded-full border border-border bg-card/60 p-1 shadow-sm md:flex">
                    {items.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                                        active
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-primary/15 hover:text-foreground",
                                    )}
                                >
                                    <Icon className="size-4" />
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                {/* Right side: auth buttons or avatar, plus mobile toggle */}
                <div className="flex items-center gap-2.5">
                    {/* Logged in: avatar with image, or initials when there is no image */}
                    {user && <UserMenu />}

                    {!isLoading && !user && (
                        <>
                            <div className="hidden items-center gap-2 sm:flex">
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="rounded-full px-5 text-foreground hover:bg-primary/15"
                                >
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild className="rounded-full px-6 shadow-sm">
                                    <Link href="/register">Register</Link>
                                </Button>
                            </div>

                            <div className="sm:hidden">
                                <Button asChild className="rounded-full px-5 shadow-sm" size="sm">
                                    <Link href="/register">Register</Link>
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Keeps the avatar spot from jumping while the user loads */}
                    {isLoading && <div className="size-10 rounded-full bg-muted motion-safe:animate-pulse" />}

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-primary/40 hover:bg-primary hover:text-primary-foreground md:hidden"
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((v) => !v)}
                    >
                        {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                    </Button>
                </div>
            </nav>

            {/* Mobile nav links */}
            {mobileOpen && (
                <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
                    <ul className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-4 sm:px-6">
                        {items.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.href)
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
                                            active
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:bg-primary/15 hover:text-foreground",
                                        )}
                                    >
                                        <Icon className="size-4" />
                                        {item.label}
                                    </Link>
                                </li>
                            )
                        })}

                        <li className="mt-2 border-t border-border pt-3">
                            {!isLoading && !user && (
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/15 hover:text-foreground"
                                >
                                    <User className="size-4" />
                                    Login
                                </Link>
                            )}
                            {user && (
                                <div className="flex flex-col gap-1.5">
                                    <Link
                                        href="/profile"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/15 hover:text-foreground"
                                    >
                                        <User className="size-4" />
                                        Profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            logout()
                                            setMobileOpen(false)
                                        }}
                                        className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/15"
                                    >
                                        <LogOut className="size-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}