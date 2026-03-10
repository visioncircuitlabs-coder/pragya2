# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pragya is a full-stack career assessment platform ("India's Pioneer Youth-Developed Career Ecosystem") that helps students and job seekers discover career paths through AI-powered assessments. Users complete a multi-module assessment, scores are computed, Google Gemini generates insights, and a PDF report is produced.

### Important Deployment Notes
- **Employer feature is HIDDEN** from all user-facing UI (navbar, footer, services, CTA, register page). The backend `EMPLOYER` role + `/employer-portal` page still exist but are not linked anywhere. Re-enable after Razorpay approval and server deployment.
- **All CTA buttons** (Services, CTASection, Pricing) route to `/register` for a clean payment workflow: Register → Pay via Razorpay → Take Assessment → Get Report.
- **"360°" branding removed** — product is now just "Career Assessment" / "Employability Assessment" / "PRAGYA" everywhere.
- **Registration is CLOSED** — the `POST /auth/register` endpoint returns 403 and the `/register` page shows a "Coming Soon" message. This is temporary for Razorpay verification phase. Two demo accounts exist in the DB (see below). Re-enable by: (1) removing the `throw ForbiddenException` in `auth.controller.ts` register method and uncommenting `this.authService.register(dto)`, (2) restoring the original register page from git history (`git show HEAD~1:client/src/app/register/page.tsx`).
- **Demo accounts** (for Razorpay verification): `testjobseeker@pragya.in` / `Test@1234` (JOB_SEEKER, completed), `teststudent@pragya.in` / `Test@1234` (STUDENT, completed).
- **14 batch student accounts** — **DO NOT DELETE these accounts or their data from the database.** These are real users. Created via seed script (`server/prisma/seed-batch-students.ts` / `.cjs`). Login uses phone number as identifier — email format is `{phone}@pragya.in`, password is `Student@1234`. The login page auto-detects 10-digit Indian phone numbers and appends `@pragya.in`. Full list:
  1. Sajitha — 7510941782
  2. Rajitha — 9947789673
  3. Nisha Udhayan — 9747189699
  4. Kalaranjini — 9744494672
  5. Bindhu Sreeraman — 8606402014
  6. Beena K — 8157815033
  7. Samitha — 9544691652
  8. Sulu Sadheesh — 9747135695
  9. Savithri — 9747497285
  10. Subha — 9207250732
  11. Leela — 9605731527
  12. Manju — 9847742012
  13. Divya — 8086155399
  14. Reji — 7559801037
- **Login page accepts phone numbers** — `client/src/app/login/page.tsx` detects 10-digit numbers starting with 6-9 (regex: `/^[6-9]\d{9}$/`) and auto-appends `@pragya.in` before calling the API. Normal email login still works.
- **`sanitizeUser` hoists `fullName`** — `server/src/auth/auth.service.ts` extracts `fullName` from `studentProfile`, `jobSeekerProfile`, or `employerProfile` so the dashboard shows the user's real name instead of the email prefix (critical for phone-based users who would otherwise see their phone number).
- **Student assessment redirects to dedicated results page** — `/students/assessment` no longer shows inline results. After completing or if already completed, it redirects to `/assessment/results/[id]` which has charts, RIASEC radar, AI insights, sector matches, and proper PDF download.
- **Assessment auto-saves every answer** — `handleSelectOption` in `/students/assessment` fires a background `POST /assessments/save-progress` on every answer selection. The server upserts the `UserResponse` and updates `lastQuestionIndex`. On resume, the page restores all saved answers and jumps to the last question. No "Jump to Question" grid — navigation is strictly via Prev/Next buttons with mandatory cool-off breaks between sections.
- **Assessment intro page** — `/students/assessment` shows a redesigned intro with "Discover Your True Career Direction" heading, 4 session overview cards (Aptitude 60q, Interest 48q, Personality 36q, Skill 36q), estimated time, and numbered instructions before starting.
- **Results page uses simple language** — Section headers use student-friendly labels: "What Interests You" (not "Career Interests (RIASEC)"), "Your Thinking Skills" (not "Aptitude Scores"), "Your Personality", "Best Career Fields for You", "What Your Results Mean". All scores display as percentages (e.g., "85%"). Personality section has expandable trait insight cards (6 traits × 3 levels with description, career connection, and tips).
- **Email verification is DISABLED** — new users are auto-verified on registration. The full OTP flow (6-digit code, 10-min expiry, brute-force protection, `/verify-email` page) is still in the codebase but bypassed. Re-enable by: (1) uncommenting OTP generation in `auth.service.ts` register method, (2) removing the auto-verify `prisma.user.update`, (3) changing register redirect back to `/verify-email`, (4) restoring the unverified-user redirect in dashboard, (5) re-adding `EmailVerifiedGuard` to `users.controller.ts`.

## Commands

### Development
```bash
npm install                          # Install all workspace dependencies
npm run dev                          # Start client (3001) + server (4000) concurrently
npm run dev:client                   # Start Next.js frontend only (port 3001)
npm run dev:server                   # Start NestJS backend only (port 4000)
npm run docker:up                    # Start PostgreSQL 16 + Redis 7 containers
npm run docker:down                  # Stop Docker services
```

### Build & Lint
```bash
npm run build                        # Build all workspaces
npm run build:client                 # Build Next.js frontend
npm run build:server                 # Build NestJS backend (nest build)
npm run lint                         # Lint all workspaces
cd client && npm run lint            # Lint frontend (eslint-config-next)
cd server && npm run lint            # Lint backend (eslint --fix)
```

### Testing
```bash
cd server && npm test                # Run Jest tests (*.spec.ts files in src/)
cd server && npx jest --watch        # Watch mode
cd server && npx jest path/to/file.spec.ts  # Run a single test file
cd server && npm run test:cov        # Coverage report
```

### Database (Prisma)
```bash
cd server && npx prisma migrate dev  # Apply migrations (dev)
cd server && npx prisma studio       # Open database GUI (browser)
cd server && npx prisma generate     # Regenerate Prisma client after schema changes
```

## Architecture

### Monorepo Structure (npm workspaces)
- **`client/`** — Next.js 16 (App Router, React 19, Tailwind CSS v4). Port 3001.
- **`server/`** — NestJS 10 (TypeScript, Prisma 5, PostgreSQL). Port 4000. All API routes prefixed with `/api/v1`.
- **`shared/`** — TypeScript type definitions (`@pragya/shared`) imported by both client and server. Contains DTOs and type contracts for User, Assessment, Job, Payment, and Common types.

### Backend Module Structure (`server/src/`)
Each NestJS module follows the standard controller → service → module pattern:
- **`auth/`** — JWT authentication with access + refresh tokens (Passport strategy). Guards: `JwtAuthGuard`, `RolesGuard`, `EmailVerifiedGuard`. Decorators: `@CurrentUser()`, `@Roles()`.
- **`assessments/`** — Core business logic. `AssessmentsService` handles CRUD and submission flow. `ScoringService` computes scores per module. `CareersService` matches users to 50+ careers by RIASEC codes + aptitude thresholds. `SectorMatchingService` maps careers to industry sectors.
- **`ai-analysis/`** — Google Gemini 1.5 Flash integration. Prompt templates in `prompts/` (separate for job-seeker and student). Has a comprehensive rule-based fallback when Gemini is unavailable.
- **`reports/`** — PDF generation using `@react-pdf/renderer`. Student reports are 6 English pages with inline Manglish (Malayalam+English) insights after each major section — no separate Malayalam pages. Generated dynamically from actual scores via `generateInlineMl()` and rendered with `InlineMalayalam` component (green background, NotoSansMalayalam font). Templates: `student-report.ts` (students), `jobseeker-report.ts` (job seekers). Shared styles/fonts/charts in `pdf-styles.ts`, `pdf-charts.ts`, `i18n.ts`. Stale AI detection auto-regenerates insights on download. Scores are labeled as percentiles (e.g., "85th percentile") throughout.
- **`email/`** — Nodemailer service. Console-only in dev (SMTP not configured yet).
- **`prisma/`** — PrismaService wraps `@prisma/client` as a NestJS injectable.
- **`logger/`** — Winston-based structured logging with request correlation IDs and automatic sensitive data redaction.

### Frontend Structure (`client/src/`)
- **`app/`** — Next.js App Router pages. Key routes: `/assessment` (wizard), `/assessment/results/[id]` (results dashboard), `/career-library`, `/login`, `/register`, `/dashboard`.
- **`components/`** — Shared React components (Navbar, Footer, Hero, Services, FAQ, etc.).
- **`context/AuthContext.tsx`** — Client-side auth state via React Context. Stores JWT tokens in localStorage.
- **`lib/api.ts`** — Axios instance with automatic token attachment and 401 refresh interceptor. Base URL: `NEXT_PUBLIC_API_URL` or `http://localhost:4000/api/v1`.

### Assessment Pipeline
1. User starts assessment → `POST /assessments/:id/start`
2. Each answer auto-saved in real-time → `POST /assessments/save-progress` (fire-and-forget from client, upserts `UserResponse` + updates `lastQuestionIndex`). Users can close the browser and resume later from exactly where they left off.
3. Mandatory cool-off breaks between sections: 2-minute breaks between aptitude subsections, 5-minute breaks between main modules (Aptitude→Interest→Personality→Skill). Full-screen overlay with countdown timer, "Continue" button disabled until timer completes. Break state tracked in `completedBreaks` Set to prevent re-triggering.
4. User submits → `POST /assessments/:id/submit`
5. Server runs `ScoringService` (4 modules: Aptitude→percentile per section, RIASEC→Holland Code, Employability→weighted percentile, Personality→trait averages with Strong/Moderate/Emerging levels)
6. `AiAnalysisService` calls Gemini with scoring data → generates 12 insight fields
7. Results returned → `GET /assessments/:id/results`
8. PDF report generated on demand → `GET /reports/:assessmentId/download`

### Database
PostgreSQL via Prisma ORM. Schema at `server/prisma/schema.prisma`. Key models: `User` (with role-specific profiles: Student/JobSeeker/Employer), `Assessment` → `Question` → `Option`, `UserAssessment` (scores + AI insights stored as JSON fields), `UserResponse`, `Career`. Unique constraint on `[userId, assessmentId]` prevents duplicate attempts.

Seed scripts in `server/prisma/`: `seed-assessments.ts` (job seeker questions), `seed-student-assessment.ts`, `seed-careers.ts` (50+ careers with RIASEC codes), `seed-batch-students.ts` / `.cjs` (14 batch student accounts with phone-based login).

### Key Conventions
- Server path alias: `@/*` maps to `src/*` (in both client and server tsconfig)
- Backend uses `class-validator` on all DTOs with global `ValidationPipe` (whitelist + forbidNonWhitelisted + transform)
- Global rate limiting via `@nestjs/throttler`: 100 req/min default, 10 req/min for auth endpoints
- Security middleware stack: Helmet, compression, CORS (localhost:3001 in dev)
- User roles: `STUDENT`, `JOB_SEEKER`, `EMPLOYER`, `ADMIN` (enum in Prisma schema)
- All IDs use CUID (`@default(cuid())`)
- Frontend fonts: Nunito (primary), Noto Sans Malayalam, Samarkan (brand logo)

### Environment
Server requires `server/.env` (see `server/.env.example`). Key vars: `DATABASE_URL` (Neon PostgreSQL), `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GEMINI_API_KEY`, `PORT` (4000), `FRONTEND_URL` (http://localhost:3001).

## Production Deployment

### Live URL
- **Domain**: https://pragyacareer.com
- **VPS**: Hostinger KVM 1, IP `72.60.237.208`, Ubuntu 24.04, 4GB RAM, 1 vCPU
- **SSL**: Let's Encrypt (auto-renews via Certbot)

### Architecture
```
Internet → [Nginx :80/:443]
              ├── /health     → [NestJS Server :4000]
              ├── /api/v1/*   → [NestJS Server :4000] → Neon Cloud PostgreSQL
              │                       └── [Redis :6379]
              └── /*          → [Next.js Client :3001]
```

### Docker Compose Setup (5 containers)
| Container | Image | Purpose | Memory Limit |
|-----------|-------|---------|-------------|
| `pragya-nginx` | nginx:1.25-alpine | Reverse proxy, SSL, rate limiting | — |
| `pragya-server` | pragya-server (custom) | NestJS API | 1.5GB |
| `pragya-client` | pragya-client (custom) | Next.js frontend (standalone) | 512MB |
| `pragya-redis` | redis:7-alpine | Cache (128MB max, LRU eviction) | 192MB |
| `pragya-certbot` | certbot/certbot | SSL auto-renewal sidecar | — |

Database is **NOT** in Docker — stays on Neon Cloud PostgreSQL.

### Deployment Files
- **`server/Dockerfile`** — Multi-stage build (builder→runner), node:20-alpine, includes OpenSSL + fonts
- **`client/Dockerfile`** — Multi-stage build, standalone Next.js output, includes musl native binaries for lightningcss + tailwindcss-oxide
- **`docker-compose.prod.yml`** — Production compose with bind mounts for SSL certs
- **`nginx/nginx.conf`** — Main nginx config (1 worker, gzip, rate limit zones, security headers)
- **`nginx/conf.d/default.conf`** — Site config (HTTP→HTTPS redirect, API proxy with 120s timeout, static asset caching)
- **`deploy.sh`** — VPS provisioning script (swap, UFW, fail2ban, Docker, repo clone, SSL bootstrap)
- **`.env.production.template`** — Template for production environment variables
- **`.dockerignore`** — Excludes dev artifacts from Docker context

### Production Commands (run on VPS at `/opt/pragya`)
```bash
# Deploy updates
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f              # All services
docker compose -f docker-compose.prod.yml logs -f server       # Server only
docker logs pragya-server --tail 50                             # Last 50 lines

# Restart a single service
docker compose -f docker-compose.prod.yml restart server

# Check status
docker compose -f docker-compose.prod.yml ps

# Run Prisma migrations
docker compose -f docker-compose.prod.yml run --rm --user root --entrypoint sh server -c "apk add --no-cache openssl && npx prisma migrate deploy --schema=./server/prisma/schema.prisma"

# SSL certificate renewal (auto via cron, but manual if needed)
certbot certonly --webroot -w /var/www/certbot -d pragyacareer.com -d www.pragyacareer.com --force-renewal
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Health check
curl https://pragyacareer.com/health
```

### Known Deployment Notes
- Alpine Linux requires explicit installation of musl native binaries: `lightningcss-linux-x64-musl` and `@tailwindcss/oxide-linux-x64-musl` (npm optional deps bug)
- Prisma on Alpine needs `apk add openssl` to detect libssl correctly
- The host had a pre-existing nginx on port 80 — it was stopped and disabled (`systemctl stop nginx && systemctl disable nginx`)
- SSH password auth is enabled (not disabled for convenience)
- UFW firewall allows only SSH, HTTP (80), HTTPS (443)
- `.env.production` lives on VPS at `/opt/pragya/.env.production` (not in git) — includes `DIRECT_URL` for Prisma migrations

## Post-Deployment Roadmap

### 🔥 Immediate (Week 1)

#### Re-enable Registration
Registration is currently closed for Razorpay verification. Once Razorpay approves:
1. In `server/src/auth/auth.controller.ts`: remove the `throw new ForbiddenException()` in the register method, uncomment `this.authService.register(dto)`
2. Restore original register page: `git show HEAD~1:client/src/app/register/page.tsx > client/src/app/register/page.tsx`
3. Rebuild and redeploy

#### Uptime Monitoring
Set up free monitoring to get alerted if the site goes down:
- **UptimeRobot** (https://uptimerobot.com) or **Better Stack** (https://betterstack.com)
- Monitor both `https://pragyacareer.com` and `https://pragyacareer.com/health`
- Configure email/SMS alerts for downtime

#### Verify Database Backups
- Neon PostgreSQL includes built-in backups — verify your plan includes point-in-time recovery
- Check Neon dashboard for backup retention settings

### 🛡️ Security Hardening (Week 1-2)

#### Disable Root SSH Login
Currently SSH uses root login directly. Create a regular user:
```bash
adduser deploy
usermod -aG sudo deploy
# Copy SSH key to new user
su - deploy
mkdir -p ~/.ssh
# Add your public key to ~/.ssh/authorized_keys
```
Then in `/etc/ssh/sshd_config`:
```
PermitRootLogin no
PasswordAuthentication no
```
Restart SSH: `systemctl restart sshd`

#### Enable Automatic Security Updates
```bash
apt install unattended-upgrades
dpkg-reconfigure unattended-upgrades
```
This auto-installs critical security patches on Ubuntu.

### 📈 Development (Week 2-4)

#### CI/CD Pipeline
Currently deployment is manual (`git pull` + `docker compose build` + `up -d` on VPS). Set up GitHub Actions:
- On push to `main`: SSH into VPS → pull → build → restart containers
- Consider a staging branch that deploys to a staging subdomain first
- Store VPS SSH key as a GitHub secret

#### Staging Environment
Never test directly on production. Options:
- Subdomain: `staging.pragyacareer.com` on the same VPS (different Docker Compose project + ports)
- Separate lightweight VPS for staging
- Use a separate Neon database branch for staging

#### Configure SMTP for Real Emails
The email service (`server/src/email/`) is console-only in dev. Set up a transactional email provider:
- **Resend** (https://resend.com) — free tier: 3,000 emails/month, easy API
- **SendGrid** (https://sendgrid.com) — free tier: 100 emails/day
- **AWS SES** — cheapest at scale
- Update `.env.production` with SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`)

#### Re-enable Email Verification
Once SMTP is configured, restore the OTP verification flow:
1. In `server/src/auth/auth.service.ts`: uncomment OTP generation in register method
2. Remove the auto-verify `prisma.user.update` call
3. Change register redirect back to `/verify-email`
4. Restore unverified-user redirect in dashboard
5. Re-add `EmailVerifiedGuard` to `server/src/users/users.controller.ts`

### 🚀 Growth (Month 2+)

#### Analytics
- **Google Analytics 4** — standard, free, comprehensive
- **Plausible** (https://plausible.io) — privacy-friendly alternative, no cookies, GDPR-compliant
- Add tracking script to `client/src/app/layout.tsx`

#### SEO Optimization
- Add proper meta tags (title, description, Open Graph) to all pages via Next.js `metadata` exports
- Create `public/sitemap.xml` listing all public routes
- Create `public/robots.txt` allowing search engine crawling
- Submit sitemap to Google Search Console (https://search.google.com/search-console)
- Add structured data (JSON-LD) for the career library pages

#### Performance Optimization
- Enable Redis caching for expensive API calls (career matching, AI analysis results)
- Implement CDN (Cloudflare free tier) for static assets and global edge caching
- Add `Cache-Control` headers for static assets in nginx config
- Monitor server memory/CPU via `htop` or set up Prometheus + Grafana

#### Error Tracking
- **Sentry** (https://sentry.io) — free tier: 5,000 errors/month
- Install `@sentry/nextjs` for frontend error tracking
- Install `@sentry/node` for backend error tracking
- Captures stack traces, user context, breadcrumbs for debugging production issues

#### Razorpay Integration
Once Razorpay approval is complete:
- Re-enable the employer feature in navbar, footer, services, CTA, and register page
- Test payment flow end-to-end: Register → Pay → Assessment → Report
- Set up Razorpay webhooks for payment confirmation

#### Future Features
- **Admin Dashboard** — manage users, view assessment stats, revenue tracking
- **Bulk Assessment** — allow institutions to purchase assessments for multiple students
- **API Rate Limiting per User** — more granular than global throttle
- **Report Versioning** — regenerate reports when AI model improves
- **Mobile App** — React Native wrapper or PWA for mobile users
