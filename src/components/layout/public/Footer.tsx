
"use client"

import Link from "next/link"
import type { IconType } from "react-icons"
import {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa"
import { ArrowUp, ArrowUpRight, Zap } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { LogoMark } from "./LogoMark"
import { useGetMe } from "@/hooks"
import { dashboardRoutes, type UserRole } from "@/lib/role-config"

type FooterLink = {
  label: string
  href: string
}

type SocialLink = {
  icon: IconType
  label: string
  href: string
}

const exploreLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Schedules", href: "/schedules" },
  { label: "Outages", href: "/outages" },
  { label: "About us", href: "/about" },
]

const guestLinks: FooterLink[] = [
  { label: "Create an account", href: "/register" },
  { label: "Login", href: "/login" },
  { label: "Apply as technician", href: "/apply" },
]

const socialLinks: SocialLink[] = [
  {
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/Shashuvo",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shahariat-hossen/",
  },
  {
    icon: FaFacebookF,
    label: "Facebook",
    href: "https://www.facebook.com/shahariat.hossen.524",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/o__shuv__o/",
  },
]

const columnHeading =
  "mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-background/50"

function FooterColumn({
  title,
  links,
  loading = false,
}: {
  title: string
  links: FooterLink[]
  loading?: boolean
}) {
  return (
    <nav aria-label={title} className="flex flex-col items-center">
      <h3 className={columnHeading}>{title}</h3>

      {loading ? (
        <div className="flex flex-col items-center gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation
              key={index}
              className="h-3.5 w-28 bg-background/10"
            />
          ))}
        </div>
      ) : (
        <ul className="flex flex-col items-center gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group inline-flex min-h-8 items-center gap-1.5 text-[13px] text-background/60 motion-safe:transition-colors motion-safe:duration-200 hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
              >
                {link.label}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3 opacity-0 motion-safe:transition-opacity motion-safe:duration-200 group-hover:opacity-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

function SocialLinks() {
  return (
    <div className="flex flex-col items-center">
      <p className={columnHeading}>Find me elsewhere</p>

      <ul className="flex items-center gap-2">
        {socialLinks.map(({ icon: Icon, label, href }) => (
          <li key={label}>
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit my ${label} profile`}
              title={label}
              className="flex size-9 items-center justify-center rounded-full border border-background/15 bg-background/4 text-background/60 motion-safe:transition-all motion-safe:duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
            >
              <Icon aria-hidden="true" className="size-3.5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const { data, isLoading } = useGetMe()
  const user = data?.data

  const accountLinks: FooterLink[] = user
    ? [
        {
          label: "Dashboard",
          href: dashboardRoutes[user.role as UserRole],
        },
        {
          label: "Profile",
          href: "/profile",
        },
      ]
    : guestLinks

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    })
  }

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">

        {/* Centered brand introduction */}
        <div className="flex flex-col items-center pt-16 pb-12 text-center sm:pt-20 sm:pb-14">

          <Link
            href="/"
            aria-label="GridGuard home"
            className="inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <LogoMark className="size-9" />

            <span className="font-serif text-xl font-semibold tracking-tight">
              Grid
              <span className="text-primary">Guard</span>
            </span>
          </Link>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-background/10 bg-background/4 px-3.5 py-1.5 text-[10px] font-medium tracking-wide text-background/60">
            <Zap
              aria-hidden="true"
              className="size-3 text-primary"
            />
            POWER OUTAGE MANAGEMENT
          </div>

          <h2 className="mt-5 max-w-lg font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            Stay informed.
            <br />
            Stay <span className="text-primary">connected.</span>
          </h2>

          <p className="mt-4 max-w-md text-[13px] leading-6 text-background/55">
            A smarter way to manage power outages and load-shedding.
            Check schedules, report problems, and stay updated on
            what's happening in your area.
          </p>

          <div className="mt-7">
            <SocialLinks />
          </div>
        </div>

        {/* Navigation area */}
        <div className="border-t border-b border-background/10 py-10 sm:py-12">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-8">

            <FooterColumn
              title="Explore"
              links={exploreLinks}
            />

            <FooterColumn
              title={user ? "Your account" : "Get started"}
              links={accountLinks}
              loading={isLoading}
            />

            <div className="col-span-2 flex flex-col items-center sm:col-span-1">
              <h3 className={columnHeading}>The platform</h3>

              <ul className="flex flex-col items-center gap-2">
                <li>
                  <Link
                    href="/schedules"
                    className="flex min-h-8 items-center text-[13px] text-background/60 motion-safe:transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
                  >
                    Scheduled outages
                  </Link>
                </li>
                <li>
                  <Link
                    href="/outages"
                    className="flex min-h-8 items-center text-[13px] text-background/60 motion-safe:transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
                  >
                    Report an outage
                  </Link>
                </li>
                <li>
                  <Link
                    href="/apply"
                    className="flex min-h-8 items-center text-[13px] text-background/60 motion-safe:transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
                  >
                    Become a technician
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-5 py-6 sm:flex-row">

          <p className="text-center text-[11px] text-background/50">
            © 2026 GridGuard. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">

            <nav aria-label="Legal" className="flex items-center gap-5">
              <Link
                href="/terms"
                className="text-[11px] text-background/45 motion-safe:transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
              >
                Terms of Service
              </Link>

              <Link
                href="/privacy"
                className="text-[11px] text-background/45 motion-safe:transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
              >
                Privacy Policy
              </Link>
            </nav>

            <button
              type="button"
              onClick={backToTop}
              className="inline-flex min-h-9 items-center gap-2 rounded-full border border-background/15 px-3.5 text-[11px] font-medium text-background/60 motion-safe:transition-colors motion-safe:duration-200 hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
            >
              Back to top
              <ArrowUp aria-hidden="true" className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
