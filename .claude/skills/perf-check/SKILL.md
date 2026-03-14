---
name: perf-check
description: Performance audit for database queries, API payloads, and common bottlenecks
disable-model-invocation: true
---

# Performance Check

Audit the codebase for common performance issues before they hit production.

## Usage

```
/perf-check              # Full performance audit
/perf-check database     # Database query audit only
/perf-check api          # API response size audit only
/perf-check frontend     # Frontend bundle/rendering audit only
```

## Audit Areas

### 1. N+1 Query Detection (Database)
- Search all service files in `server/src/` for Prisma queries
- Flag patterns where a query runs inside a loop (N+1):
  ```typescript
  // BAD: N+1
  for (const user of users) {
    const assessments = await prisma.assessment.findMany({ where: { userId: user.id } });
  }
  ```
- Suggest `include` or `select` to eagerly load relations instead
- Check that `findMany` calls use `select` to avoid fetching unnecessary columns

### 2. Missing Database Indexes
- Read `server/prisma/schema.prisma`
- Check that all foreign key fields have `@index` or are part of `@@index`
- Check fields used in `where` clauses across services — they should be indexed
- Key fields to check: `userId` on UserAssessment, `assessmentId` on UserResponse, `email` on User
- Flag any `orderBy` fields that lack indexes

### 3. Large API Payloads
- Check assessment results endpoints — do they return full question text + all options when only scores are needed?
- Check if PDF generation fetches more data than necessary
- Look for endpoints returning arrays without pagination (`findMany` without `take`/`skip`)
- Flag any endpoint returning raw Prisma objects (may leak internal fields)

### 4. Expensive Operations
- Check if AI analysis (Gemini calls) blocks the response — should it be async?
- Check PDF generation — is it triggered on every download or cached?
- Look for synchronous file operations (`fs.readFileSync`, etc.)
- Check for missing caching on frequently-accessed, rarely-changing data (career list, assessment questions)

### 5. Frontend Performance
- Check for large component bundles — are heavy libraries (recharts, etc.) lazy loaded?
- Look for missing `key` props on list renders
- Check image optimization — is `next/image` used instead of raw `<img>`?
- Verify API calls use proper caching/deduplication (not fetching same data multiple times)

### 6. Caching Opportunities
- Check if `@nestjs/cache-manager` (already installed) is actually being used
- Identify candidates for caching:
  - Career library data (changes rarely)
  - Assessment question sets (changes rarely)
  - User assessment results (immutable after submission)
- Suggest TTL values appropriate for each

## Output Format

```
## Performance Audit Results

### Critical (Fix Before Production)
1. **N+1 query in X** — `file:line` — fetches Y inside loop of Z
   Fix: Use `include: { relation: true }`

### Warnings (Should Fix)
1. **Missing index on X.Y** — add `@@index([field])` to schema
2. **No pagination on /endpoint** — returns unbounded results

### Recommendations (Nice to Have)
1. **Cache career library** — TTL 1 hour, saves ~X queries/day
2. **Lazy load recharts** — reduce initial bundle by ~Xkb

### Summary
- Critical: X issues
- Warnings: X issues
- Recommendations: X items
```
