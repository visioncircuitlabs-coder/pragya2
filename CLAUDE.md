# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pragya is a full-stack career assessment platform ("India's Pioneer Youth-Developed Career Ecosystem") that helps students and job seekers discover career paths through AI-powered assessments. Users complete a multi-module assessment, scores are computed, Google Gemini generates insights, and a PDF report is produced.

### Important Deployment Notes
- **Employer feature is HIDDEN** from all user-facing UI (navbar, footer, services, CTA, register page). The backend `EMPLOYER` role + `/employer-portal` page still exist but are not linked anywhere. Re-enable after Razorpay approval and server deployment.
- **All CTA buttons** (Services, CTASection, Pricing) route to `/register` for a clean payment workflow: Register → Pay via Razorpay → Take Assessment → Get Report.
- **"360°" branding removed** — product is now just "Career Assessment" / "Employability Assessment" / "PRAGYA" everywhere.
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
- **`reports/`** — PDF generation using `@react-pdf/renderer`. Generates 4-page reports server-side. Stale AI detection auto-regenerates insights on download.
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
2. Answers saved progressively → `POST /assessments/:id/progress` (stop & resume support)
3. User submits → `POST /assessments/:id/submit`
4. Server runs `ScoringService` (4 modules: Aptitude→% per section, RIASEC→Holland Code, Employability→weighted %, Personality→trait averages)
5. `AiAnalysisService` calls Gemini with scoring data → generates 12 insight fields
6. Results returned → `GET /assessments/:id/results`
7. PDF report generated on demand → `GET /reports/:assessmentId/download`

### Database
PostgreSQL via Prisma ORM. Schema at `server/prisma/schema.prisma`. Key models: `User` (with role-specific profiles: Student/JobSeeker/Employer), `Assessment` → `Question` → `Option`, `UserAssessment` (scores + AI insights stored as JSON fields), `UserResponse`, `Career`. Unique constraint on `[userId, assessmentId]` prevents duplicate attempts.

Seed scripts in `server/prisma/`: `seed-assessments.ts` (job seeker questions), `seed-student-assessment.ts`, `seed-careers.ts` (50+ careers with RIASEC codes).

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
