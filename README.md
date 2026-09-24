# PersonToPerson — Permanent Public Business URL & Dynamic Links Platform

A modern, production-ready web application that generates a **single permanent public URL and QR code for each business**. 

The business owner creates their account → enters business information → adds their own dynamic links → the system generates one permanent public URL (e.g. `/b/abc123`).
Even if the business changes its Instagram, WhatsApp, website, Google Review, payment, or other links later, the **main public URL and QR code remain 100% permanent and unchanged**.

> [!NOTE]
> **NFC Integration Clarification**: NFC hardware reading/writing is intentionally **NOT** part of this web application. The platform generates and serves the permanent public URL. Platform owners can manually program this single permanent URL into physical NFC cards or print it on QR materials outside this software.

---

## Key Features

- **Permanent Public Business URL (`/b/:slug`)**: Unique, immutable slug generated upon profile creation that never breaks or changes when links are updated.
- **Dynamic Link Builder**: Add, edit, delete, toggle active/hidden, and reorder (up/down) any destination link (Website, Instagram, WhatsApp, Facebook, Google Reviews, Google Maps, External Payment links, Booking, Menus, Admission Forms, or Custom URLs).
- **Mobile-First Customer Page**: Clean, modern, high-converting public landing page featuring business branding, quick action contact buttons (Call, Email, Directions), active dynamic links, and optional verified sponsor/partner section.
- **Honest Analytics Only**: Real recorded profile visits and link clicks with 0 fake numbers. Includes date filters (Today, 7 Days, 30 Days, All Time), click-through rate, timeline activity chart, and clicks broken down by individual link and category.
- **QR Code Center**: Real-time vector QR code generator with high-resolution PNG download, Vector SVG download, and printable display cards.
- **Real Supabase Auth & Row Level Security (RLS)**: Full PostgreSQL schema with strict RLS policies ensuring business owners only access their own data, public customers only view active profiles and links, and admins have role-based controls.
- **Partner / Sponsor System**: Admin-managed sponsor system that displays on customer pages only when configured.
- **Zero-Friction Local Mode**: Seamlessly works out-of-the-box locally with persistent browser storage simulation when Supabase credentials are not yet configured, and automatically switches to live Supabase backend when environment variables are set.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4
- **Routing**: React Router 7
- **Backend & Database**: Supabase, PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Icons**: Lucide Icons
- **QR Engine**: `qrcode.react` (SVG & Canvas renderer)

---

## Folder Structure

```
PersonToPerson/
├── dist/                          # Production build output
├── public/                        # Static assets & favicon
├── src/
│   ├── assets/                    # Project logos & images
│   ├── components/
│   │   ├── business/              # Business profile, link items, QR, & analytics charts
│   │   │   ├── AnalyticsChart.tsx # Honest timeline & link click distribution
│   │   │   ├── LinkItemRow.tsx    # Reordering, active toggle, edit/delete row
│   │   │   ├── linkIcons.tsx      # Type configs & SVG icons for all link categories
│   │   │   ├── LinkModal.tsx      # Modal for adding/editing dynamic links
│   │   │   └── QRCodeCard.tsx     # High-res QR code generator & PNG/SVG downloader
│   │   ├── common/                # Reusable UI library (Button, Input, Card, Modal, etc.)
│   │   │   ├── Alert.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/                # Layout wrappers
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── DashboardLayout.tsx# Top permanent URL banner & navigation
│   │   │   └── Navbar.tsx         # Responsive navbar with DB status indicator
│   │   └── public/                # Public customer view components
│   │       ├── PublicLinkCard.tsx # Clickable link card with analytics trigger
│   │       ├── PublicProfileView.tsx # Mobile-first customer page
│   │       └── SponsorCard.tsx    # Partner / Sponsor display
│   ├── context/
│   │   └── AuthContext.tsx        # React authentication & business session provider
│   ├── lib/
│   │   ├── mockData.ts            # Seed demo data for instant local evaluation
│   │   ├── supabase.ts            # Supabase client & environment configuration check
│   │   └── utils.ts               # URL normalization, slug generation, clipboard helpers
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx # Registered business registry & status management
│   │   │   └── SponsorsManager.tsx# Platform sponsor creation & assignment
│   │   ├── auth/
│   │   │   ├── ForgotPassword.tsx # Password reset request
│   │   │   ├── Login.tsx          # Business owner sign in
│   │   │   ├── ResetPassword.tsx  # Secure password update
│   │   │   └── SignUp.tsx         # Account registration
│   │   ├── dashboard/
│   │   │   ├── AnalyticsPage.tsx  # Honest metrics, timeline, and link performance
│   │   │   ├── BusinessProfile.tsx# Business profile setup with locked permanent slug
│   │   │   ├── LinksManager.tsx   # Dynamic link builder (add, edit, reorder, delete)
│   │   │   ├── Overview.tsx       # Quick stats, recent links, and QR card
│   │   │   ├── QRCodeCenter.tsx   # QR download center & print view
│   │   │   └── SettingsPage.tsx   # Account details & credentials management
│   │   ├── public/
│   │   │   └── PublicProfilePage.tsx # Route /b/:slug with automated visit tracking
│   │   ├── Home.tsx               # Production landing page
│   │   └── NotFound.tsx           # 404 page
│   ├── routes/
│   │   ├── AdminRoute.tsx         # Role-based admin route guard
│   │   ├── AppRoutes.tsx          # Full client-side routing tree
│   │   └── ProtectedRoute.tsx     # Authenticated business owner route guard
│   ├── services/
│   │   ├── analyticsService.ts    # Visits, clicks, CTR, and date filtering
│   │   ├── authService.ts         # Supabase Auth integration
│   │   ├── businessService.ts     # Business profiles and immutable slug logic
│   │   ├── linkService.ts         # Dynamic link CRUD and reordering
│   │   ├── sponsorService.ts      # Sponsor management and business association
│   │   └── store.ts               # Local state persistence layer
│   ├── types/
│   │   └── index.ts               # Comprehensive TypeScript definitions
│   ├── App.tsx                    # Root application component
│   ├── index.css                  # Tailwind CSS base styles & themes
│   └── main.tsx                   # React DOM entry point
├── supabase/
│   ├── schema.sql                 # Complete PostgreSQL schema, tables, triggers & RLS
│   └── seed.sql                   # Optional seed data
├── .env.example                   # Environment variable template
├── package.json                   # Dependencies and build scripts
├── tsconfig.app.json              # TypeScript compilation config
└── vite.config.ts                 # Vite bundler & Tailwind configuration
```

---

## Database & Supabase Setup

### 1. Create a Supabase Project
1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. In the Supabase Dashboard, go to **SQL Editor**.
3. Open the file [`supabase/schema.sql`](file:///c:/Users/Jyoti%20Kumari/Desktop/PersonToPerson/supabase/schema.sql) in this repository and paste its entire contents into the SQL Editor.
4. Click **Run**. This will create:
   - `profiles` table (linked to `auth.users`)
   - `businesses` table with unique `slug` index
   - `business_links` table with display order indexes
   - `analytics_events` table for tracking visits, clicks, and sponsor interactions
   - `sponsors` and `business_sponsors` tables
   - Auto-updating `updated_at` triggers and user creation triggers
   - Full Row Level Security (RLS) policies

### 2. Environment Variables Configuration
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your Supabase project credentials in `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...your-publishable-key
VITE_APP_URL=http://localhost:5173
```

> **Note**: Never expose your `service_role` secret key. The application only requires the browser-safe publishable key (`VITE_SUPABASE_PUBLISHABLE_KEY`).

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173/`.

### 3. Default Demo Accounts
If running in local mode before connecting Supabase:
- **Admin & Demo Business**: `admin@persontoperson.local` / `password123`
- **Demo Public Business URL**: `http://localhost:5173/b/lumina-artisan-bistro`

---

## Production Build & Verification

To verify TypeScript and compile the optimized production bundle:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

---

## Deployment Instructions

### Deploy to Vercel
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase browser-safe publishable key
   - `VITE_APP_URL`: Your production domain (e.g. `https://yourdomain.com`)
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Click **Deploy**.

### Single-Page App (SPA) Rewrites
Ensure all routes (like `/b/:slug` and `/dashboard/*`) route to `index.html`. For Vercel, a `vercel.json` file can be added:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Security & Verification Summary

1. **Row Level Security (RLS)**: Enforced directly at the database layer. Public users can only read active business profiles and links. Business owners can only manage their own records.
2. **Safe Redirections**: All external URLs are validated and opened with `rel="noopener noreferrer"` to prevent reverse tabnabbing.
3. **Immutable Public URLs**: Slugs are permanent and cannot be modified inadvertently through profile update forms.
4. **Honest Metrics**: Visit and click events are stored as genuine entries in `analytics_events`. If a business has zero visits, it displays `0`.
