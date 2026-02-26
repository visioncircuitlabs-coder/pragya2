# Pragya 360° Employability Assessment - Developer Documentation

## Overview
A comprehensive employability assessment system for job seekers featuring:
- **150 questions** across 4 assessment modules (Job Seeker)
- **Student Assessment** (Aptitude only + AI Persona)
- **RIASEC-based** career interest profiling (Holland Codes)
- **AI-powered** insights using Google Gemini (including "Student Persona" inference)
- **PDF report** generation
- **Career matching** with 50+ careers

---

## Quick Start

### 1. Install Dependencies
```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install

# Server dependencies
cd server && npm install
```

### 2. Configure Environment
Copy `server/.env.example` to `server/.env` and update:
```env
DATABASE_URL="your-neon-postgresql-url"
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-api-key"  # Get from https://aistudio.google.com/apikey
```

### 3. Database Setup
```bash
cd server
npx prisma migrate dev
npx prisma db seed
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

---

## Architecture

```
Pragya2/
├── client/                  # Next.js 14 Frontend
│   └── src/
│       └── app/
│           └── assessment/
│               ├── page.tsx              # Assessment wizard
│               └── results/[id]/page.tsx # Results dashboard
│
├── server/                  # NestJS Backend
│   └── src/
│       ├── assessments/
│       │   ├── assessments.service.ts    # Main logic
│       │   ├── scoring.service.ts        # Score calculation
│       │   └── careers.service.ts        # Career matching
│       │
│       ├── ai-analysis/
│       │   └── ai-analysis.service.ts    # Gemini AI integration
│       │
│       └── reports/
│           └── reports.service.ts        # PDF generation
│
└── server/prisma/
    ├── schema.prisma                     # Database schema
    ├── seed-assessments.ts               # Assessment data
    └── seed-careers.ts                   # Career data
```

---

## API Reference

### Authentication Required
All endpoints require JWT Bearer token in Authorization header.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/assessments` | List available assessments |
| GET | `/api/v1/assessments/:id/questions` | Get questions (no answers) |
| POST | `/api/v1/assessments/start` | Start assessment attempt |
| POST | `/api/v1/assessments/submit` | Submit answers (triggers scoring + AI) |
| GET | `/api/v1/assessments/results/:id` | Get detailed results |
| GET | `/api/v1/reports/:id/download` | Download PDF report |

---

## Scoring System

### 4 Assessment Modules

| Module | Questions | Scoring Method |
|--------|-----------|----------------|
| Aptitude | 48 | % correct per section |
| RIASEC | 48 | Sum per type → Holland Code |
| Employability | 24 | Weighted % per section |
| Personality | 30 | 1-5 average per trait |

### Student Assessment (Aptitude Only)
| Module | Sections | Scoring |
|--------|----------|---------|
| Aptitude | 6 Sections | weighted % (Num/Verbal/Abstract: 20%, others: 10-15%) |
| AI Persona | N/A | Inferred from Aptitude Score Mix |

### Holland Code (RIASEC)
- **R** - Realistic
- **I** - Investigative
- **A** - Artistic
- **S** - Social
- **E** - Enterprising
- **C** - Conventional

### Clarity Index
0-100 score based on RIASEC profile distinctiveness and personality consistency.

---

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Recharts
- **Backend**: NestJS, Prisma, PostgreSQL
- **AI**: Google Gemini API
- **PDF**: @react-pdf/renderer
- **Auth**: JWT (access + refresh tokens)

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | JWT signing secret (32+ chars) |
| `JWT_REFRESH_SECRET` | ✅ | Refresh token secret |
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `FRONTEND_URL` | ✅ | Client URL for CORS |
| `PORT` | ❌ | Backend port (default: 4000) |

---

## Database Models

### Key Tables
- `Assessment` - Assessment definitions
- `Question` / `Option` - Question bank
- `UserAssessment` - User attempts with scores
- `UserResponse` - Individual answers
- `Career` - Career database with RIASEC codes

### UserAssessment Score Fields
```
totalScore        - Overall aptitude %
aptitudeScores    - Per-section aptitude
riasecScores      - RIASEC type scores
riasecCode        - 3-letter Holland Code
employabilityScores
personalityScores
clarityIndex      - 0-100 career clarity
careerMatches     - Top matched careers
aiSummary         - AI-generated summary
aiInsights        - Detailed AI analysis
```

### AI Logic (Student Persona)
The system uses `AiAnalysisService` to infer a "Student Persona" (e.g., "The Logical Architect") based on aptitude score combinations.
- **Input**: Aptitude scores (0-100%)
- **Logic**: Maximizes strengths + Minimizes weaknesses for career fit.
- **Tone**: "Teacher-like", encouraging, "Average" floor (no negative labels).

---

## Logging System

### Overview
Production-ready structured logging with Winston:
- **Correlation IDs**: Every request gets a unique ID for tracing across services
- **Security-Aware**: Passwords, tokens, and sensitive data are automatically redacted
- **Environment-Aware**: Pretty console output in dev, JSON in production
- **Retention**: 6 months for app/error logs, 1 week for debug logs

### Log Files
```
server/logs/
├── app-YYYY-MM-DD.log      # All logs (info level and above)
├── error-YYYY-MM-DD.log    # Errors only
└── debug-YYYY-MM-DD.log    # Debug logs (dev only)
```

### Log Types
| Method | When to Use |
|--------|-------------|
| `logger.log(msg)` | General info |
| `logger.error(msg, trace)` | Exceptions |
| `logger.warn(msg)` | Warnings |
| `logger.debug(msg)` | Debug info (dev only) |
| `logger.logAuthEvent(event, data)` | Login/logout/register |
| `logger.logSecurityEvent(event, {severity, details})` | Security issues |
| `logger.logBusinessEvent(event, data)` | Business actions |
| `logger.logHttpRequest/Response(...)` | HTTP traffic |

### Example Log Entry (JSON)
```json
{
  "timestamp": "2024-01-15 10:30:45.123",
  "level": "info",
  "correlationId": "abc123-...",
  "userId": "user-456",
  "context": "Auth",
  "type": "auth",
  "event": "LOGIN",
  "email": "j***n@example.com"
}
```

### Configuration
```env
LOG_LEVEL=info          # error, warn, info, debug, verbose
NODE_ENV=production     # Controls console format (JSON vs pretty)
```

---

## Testing

```bash
# Run backend tests
cd server && npm test

# Type check frontend
cd client && npx tsc --noEmit
```
