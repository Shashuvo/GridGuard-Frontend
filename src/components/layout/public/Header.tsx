"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Activity, CalendarClock, House, Info, Menu, User, X, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
    { label: "Home", href: "/", icon: House },
    { label: "Schedules", href: "/schedules", icon: CalendarClock },
    { label: "Outages", href: "/outages", icon: Activity },
    { label: "About Us", href: "/about", icon: Info },
]

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
            <nav className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-200 hover:scale-105">
                        <Zap className="size-4.5 fill-current" strokeWidth={2.5} />
                    </span>
                    <span className="font-serif text-xl tracking-tight">
                        Grid
                        <span className="text-primary-foreground dark:text-primary">Guard</span>
                    </span>
                </Link>

                {/* Desktop nav links */}
                <ul className="hidden items-center gap-1 rounded-full border border-border bg-card/60 p-1 shadow-sm md:flex">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                                        isActive
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

                {/* Right side: auth buttons + mobile toggle */}
                <div className="flex items-center gap-2.5">
                    <div className="hidden items-center gap-2 sm:flex">
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                className="rounded-full px-5 text-foreground hover:bg-primary/15"
                            >
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="rounded-full px-6 shadow-sm">Register</Button>
                        </Link>
                    </div>

                    <Link href="/register" className="sm:hidden">
                        <Button className="rounded-full px-5 shadow-sm" size="sm">
                            Register
                        </Button>
                    </Link>

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
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
                                            isActive
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
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/15 hover:text-foreground"
                            >
                                <User className="size-4" />
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}