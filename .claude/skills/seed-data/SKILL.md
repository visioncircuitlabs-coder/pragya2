---
name: seed-data
description: Validate and manage Prisma seed data for assessments and careers
disable-model-invocation: true
---

# Seed Data Manager

Validate, inspect, and manage Prisma seed data for assessments and careers.

## Usage

```
/seed-data validate        # Check question counts and data integrity
/seed-data add-questions   # Add new questions to a module
/seed-data add-career      # Add a new career entry with RIASEC codes
```

## Key Files

- `server/prisma/seed-assessments.ts` — Job seeker assessment questions
- `server/prisma/seed-student-assessment.ts` — Student assessment questions
- `server/prisma/seed-careers.ts` — 50+ careers with RIASEC codes
- `server/prisma/seed-data/` — Question data organized by module
- `server/prisma/verify-counts.ts` — Validation script

## Conventions

- Student assessment: 4 modules (Aptitude, RIASEC/Career Interest, Personality, Readiness) = 180 questions total
- Job seeker assessment: Aptitude, RIASEC, Employability, Personality modules
- Each career must have valid RIASEC codes (R, I, A, S, E, C)
- Questions follow the format in `seed-data/` TypeScript files with options array

## Steps

1. Read the relevant seed files to understand current state
2. Run `cd server && npx ts-node prisma/verify-counts.ts` to check counts
3. Make requested changes following existing data format
4. Re-run verification to confirm integrity
