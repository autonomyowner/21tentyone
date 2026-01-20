# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

21|Twenty One is a SaaS application for a 21-day attachment healing program. Built as a monorepo with a Next.js 16 frontend and Convex real-time backend.

## Commands

```bash
# Development (starts Next.js + Convex concurrently)
npm run dev

# Individual services
npm run dev:client      # Next.js only (with Turbopack)
npm run convex:dev      # Convex backend only

# Build & Production
npm run build           # Build Next.js app
npm run start           # Start production server
npm run lint            # Run ESLint

# Convex Deployment
npm run convex:deploy   # Deploy Convex functions to production
cd apps/client && npx convex deploy --yes  # Direct deploy with auto-confirm
```

## Architecture

### Stack
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- **Backend**: Convex (real-time database + serverless functions)
- **Payments**: Stripe (checkout sessions, webhooks)
- **Email**: Resend (transactional emails)
- **Deployment**: Vercel (frontend) + Convex Cloud (backend)

### Directory Structure
```
apps/client/
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── admin/     # Admin dashboard (protected)
│   │   ├── quiz/      # Attachment style quiz
│   │   ├── checkout/  # Stripe payment flow
│   │   └── the-twenty-one/  # Main healing program
│   ├── components/    # React components
│   │   ├── admin/     # Dashboard UI (MetricCard, RevenueChart, etc.)
│   │   └── healing/   # Journey UI components
│   ├── hooks/         # useConvexAdmin.ts, useHealingJourney.ts
│   └── lib/           # convex.tsx provider, types, translations
├── convex/            # Backend functions
│   ├── schema.ts      # Database schema (customers, products, purchases, leads, emailLogs)
│   ├── stripe.ts      # Checkout sessions, webhook handling
│   ├── admin.ts       # Dashboard metrics queries
│   ├── adminAuth.ts   # Simple env-based admin login
│   ├── customers.ts   # Customer CRUD
│   ├── purchases.ts   # Purchase tracking
│   ├── leads.ts       # Quiz submission capture
│   ├── email.ts       # Resend email sending
│   └── http.ts        # Webhook HTTP endpoints
```

### Data Flow
1. **Quiz → Leads**: Quiz submissions save to `leads` table via `leads.createFromQuiz`
2. **Checkout → Purchase**: Stripe checkout creates session → webhook → creates customer + purchase
3. **Purchase → Email**: Completed purchase triggers product delivery email via Resend
4. **Admin Dashboard**: Real-time queries from Convex display metrics, customers, leads, purchases

### Authentication
- **Admin**: Simple env-based auth (ADMIN_USERNAME, ADMIN_PASSWORD in Convex)
- **No user auth**: Product is single-purchase, no user accounts needed

## Environment Variables

**Local** (`apps/client/.env.local`):
```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

**Convex Dashboard** (not in code):
```
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
RESEND_API_KEY, EMAIL_FROM
CLIENT_URL
ADMIN_USERNAME, ADMIN_PASSWORD
```

## Convex Schema

Key tables with important indexes:
- `customers` (by_email, by_stripeCustomerId)
- `products` (by_slug, by_active) - prices in cents
- `purchases` (by_customerId, by_status, by_stripeCheckoutSessionId)
- `leads` (by_email, by_source, by_createdAt)
- `emailLogs` (by_status, by_purchaseId)

## Key Patterns

### Convex Actions vs Queries
- **Queries**: Read-only, real-time subscribed (e.g., `admin.getMetrics`)
- **Mutations**: Write operations (e.g., `leads.createFromQuiz`)
- **Actions**: External API calls, use `"use node"` directive (e.g., `stripe.createCheckoutSession`)

### Admin Hooks
Import from `@/hooks/useConvexAdmin`:
```typescript
useDashboardMetrics(), useRevenue(period), useCustomers(),
useLeadsStats(), useRecentLeads(), usePurchases()
```

### Stripe Webhook Flow
`http.ts` receives webhook → validates signature → `stripe.handleWebhookEvent` → creates/updates purchase → triggers email

## Deployment Notes

- Vercel auto-deploys from main branch
- Convex changes require `npm run convex:deploy` before git push
- Two Convex deployments: `adorable-goldfish-805` (dev), `charming-greyhound-488` (prod)
