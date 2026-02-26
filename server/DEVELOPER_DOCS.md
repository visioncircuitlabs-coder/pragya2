# Pragya Backend - Developer Documentation

> Last Updated: 2026-02-25

## 🔐 Credentials & Connection Strings

### Database (Neon Cloud PostgreSQL)
| Property | Value |
|----------|-------|
| Provider | [Neon](https://neon.tech) |
| Region | `ap-southeast-1` (Singapore) |
| Database | `neondb` |
| Connection String | `postgresql://neondb_owner:npg_1N6CsIOSDFQr@ep-plain-meadow-a13v7dvm-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |

### JWT Configuration
| Property | Value |
|----------|-------|
| Secret | `pragya-jwt-secret-change-in-production-2024` |
| Access Token Expiry | 15 minutes |
| Refresh Token Expiry | 7 days |

### Server
| Property | Value |
|----------|-------|
| Port | `4000` |
| API Base URL | `http://localhost:4000/api/v1` |
| Frontend URL | `http://localhost:3001` |

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 20+ |
| Framework | NestJS 10.x |
| ORM | Prisma 5.x |
| Database | PostgreSQL 17 (Neon Cloud) |
| Auth | JWT + Passport |
| Hashing | bcryptjs |
| Validation | class-validator |
| Email | Nodemailer (console mode for dev) |
| AI Analysis | Google Gemini 1.5 Flash |
| PDF Generation | @react-pdf/renderer |
| Frontend | Next.js 16 (Turbopack) |

---

## 👥 User Roles

| Role | Description |
|------|-------------|
| `STUDENT` | School students (10th-12th) for 360° Career Assessment |
| `JOB_SEEKER` | Graduates for 360° Employability Assessment |
| `EMPLOYER` | Companies using Job Portal |
| `ADMIN` | Platform administrators |
| `SUPER_ADMIN` | ⏳ *Planned* — Full platform control, sales analytics, manages all roles |
| `SALES_AGENT` | ⏳ *Planned* — Sales staff with personal referral codes, own dashboard |
| `EMPLOYEE` | ⏳ *Planned* — Company employees registered via company referral codes |

---

## 🔌 API Endpoints

### Authentication (`/api/v1/auth`)
```
POST /register     - Register new user
POST /login        - Login, returns JWT tokens  
POST /refresh      - Refresh access token
POST /logout       - Invalidate tokens
POST /verify-email - Verify email with token
POST /resend-verification - Resend verification email
GET  /me           - Get current user (protected)
```

### Users (`/api/v1/users`)
```
GET   /profile              - Get own profile
PATCH /profile/student      - Update student profile (STUDENT only)
PATCH /profile/job-seeker   - Update job seeker profile (JOB_SEEKER only)
PATCH /profile/employer     - Update employer profile (EMPLOYER only)
GET   /admin/list           - List all users (ADMIN only)
PATCH /admin/:id/toggle-status - Toggle user active status (ADMIN only)
```

### Assessments (`/api/v1/assessments`)
```
GET  /                    - List available assessments
POST /:id/start           - Start an assessment attempt
GET  /:id/questions        - Get questions (with saved answers if resuming)
POST /:id/progress         - Save answer progress (auto-save)
POST /:id/submit           - Submit completed assessment for scoring
GET  /:id/results          - Get assessment results + AI insights
```

### Reports (`/api/v1/reports`)
```
GET /:assessmentId/download - Generate & download PDF report
```

---

## 📁 Project Structure

```
server/
├── .env                    # Environment variables (DO NOT COMMIT)
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── nest-cli.json           # NestJS CLI config
├── reports/                # Generated PDF files (gitignored)
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed-assessments.ts # Assessment question seed data
└── src/
    ├── main.ts             # App bootstrap
    ├── app.module.ts       # Root module
    ├── prisma/             # Database connection
    ├── auth/               # JWT auth, guards, strategies
    ├── users/              # User profiles (student, job-seeker, employer)
    ├── email/              # Email service (Nodemailer)
    ├── assessments/        # Assessment CRUD, scoring, submission
    │   ├── assessments.service.ts   # Core scoring logic
    │   └── scoring.service.ts       # RIASEC, aptitude, employability scoring
    ├── ai-analysis/        # AI-powered career insights
    │   └── ai-analysis.service.ts   # Gemini API + comprehensive fallback
    ├── reports/            # PDF report generation
    │   ├── reports.service.ts       # @react-pdf/renderer layout + styles
    │   └── reports.controller.ts    # Download endpoint
    ├── careers/            # Career matching algorithm
    └── logger/             # Structured logging service
```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
cd server && npm install

# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev

# Start development server
npm run dev

# View database in browser
npx prisma studio
```

---

## 🔒 Security Features

- **Password hashing**: bcrypt with 12 rounds
- **JWT tokens**: Short-lived access (15m) + refresh tokens (7d)
- **Email verification**: Required for critical actions, not login
- **Role-based access**: Guards protect routes by role
- **Input validation**: class-validator on all DTOs

---

## 📊 Assessment Scoring Design

> Reference for how the Pragya 360° Assessment is structured and scored.

### Modules Overview

| Module | Questions | Scale | Scoring Method |
|--------|-----------|-------|----------------|
| **Aptitude** | 60 (Job Seeker) / 60 (Student) | 4 MCQ options | Binary (1 = correct, 0 = wrong) |
| **RIASEC** Career Interest | 48 | 4-point Likert | Sum per type (1-4 per question) |
| **Employability** Skills | 24 | 4 scenario options | Ranked 1-4 (best answer = 4) |
| **Personality** Traits | 30 | 5-point Likert | Average per trait (1-5) |

---

### 1. Aptitude (MCQ — Right/Wrong)
- Each question has **1 correct answer** (`isCorrect: true`, `scoreValue: 1`)
- All wrong answers have `scoreValue: 0`
- Scored as **percentage correct per section** (e.g., Verbal Reasoning, Numerical Reasoning)
- Sections: `Verbal Reasoning`, `Numerical Reasoning`, `Abstract-Fluid Reasoning`, `Spatial Ability`, `Mechanical Reasoning`, `Processing Speed & Accuracy`
- Student assessments use **weighted scoring** (core sections weighted higher)

### 2. RIASEC Career Interest (4-point Likert)
- **No correct answer** — all options have `isCorrect: false`
- Scale: `Strongly Dislike (1)` → `Dislike (2)` → `Like (3)` → `Strongly Like (4)`
- **Summed per RIASEC type** (8 questions each, max 32 per type)
- Top 3 highest-scoring types form the **Holland Code** (e.g., "RIA", "SEC")
- Types: **R**ealistic, **I**nvestigative, **A**rtistic, **S**ocial, **E**nterprising, **C**onventional

### 3. Employability Skills (Scenario-Based, Ranked 1-4)
- Each question is a **workplace scenario** with 4 behavioral options
- Options are **ranked by quality**: Worst (1), Poor (2), Decent (3), Best (4)
- One option per question is marked `isCorrect: true` (the best response)
- **Summed per section** and converted to percentage (max = 4 × questions)
- Sections: `Core Skills`, `Functional Skills`, `Behavioral Skills`

### 4. Personality Traits (5-point Likert with Reverse Scoring)
- **No correct answer** — all options have `isCorrect: false`
- Scale: `Strongly Disagree (1)` → `Disagree (2)` → `Neutral (3)` → `Agree (4)` → `Strongly Agree (5)`
- **10 of 30 questions are reverse-scored** (prevents acquiescence bias):
  - Reverse items: "Strongly Agree" = 1, "Strongly Disagree" = 5
  - Reverse scoring is **baked into `scoreValue`** — no runtime logic needed
- Scored as **average per trait category** (5 questions per trait)
- Traits: `Work Discipline & Task Reliability`, `Stress Tolerance & Emotional Regulation`, `Learning & Change Orientation`, `Social Engagement & Task Focus`, `Team Compatibility & Cooperation`, `Integrity & Responsibility`

### Derived Metrics
- **Career Direction Clarity Index** (0-100): Measures focus of RIASEC interests + personality consistency
- **Performance Level**: `EXCELLENT` / `GOOD` / `AVERAGE` / `NEEDS_IMPROVEMENT`
- **AI Analysis**: Gemini 1.5 Flash generates personalized career insights from all scores

---

## 🤖 AI Analysis System

> Generates comprehensive, personalized career insights from assessment scores.

### Architecture

| Component | Description |
|-----------|-------------|
| **Gemini API** | Primary: Google Gemini 1.5 Flash via REST API |
| **Fallback** | Comprehensive rule-based analysis when Gemini is unavailable |
| **Storage** | AI insights saved as JSON in `UserAssessment.aiInsights` column |
| **Re-generation** | Stale insights auto-detected and regenerated on PDF download |

### Data Flow

```
Assessment Submitted → ScoringService → AiAnalysisService.generateAnalysis()
  ├── Gemini API available → API call with full prompt → Parse JSON response
  └── Gemini unavailable   → getFallbackAnalysis() → Rule-based comprehensive text
       └── saveAnalysis() → Writes to UserAssessment.aiInsights (JSON) + aiSummary (text)
```

### AI Insights Fields

| Field | Description |
|-------|-------------|
| `professionalPersona` | Title + 3-5 sentence description + superpower |
| `performanceDimensions` | 5 dimensions with 1-10 scores + descriptions |
| `employabilitySummary` | 5-sentence composite analysis |
| `aptitudeAnalysis` | Per-section cognitive strengths/weaknesses |
| `careerInterestAlignment` | Holland Code interpretation with RIASEC scores |
| `personalitySnapshot` | Trait-by-trait personality narrative |
| `skillReadiness` | Employability skill analysis |
| `sectorRecommendations` | Primary + growth sectors with explanations |
| `careerRecommendations` | Primary roles, growth roles, roles to avoid |
| `developmentRoadmap` | Phased plan: 1-3m, 3-6m, 6-12m |
| `detailedTraitInterpretation` | Per-trait 2-sentence analysis |
| `clarityIndex` | Score + level (HIGH/MEDIUM/LOW) + justification |

### Stale AI Detection

When a PDF is downloaded, `ReportsService` checks if `detailedTraitInterpretation` or `developmentRoadmap` are missing from stored insights. If stale, it calls `AiAnalysisService.getFallbackAnalysis()` with stored scores, saves fresh comprehensive text to DB, and uses it for the PDF.

### Environment Variable

```
GEMINI_API_KEY=AIzaSy...  # No spaces before the key!
```

---

## 📄 PDF Report Generation

> Generates 4-page PDF reports using `@react-pdf/renderer` with modern design.

### Page Structure

| Page | Sections |
|------|----------|
| **1** | Dark teal header, candidate profile, persona card, performance dimensions (score bars), cognitive & aptitude analysis (score bars) |
| **2** | RIASEC career interest (all 6 codes), industry sector matches (top 5 with progress bars) |
| **3** | Work personality profile (score bars + detailed trait interpretations), employability skill readiness (score bars), AI sector guidance |
| **4** | Best-fit career roles (two-column: primary + growth), development roadmap, clarity index badge, disclaimer |

### Visual Design

- **Header**: Dark teal (`#0a4f41`) background with white text
- **Score Bars**: Colored progress indicators (`#0e6957` fill on `#e8f5f1` track)
- **Cards**: Light teal background (`#f0faf7`) with left accent borders
- **Persona Card**: Dark background (`#0a4f41`) with light text
- **Typography**: Helvetica, compact sizing (8-11px)
- **Spacing**: Tight — 30px page padding, 8px section margins
- **Footer**: Dynamic page numbering across all pages

### Key Implementation Details

- **Emoji stripping**: `stripEmoji()` helper removes emojis that Helvetica can't render
- **Always fresh**: Reports are regenerated on every download (no cached stale PDFs)
- **Currency symbols**: ₹ symbol doesn't render in Helvetica — use text alternatives
- **Module wiring**: `ReportsModule` imports `AiAnalysisModule` for stale-AI re-generation

---

### ⏸️ Stop & Resume Feature

Users can **leave the assessment mid-way and resume from where they left off**:

| Feature | Implementation |
|---------|---------------|
| **Progress saving** | Each answer saved immediately via `saveProgress()` → `UserResponse.upsert()` |
| **Position tracking** | `lastQuestionIndex` stored in `UserAssessment` table, updated on every answer |
| **Resume on return** | `getAssessmentQuestions()` returns `savedAnswers` (map of questionId → selectedOptionId) + `lastQuestionIndex` |
| **Status tracking** | `IN_PROGRESS` status persists until final `submitAssessment()` sets `COMPLETED` |
| **Duplicate prevention** | `userId_assessmentId` unique constraint; re-starting returns existing attempt |

> **Security:** `isCorrect` and `scoreValue` are **never sent to the client** — only calculated server-side on submission.

---

## 🔜 Pending Features

### Priority 1: Authentication & Account Security

> **What exists today:** Basic email/password registration, JWT login/refresh/logout, email verification (token-based, sends via Nodemailer in console mode). No password reset, no social login, no phone login.

#### 🔐 Password Reset (Forgot + Change)

- [ ] `POST /auth/forgot-password` — accepts email, generates a time-limited reset token, sends reset link via email
- [ ] `POST /auth/reset-password` — accepts token + new password, validates token expiry, updates password hash
- [ ] `PATCH /auth/change-password` — (authenticated) accepts current password + new password, verifies old password first
- [ ] Add `passwordResetToken`, `passwordResetExpires` fields to `User` model in Prisma schema
- [ ] Frontend: "Forgot Password?" link on login page → email input → confirmation page
- [ ] Frontend: Reset password page (accessed via email link) → new password form
- [ ] Rate limit: max 3 reset requests per email per hour

#### ✉️ Email Verification (Enhancement)

- [x] Basic email verification endpoint exists (`POST /verify-email`, `POST /resend-verification`)
- [x] `createEmailVerificationToken()` generates token and stores in DB
- [ ] **Enable real SMTP** (currently Nodemailer logs to console only) — configure Gmail/SendGrid/AWS SES
- [ ] Frontend: Post-registration verification prompt page ("Check your email")
- [ ] Frontend: Verification success/failure page (when user clicks email link)
- [ ] Decide: Block login until verified? Or allow login but restrict certain features?
- [ ] Add verification status badge on user dashboard

#### 🔗 Google Sign-In (OAuth 2.0)

- [ ] Set up Google Cloud Console project → create OAuth 2.0 credentials (Client ID + Secret)
- [ ] Install `passport-google-oauth20` strategy
- [ ] `GET /auth/google` — redirects to Google consent screen
- [ ] `GET /auth/google/callback` — handles OAuth callback, creates/links user account
- [ ] Handle account linking: if email already exists with password login, link Google to existing account
- [ ] Frontend: "Sign in with Google" button on login and register pages
- [ ] Store `googleId` field on `User` model
- [ ] Env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`

#### 📱 Mobile Number / OTP Login

- [ ] Choose OTP provider: Twilio / MSG91 / Firebase Auth / AWS SNS
- [ ] `POST /auth/send-otp` — accepts phone number, generates 6-digit OTP, sends via SMS
- [ ] `POST /auth/verify-otp` — accepts phone + OTP, verifies, creates/logs in user
- [ ] Add `phoneNumber`, `phoneVerified` fields to `User` model
- [ ] OTP storage: Redis (preferred) or DB with expiry (5 min TTL)
- [ ] Rate limit: max 5 OTPs per phone per hour
- [ ] Frontend: Phone number input → OTP input → dashboard
- [ ] Env vars: `OTP_PROVIDER`, `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE`

#### 🛡️ Account Security (Future)

- [ ] Account lockout after 5 failed login attempts (15 min cooldown)
- [ ] Login activity log (IP, device, timestamp) visible to user
- [ ] Active sessions management (view/revoke)
- [ ] Optional 2FA via authenticator app (TOTP)

### Priority 2: Super Admin + Sales Staff Referral System

> **Current roles:** `STUDENT`, `JOB_SEEKER`, `EMPLOYER`, `ADMIN`
> **New roles to add:** `SUPER_ADMIN`, `SALES_AGENT`

#### 👑 Super Admin Account

- [ ] Add `SUPER_ADMIN` to `UserRole` enum in Prisma schema
- [ ] Create a seed script to insert a default Super Admin account (email/password based)
- [ ] Super Admin bypasses all role guards — full access to every endpoint
- [ ] Super Admin dashboard (frontend):
  - [ ] View all users (filter by role)
  - [ ] View all Sales Agents with their stats (signups, dates, conversion rates)
  - [ ] View platform-wide analytics: total signups, assessments taken, reports generated
  - [ ] Ability to create/deactivate Sales Agent accounts
  - [ ] Ability to manage referral codes (create, revoke, view usage)

#### 🧑‍💼 Sales Agent Role + Personal Referral Codes

- [ ] Add `SALES_AGENT` to `UserRole` enum
- [ ] Create `SalesAgentProfile` model in Prisma:
  ```
  model SalesAgentProfile {
    id             String   @id @default(cuid())
    userId         String   @unique
    fullName       String
    phone          String?
    referralCode   String   @unique    // e.g., "PRAGYA-RAMESH", "PRAGYA-SALES-042"
    isActive       Boolean  @default(true)
    createdAt      DateTime @default(now())
    user           User     @relation(fields: [userId], references: [id])
  }
  ```
- [ ] Add `referredBy` field on `User` model → links to `SalesAgentProfile.id`
- [ ] Add `referralCode` field on `User` model → stores the code used during signup
- [ ] Auto-generate unique referral codes per agent (format: `PRAGYA-<NAME>-<4DIGITS>`)
- [ ] Referral code validation: check existence + agent is active + not expired (if applicable)

#### 📋 Referral Code Sign-Up Flow

- [ ] Frontend: Optional "Referral Code" field on the registration page
- [ ] Backend: `POST /auth/register` accepts optional `referralCode` field
  - If provided: validate code → link new user to the Sales Agent
  - If invalid: reject with error "Invalid referral code"
  - If not provided: register normally (no agent linked)
- [ ] Track sign-up date, source (referral vs organic), and the referral code used

#### 📊 Sales Agent Dashboard

- [ ] `GET /sales/my-stats` — returns the logged-in Sales Agent's own stats:
  - Total signups under their referral code
  - List of users who signed up (name, email, date, role, assessment status)
  - Signups this week / this month
  - Conversion rate (signed up → completed assessment → downloaded report)
- [ ] `GET /sales/my-referrals` — paginated list of all users referred by this agent
- [ ] Frontend: Sales Agent dashboard page showing:
  - [ ] Stats cards (total signups, this month, active users)
  - [ ] Table of referred users with columns: Name, Email, Sign-up Date, Role, Assessment Status
  - [ ] Filter by date range
  - [ ] Export to CSV

#### 📈 Super Admin: Sales Analytics

- [ ] `GET /admin/sales-agents` — list all Sales Agents with aggregated stats
- [ ] `GET /admin/sales-agents/:id/referrals` — view a specific agent's referral list
- [ ] `GET /admin/sales-overview` — platform-wide sales stats:
  - Total referral signups vs organic signups
  - Top performing agents (ranked by signups)
  - Referral signups over time (daily/weekly/monthly chart data)
- [ ] Frontend: Super Admin sales analytics page:
  - [ ] Leaderboard of Sales Agents ranked by signups
  - [ ] Per-agent drill-down (click agent → see their referral list)
  - [ ] Date range filters
  - [ ] Export all data to CSV

### Priority 3: Employee Account Type (Company Referrals)

- [ ] Add `EMPLOYEE` role to `UserRole` enum
- [ ] Create `EmployeeProfile` model linked to a company/organization
- [ ] Build **company referral code system**: company generates unique codes for employees
- [ ] Employees register using company referral code → auto-linked to company
- [ ] Company dashboard to manage employee referral codes + view assessment results
- [ ] Referral code validation during sign-up (expiry, usage limits, company association)

### Priority 4: Authorization & Access Control

- [ ] Role-based route guards for all protected endpoints
- [ ] Super Admin overrides all guards
- [ ] Sales Agents restricted to their own data only
- [ ] Company-scoped data access (employees only see their company's data)
- [ ] Admin ability to manage companies and their referral codes
- [ ] Rate limiting on assessment endpoints
- [ ] Audit logging for sensitive operations

### Priority 5: Career Assessment Questions Enhancement

- [ ] Verify total question count across all modules matches expected totals
- [ ] Add more scenario-based employability questions
- [ ] Expand RIASEC question bank for better differentiation
- [ ] Add difficulty levels to aptitude questions
- [ ] Question randomization per attempt

### Other Planned Features

- [ ] Malayalam translated version of PDF report results
- [ ] Razorpay integration (payment gateway)
- [ ] **Migrate from Neon → Self-hosted PostgreSQL on VPS** (post-development)

### 🗄️ Database Migration Plan (Post-Development)

> **When:** After the app is fully developed and stable.  
> **Why:** Neon has cold starts (~500ms after 5min idle), network latency to Singapore (~30-80ms per query), and free tier storage limits. Self-hosted on VPS gives <1ms latency, always-on, and full control.

**Migration Steps:**
1. Install PostgreSQL on VPS: `sudo apt install postgresql`
2. Create database & user
3. Run `npx prisma migrate deploy` against new DB
4. Re-seed assessment data (`npx prisma db seed`)
5. Update `.env` → `DATABASE_URL=postgresql://user:pass@localhost:5432/pragya`
6. Set up daily backup cron: `pg_dump pragya | gzip > /backups/pragya_$(date +%F).sql.gz`
7. Test all flows (auth, assessment, results)
8. Remove Neon dependency

> **Zero code changes needed** — only `.env` update. Prisma works identically with any PostgreSQL instance.

---

## 🎯 Improved Career Matching Algorithm — Plan

> **Status:** Planned (post-development improvement). Current algorithm works but produces narrow score ranges.

### Phase 1: Use ALL Assessment Data (Not Just RIASEC)

Currently only RIASEC + aptitude are used. The improved algorithm would combine **all 4 modules**:

| Signal | Weight | What It Adds |
|--------|--------|-------------|
| **RIASEC Interest** | 35% | "What do you *want* to do?" |
| **Aptitude** | 30% | "What *can* you do?" |
| **Personality** | 20% | "What environment *suits* you?" |
| **Employability** | 15% | "How *ready* are you?" |

### Phase 2: Replace Letter Matching with Cosine Similarity

**Current:** Compares Holland Code letters ("ASI" == "ASI"? → match)

**Proposed:** Treat RIASEC as a 6D vector and use **cosine similarity** to measure how closely a user's interest *profile shape* matches each career's ideal profile.

```
User:         [R=12, I=18, A=28, S=24, E=15, C=10]
Pharmacist:   [R=5,  I=25, A=5,  S=20, E=10, C=20]  → 0.72
Animator:     [R=5,  I=8,  A=30, S=12, E=10, C=5]   → 0.94
```

This produces **much wider score differentiation** — no more everything at 45%.

### Phase 3: Career-Specific Aptitude Weights

Instead of a generic pass/fail check, each career in the DB gets its own **aptitude weight profile**:

```
// New fields in Career table
Pharmacist:       { numericalWeight: 0.4, verbalWeight: 0.3, logicalWeight: 0.3 }
Graphic Designer: { spatialWeight: 0.5, abstractWeight: 0.3, verbalWeight: 0.2 }
Software Dev:     { logicalWeight: 0.5, numericalWeight: 0.3, abstractWeight: 0.2 }
```

The aptitude score for each career = **weighted sum** of the user's aptitude percentages using that career's weights. This makes aptitude matching much more career-relevant.

### Phase 4: Personality-Career Fit

Map personality traits to career environment requirements:

| Career Type | Favors High... |
|------------|---------------|
| Surgery, Pilot | Stress Tolerance |
| Accounting, QA | Work Discipline |
| Teaching, HR | Social Engagement + Team Cooperation |
| Research, Dev | Learning Orientation + Task Focus |
| Legal, Finance | Integrity & Responsibility |

Each career gets a **personality fit profile** in the DB. Score = how closely the user's trait averages match the career's ideal.

### Phase 5: Employability as a Readiness Modifier

Instead of affecting match ranking, employability acts as a **readiness indicator**:
- Career match stays based on interest + aptitude + personality
- Employability score creates a **"Job Readiness" badge** (Ready / Developing / Needs Preparation)
- Shows users: *"You're a great fit for Graphic Design, but need to develop your communication skills first"*

### Phase 6: Final Score Formula

```
finalScore = (
    0.35 × cosineSimilarity(userRIASEC, careerRIASEC) +
    0.30 × weightedAptitudeMatch(userAptitude, careerAptitudeWeights) +
    0.20 × personalityFit(userTraits, careerTraitProfile) +
    0.15 × employabilityScore
) × 100
```

### What Changes in the Codebase

| File | Change |
|------|--------|
| **Prisma schema** | Add `aptitudeWeights`, `personalityProfile` JSON fields to `Career` model |
| **Seed data** | Update each career with aptitude weights + personality fit profiles |
| **`careers.service.ts`** | Replace `calculateCareerMatchScore` with cosine similarity + multi-factor formula |
| **`scoring.service.ts`** | Add helper for cosine similarity calculation |
| **Frontend** | Add "Job Readiness" badge next to career matches |

### Expected Results

- Score range widens from **30-55%** → **15-95%** (much better differentiation)
- Top matches feel genuinely personalized, not arbitrary
- Users see *why* a career matches ("Your creative + spatial aptitude aligns perfectly")
- Employability gives actionable growth direction, not just a number

---

## ⚠️ Important Notes

1. **Never commit `.env`** - Add to .gitignore
2. **Change JWT secrets** before production
3. **Enable SMTP** in production for real emails
4. **Neon free tier** scales to zero after 5min inactivity (cold starts ~500ms)
