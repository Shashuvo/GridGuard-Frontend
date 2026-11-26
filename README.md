# ⚡ GridGuard — Frontend

### Smart Electricity Service & Outage Management Platform

**Live Demo:** https://grid-guard-frontend.vercel.app/

**Frontend Repository:** https://github.com/Shashuvo/GridGuard-Frontend

**Backend Repository:** https://github.com/Shashuvo/GridGuard-Backend

GridGuard is a modern, responsive Next.js frontend for a smart electricity service and power outage management platform. Customers can monitor scheduled load-shedding, report unexpected power outages, track technician assignments, and purchase premium subscriptions. Technicians can manage assigned outage reports and update their resolution status. Admins oversee users, technician applications, outage schedules, service areas, premium packages, and payments through dedicated management dashboards.

This frontend consumes the GridGuard Backend API.

---

## 📖 Overview

GridGuard connects four types of users through a unified platform:

**Customers** can browse scheduled outages, report unexpected power outages, track their reports, purchase premium subscriptions, view payment history, and manage their profiles.

**Technicians** can apply for technician accounts, manage their profiles, view assigned outage reports, and update outage resolution statuses.

**Admins** manage customers, approve technician applications, assign technicians to reported outages, manage service areas, schedule outages, and oversee premium packages and payments.

**Super Admins** oversee the entire platform, including users, technicians, outages, service areas, premium packages, and system operations.

The interface provides dedicated experiences for different user roles, with protected layouts, authentication guards, and role-based access control.

---

## ✨ Features

### 🌐 Public

- Responsive landing page with platform overview and feature highlights
- Browse scheduled power outages
- View scheduled outages by service area
- Browse available service areas
- View public technician profiles
- Browse available premium packages
- About page and FAQ section

### 👤 Customer

- User registration with email OTP verification
- Login and session management
- Google authentication
- Forgot password and password reset
- Profile management and profile image upload
- Change password
- Report unexpected power outages
- View personal outage reports
- Track outage report statuses and technician assignments
- Browse scheduled outages
- Purchase premium subscriptions through bKash
- View premium subscription history
- View payment history
- Customer analytics dashboard

### 🔧 Technician

- Apply for a technician account with resume upload
- Email verification during technician application
- Technician profile management
- View assigned outage reports
- Update assigned outage statuses
- View public technician profiles
- Technician analytics dashboard

### 🛡️ Admin & Super Admin

- Platform overview and analytics dashboard
- View and manage users
- Ban, unban, and delete user accounts
- View individual user details
- Manage premium users
- Review and approve technician applications
- View and manage technicians
- Create, update, and delete service areas
- View all unexpected outage reports
- Assign technicians to reported outages
- View individual outage details
- Create, update, and delete scheduled outages
- Create, update, and delete premium packages
- View payment records and payment details

### 🎨 UI & User Experience

- Responsive layouts for desktop, tablet, and mobile devices
- Reusable UI components powered by shadcn/ui and Radix UI
- Form handling and validation with TanStack Form and Zod
- Interactive analytics visualizations with Recharts
- Light and dark theme support
- Toast notifications using Sonner
- Reusable loading, error, and status components
- Centralized API communication
- Server-state management with TanStack Query

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui, Radix UI |
| Forms | TanStack Form |
| Validation | Zod |
| API Client | ofetch |
| Server State | TanStack Query |
| Authentication | JWT, Google OAuth |
| Charts & Analytics | Recharts |
| Icons | Lucide React, React Icons |
| Notifications | Sonner |
| Theming | next-themes |
| Date Utilities | date-fns |
| Package Manager | npm |
| Code Quality | Biome |
| Deployment | Vercel |

---

## 📁 Project Structure

```text
GridGuard-Frontend/
├── public/                       # Static assets
├── src/
│   ├── api/                      # Backend API integration
│   │   ├── admin.api.ts
│   │   ├── analytics.api.ts
│   │   ├── area.api.ts
│   │   ├── auth.api.ts
│   │   ├── outage.api.ts
│   │   ├── package.api.ts
│   │   ├── payment.api.ts
│   │   ├── technician.api.ts
│   │   └── user.api.ts
│   │
│   ├── app/                      # Next.js App Router
│   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   └── technician/
│   │   ├── (private)/
│   │   │   └── profile/
│   │   └── (public)/
│   │       ├── (authentication)/
│   │       └── (marketing)/
│   │
│   ├── components/
│   │   ├── auth/                 # Authentication & route guards
│   │   ├── dashboard/            # Dashboard layouts
│   │   ├── form/                 # Reusable forms
│   │   ├── layout/               # Public layouts
│   │   ├── modules/              # Feature-specific components
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   ├── homepage/
│   │   │   ├── payments/
│   │   │   └── technician/
│   │   ├── shared/               # Shared UI components
│   │   └── ui/                   # Reusable UI primitives
│   │
│   ├── constants/                # Application constants
│   ├── hooks/                    # Custom React Query hooks
│   ├── lib/                      # API client & shared utilities
│   ├── providers/                # Application context providers
│   ├── routes/                   # Role-based route configuration
│   ├── types/                    # TypeScript definitions
│   ├── utils/                    # Helper utilities
│   └── validation/               # Zod validation schemas
│
├── biome.json                    # Biome configuration
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9+
- npm
- A running instance of the GridGuard Backend

### Installation

```bash
git clone https://github.com/Shashuvo/GridGuard-Frontend.git

cd GridGuard-Frontend

npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

The frontend uses `ofetch` for API communication. The API client automatically attaches the stored access token as a Bearer token to authenticated requests.

For local development, make sure the GridGuard Backend is running at:

```text
http://localhost:5000
```

### Run the Project

```bash
npm run dev          # Development server

npm run build        # Production build

npm start            # Start production server

npm run lint         # Check code with Biome

npm run format       # Format code with Biome
```

Open http://localhost:3000 in your browser to access the application.

---

## 🔗 Backend Integration

The frontend communicates with the GridGuard Backend API through a centralized API client and dedicated API modules.

**Backend Repository:** https://github.com/Shashuvo/GridGuard-Backend

**Local API Base URL:**

```text
http://localhost:5000/api/v1
```

### API Integration Overview

| Module | Backend Endpoint | Purpose |
|---|---|---|
| Authentication | `/api/v1/auth/*` | Registration, login, email verification, token refresh, and Google authentication |
| Users | `/api/v1/user/*` | Profile management, user administration, and premium user management |
| Technicians | `/api/v1/technician/*` | Technician applications, approvals, profiles, and assignments |
| Service Areas | `/api/v1/area/*` | Browse and manage electricity service areas |
| Unexpected Outages | `/api/v1/unexpected-outage/*` | Report, view, assign, and manage unexpected outages |
| Scheduled Outages | `/api/v1/scheduled-outage/*` | Browse and manage scheduled load-shedding |
| Premium Packages | `/api/v1/premium-package/*` | Browse and manage subscription packages |
| Payments | `/api/v1/payment/*` | Purchase subscriptions and retrieve payment records |
| Analytics | `/api/v1/analytics/*` | Customer, technician, and platform analytics |

For complete API documentation, request methods, permissions, and backend implementation details, refer to the [GridGuard Backend Repository](https://github.com/Shashuvo/GridGuard-Backend).

---

## 🔄 User Journeys

### 🏠 Customer Journey

Register → Verify Email → Login

↓

Browse Scheduled Outages → Select Service Area

↓

Report Unexpected Outage → Track Report Status

↓

Technician Assigned → Follow Resolution Progress

↓

Purchase Premium Subscription → Complete bKash Payment

↓

View Payment History and Analytics

### 🔧 Technician Journey

Apply as Technician → Verify Email

↓

Admin Reviews Application → Technician Approval

↓

Access Technician Dashboard

↓

View Assigned Outage Reports → Update Resolution Status

↓

Complete Assigned Work

### 🛡️ Admin Journey

Login → Admin Dashboard

↓

Manage Users and Technicians → Approve Applications

↓

Manage Service Areas and Scheduled Outages

↓

Review Unexpected Outage Reports → Assign Technicians

↓

Manage Premium Packages → Monitor Payments

### 👑 Super Admin Journey

Login → Super Admin Dashboard

↓

Oversee Users, Technicians, and Administrators

↓

Manage Outages, Service Areas, and Premium Packages

↓

Monitor Payments and Platform Analytics

---

## 📊 Outage Management Workflow

GridGuard follows a structured workflow for handling unexpected power outage reports.

```text
PENDING
   |
   v
ASSIGNED
   |
   v
IN_PROGRESS
   |
   v
RESOLVED
```

- **PENDING:** A customer has submitted an unexpected outage report.
- **ASSIGNED:** An administrator has assigned a technician.
- **IN_PROGRESS:** The assigned technician has started working on the outage.
- **RESOLVED:** The outage has been resolved by the technician.

---

## 💳 Payment Integration

GridGuard integrates bKash to support premium subscription purchases.

The frontend provides the subscription purchase experience and communicates with the backend to initiate payment.

Payment processing is handled through the backend's bKash integration, including payment callbacks and transaction verification.

Customers can also access their payment history and premium subscription records through their dashboards.

---

## 🔐 Authentication & Access Control

- JWT-based authentication with access and refresh tokens.
- Google OAuth authentication.
- Email OTP verification.
- Password recovery and reset functionality.
- Authentication guards for protected routes.
- Role-based access control for Customers, Technicians, Admins, and Super Admins.
- Dedicated dashboard layouts and route configurations.
- Centralized authentication and Google OAuth providers.

---

## 👤 Author

**MD. Shahariat Hossen**

GitHub: [@Shashuvo](https://github.com/Shashuvo)

---

## 📄 License

This project is licensed under the ISC License.