# 21|Twenty One

Heal Your Attachment, Build Healthy Relationships - A 21-day healing program.

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS
- **Backend**: Convex (real-time database, serverless functions)
- **Payments**: Stripe
- **Email**: Resend

## Development

```bash
# Install dependencies
npm install

# Start development (Next.js + Convex)
npm run dev

# Or run separately
npm run dev:client    # Next.js only
npm run convex:dev    # Convex only
```

## Environment Variables

### Local (.env.local in apps/client/)
```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Convex Dashboard
Set these in the Convex dashboard:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `CLIENT_URL`

## Deployment

The site is deployed on Vercel with automatic deployments from the main branch.

```bash
# Deploy Convex
npm run convex:deploy
```
