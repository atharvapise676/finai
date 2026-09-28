# FinAI Production Deployment Guide

## 1. Deploying to Vercel
1. Push your repository to GitHub.
2. Import the project into the Vercel dashboard.
3. Configure the following environment variables:
   - `DATABASE_URL`: Your production PostgreSQL connection string (e.g. Neon, Supabase, or AWS RDS).
   - `AUTH_SECRET`: A secure 32+ character random secret string.
   - `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude 3.5 Sonnet.
   - `NEXT_PUBLIC_APP_URL`: Your custom production domain (e.g. `https://finai.app`).
4. Set Build Command: `prisma generate && next build`
5. Click **Deploy**.

## 2. Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 3. Pre-Flight Checklist
- [x] All 12 deterministic unit tests pass (`npm test`).
- [x] Production build compiles cleanly (`npm run build`).
- [x] Database migrations are applied (`npx prisma db push`).
- [x] Environment secrets (`AUTH_SECRET`, `ANTHROPIC_API_KEY`) are protected and not committed to git.
- [x] Regulatory and compliance disclaimers are visible on every calculation page.
