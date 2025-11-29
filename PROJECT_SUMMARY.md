# Matcha - Project Summary

## Overview
Matcha is an AI-powered psychological profiling SaaS application that analyzes users' thought patterns, identifies cognitive biases, and provides personalized insights.

---

## Tech Stack

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Authentication**: Clerk (@clerk/nextjs)
- **Language**: TypeScript
- **i18n**: Custom implementation (English/French)

### Backend (NestJS)
- **Framework**: NestJS 10
- **Database ORM**: Prisma 5
- **Queue**: BullMQ with Redis
- **Authentication**: Clerk JWT verification
- **Storage**: Cloudflare R2 (S3-compatible)
- **AI**: Mock AI Provider (ready for OpenRouter integration)

### Database & Infrastructure
- **Database**: PostgreSQL (Render)
- **Cache/Queue**: Redis (Upstash)
- **Object Storage**: Cloudflare R2
- **Auth Provider**: Clerk

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Next.js App    │────▶│  NestJS API     │────▶│  PostgreSQL     │
│  (Vercel)       │     │  (Render)       │     │  (Render)       │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
            ┌───────────┐ ┌───────────┐ ┌───────────┐
            │  Redis    │ │  Clerk    │ │  R2       │
            │ (Upstash) │ │  (Auth)   │ │ (Storage) │
            └───────────┘ └───────────┘ └───────────┘
```

---

## Deployment URLs

| Service | URL | Platform |
|---------|-----|----------|
| **Frontend** | https://vematcha-client.vercel.app | Vercel |
| **API** | https://matcha-api-akyb.onrender.com | Render |
| **API Health** | https://matcha-api-akyb.onrender.com/api/health | Render |

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | No |
| GET | `/api/plans` | Get pricing plans | No |
| GET | `/api/users/me` | Get current user | Yes |
| PATCH | `/api/users/me` | Update user profile | Yes |
| GET | `/api/dashboard` | Get dashboard data | Yes |
| POST | `/api/analyses` | Create new analysis | Yes |
| GET | `/api/analyses` | List user analyses | Yes |
| GET | `/api/analyses/:id` | Get single analysis | Yes |
| POST | `/api/webhooks/clerk` | Clerk webhook handler | Webhook |

---

## Features Implemented

### Phase 1-5: Backend
- [x] NestJS project setup with TypeScript
- [x] PostgreSQL database with Prisma ORM
- [x] User authentication with Clerk JWT
- [x] User management (create, update, get)
- [x] Analysis system with BullMQ queue processing
- [x] Mock AI provider for testing
- [x] Dashboard aggregation endpoint
- [x] Usage limits (3 analyses/month for free tier)
- [x] Cloudflare R2 storage integration
- [x] Clerk webhook for user sync

### Phase 6: Frontend Integration
- [x] Clerk authentication (SignIn, SignUp, UserButton)
- [x] Protected routes with middleware
- [x] API client with token authentication
- [x] Dashboard fetching real data from API
- [x] Fallback to sample data when API unavailable

### Deployment
- [x] API deployed to Render
- [x] Frontend deployed to Vercel
- [x] Database on Render PostgreSQL
- [x] Redis on Upstash

---

## Services & Pricing

### Currently Using (Free Tiers)

| Service | Free Tier Limits | What Happens After |
|---------|------------------|-------------------|
| **Vercel** | 100GB bandwidth, Hobby plan | Pro: $20/month |
| **Render** | 750 hours/month (spins down after 15min inactivity) | Starter: $7/month |
| **Render PostgreSQL** | 90 days, 1GB storage | Starter: $7/month |
| **Upstash Redis** | 10,000 commands/day, 256MB | Pay-as-you-go: ~$0.2/100K commands |
| **Clerk** | 10,000 MAU | Pro: $25/month + $0.02/MAU |
| **Cloudflare R2** | 10GB storage, 1M requests | $0.015/GB storage, $0.36/million requests |

### Future Services (Not Yet Integrated)

| Service | Purpose | Pricing |
|---------|---------|---------|
| **OpenRouter** | AI API (Claude, GPT, etc.) | Pay-per-token (~$0.01-0.03/1K tokens) |
| **Stripe** | Payments | 2.9% + $0.30 per transaction |

---

## Estimated Monthly Costs

### Development/Testing Phase
**$0/month** - All services within free tiers

### Small Scale (100-500 users)
| Service | Cost |
|---------|------|
| Vercel | $0 (free tier) |
| Render API | $7/month |
| Render PostgreSQL | $7/month |
| Upstash Redis | $0-5/month |
| Clerk | $0 (under 10K MAU) |
| Cloudflare R2 | $0-2/month |
| **Total** | **~$15-20/month** |

### Medium Scale (1,000-5,000 users)
| Service | Cost |
|---------|------|
| Vercel Pro | $20/month |
| Render API | $25/month (Standard) |
| Render PostgreSQL | $25/month |
| Upstash Redis | $10-20/month |
| Clerk | $25 + usage |
| Cloudflare R2 | $5-10/month |
| OpenRouter AI | $50-200/month |
| **Total** | **~$160-325/month** |

---

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_API_URL=https://matcha-api-akyb.onrender.com/api
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
REDIS_URL=rediss://...
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://vematcha-client.vercel.app
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx
R2_ACCOUNT_ID=xxx
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=matcha-storage
```

---

## Future Phases (TODO)

### Phase 7: Real AI Integration
- [ ] Replace Mock AI with OpenRouter
- [ ] Implement Claude/GPT for psychological analysis
- [ ] Add conversation history for context

### Phase 8: Payments
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Pro tier upgrade flow
- [ ] Usage-based billing

### Phase 9: Advanced Features
- [ ] PDF report export
- [ ] Progress tracking over time
- [ ] Email notifications
- [ ] Admin dashboard

---

## Local Development

```bash
# Install dependencies
npm install

# Start PostgreSQL & Redis (or use cloud services)
docker-compose up -d

# Run database migrations
npm run prisma:migrate

# Start API (Terminal 1)
npm run dev:api

# Start Frontend (Terminal 2)
npm run dev

# Access
# Frontend: http://localhost:3000
# API: http://localhost:4000
# Health: http://localhost:4000/api/health
```

---

## Useful Commands

```bash
# Database
npm run prisma:studio    # Open Prisma Studio (DB viewer)
npm run prisma:migrate   # Run migrations
npm run prisma:generate  # Regenerate Prisma client

# Development
npm run dev              # Start frontend
npm run dev:api          # Start API
npm run dev:all          # Start both

# Build
npm run build            # Build frontend
npm run build:api        # Build API
```

---

## Repository Structure

```
vematcha/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── prisma/          # Database schema & migrations
│   │   └── src/
│   │       ├── modules/     # Feature modules
│   │       │   ├── auth/    # Authentication
│   │       │   ├── users/   # User management
│   │       │   ├── analyses/# AI analysis
│   │       │   ├── dashboard/
│   │       │   ├── plans/   # Pricing plans
│   │       │   └── webhooks/# Clerk webhooks
│   │       └── providers/   # External services
│   │           ├── ai/      # AI provider (Mock/OpenRouter)
│   │           ├── queue/   # BullMQ
│   │           └── storage/ # R2 storage
│   │
│   └── client/              # Next.js Frontend
│       └── src/
│           ├── app/         # App router pages
│           ├── components/  # React components
│           ├── hooks/       # Custom hooks
│           └── lib/         # Utilities & API client
│
├── docker-compose.yml       # Local PostgreSQL & Redis
├── package.json             # Root workspace config
└── PROJECT_SUMMARY.md       # This file
```

---

## Support & Resources

- **Clerk Docs**: https://clerk.com/docs
- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Upstash Docs**: https://upstash.com/docs

---

*Last updated: November 29, 2024*
