// import Link from "next/link";
// import { Suspense } from "react";
// import { CircleCheck } from "lucide-react";

// import ResetPasswordForm from "@/components/form/reset-password-form";
// import { Skeleton } from "@/components/ui/skeleton";
// import { LogoMark } from "@/components/layout/public/LogoMark";

// // The year is hardcoded: Cache Components does not allow new Date() in a server component
// const YEAR = 2026;

// function FormSkeleton() {
//   return (
//     // biome-ignore lint/a11y/useSemanticElements: <explanation
// <div role="status" aria-label="Loading form" className="flex flex-col gap-5">
//       <Skeleton className="h-8 w-48 rounded-full" />
//       <Skeleton className="h-11 w-full rounded-full" />
//       <Skeleton className="h-11 w-full rounded-full" />
//       <Skeleton className="h-12 w-full rounded-full" />
//     </div>
//   );
// }

// export default function ResetPasswordPage() {
//   return (
//     <div className="grid min-h-svh lg:h-svh lg:grid-cols-2 lg:overflow-hidden">
//       {/* Left: form */}
//       <div className="relative isolate flex flex-col overflow-hidden">
//         {/* Dotted background, faded at the edges */}
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
//         />
//         {/* Neutral glow */}
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:size-96"
//         />

//         {/* Top bar: logo left, back to login right */}
//         <div className="flex items-center justify-between gap-4 p-4 sm:p-6 md:p-8">
//           <Link
//             href="/"
//             aria-label="GridGuard home"
//             className="group flex items-center gap-2.5 text-lg font-semibold"
//           >
//             <LogoMark className="size-10 drop-shadow-sm transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
//             <span className="font-serif text-xl tracking-tight">
//               Grid
//               <span className="text-primary-foreground dark:text-primary">Guard</span>
//             </span>
//           </Link>

//           <Link
//             href="/login"
//             className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background/60 px-5 text-sm font-medium hover:bg-primary/10 focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-none motion-safe:transition-colors"
//           >
//             Back to login
//           </Link>
//         </div>

//         {/* Form card */}
//         <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
//           <div className="w-full max-w-md rounded-3xl border bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-reduce:animate-none">
//             <Suspense fallback={<FormSkeleton />}>
//               <ResetPasswordForm />
//             </Suspense>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-col items-center justify-between gap-2 p-4 text-xs text-muted-foreground sm:flex-row sm:p-6 md:px-8">
//           <p>© {YEAR} GridGuard. All rights reserved.</p>
//           <nav aria-label="Legal" className="flex items-center gap-4">
//             <Link
//               href="/terms"
//               className="rounded-full underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-none"
//             >
//               Terms
//             </Link>
//             <Link
//               href="/privacy"
//               className="rounded-full underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-none"
//             >
//               Privacy
//             </Link>
//           </nav>
//         </div>
//       </div>

//       {/* Right: photo, only on large screens */}
//       <div
//         aria-hidden="true"
//         className="relative isolate hidden overflow-hidden bg-muted bg-cover bg-center lg:block"
//         style={{ backgroundImage: "url('/login.jpg')" }}
//       >
//         {/* Dark gradient so the text stays readable */}
//         <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/45" />

//         <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
//           <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur-md">
//             <span className="relative flex size-2">
//               <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
//               <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
//             </span>
//             Updates in real time
//           </span>

//           <div className="flex flex-col gap-6">
//             {/* Sample status card (decoration only) */}
//             <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-xl backdrop-blur-md">
//               <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-300">
//                 <CircleCheck className="size-5" />
//               </span>
//               <div className="flex flex-col">
//                 <span className="text-sm font-semibold">Power restored</span>
//                 <span className="text-xs text-white/70">Mirpur-10 · 12 minutes ago</span>
//               </div>
//             </div>

//             <div className="flex max-w-md flex-col gap-2">
//               <p className="font-serif text-4xl leading-tight font-semibold tracking-tight text-white">
//                 Stay ahead of every outage.
//               </p>
//               <p className="text-base text-white/75">
//                 Reports, repairs and planned outages, all in one place.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }