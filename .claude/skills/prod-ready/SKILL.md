---
name: prod-ready
description: Full production readiness audit covering security, reliability, observability, and operational concerns
disable-model-invocation: true
---

# Production Readiness Audit

Comprehensive audit to ensure the application is ready for real users and production traffic.

## Usage

```
/prod-ready              # Full audit across all areas
/prod-ready security     # Security audit only
/prod-ready reliability  # Error handling and resilience only
/prod-ready ops          # Logging, monitoring, and operational readiness
```

## Audit Areas

### 1. Security Hardening
- **Authentication**: JWT secrets are strong (not defaults), token expiry is reasonable (15min access, 7d refresh typical), refresh token rotation works
- **Authorization**: Every non-public endpoint has `@UseGuards(JwtAuthGuard)`, role checks on admin endpoints, users can only access their own data
- **Headers**: Helmet is configured in `main.ts` with production-appropriate settings
- **CORS**: Not set to `*` in production — should be restricted to `FRONTEND_URL`
- **Rate Limiting**: Throttler is active, auth endpoints have stricter limits (10 req/min)
- **Input Validation**: Global `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true`
- **Secrets**: No hardcoded secrets in source code, `.env` is in `.gitignore`
- **Dependencies**: Run `npm audit` and flag any high/critical vulnerabilities
- **Password Policy**: bcrypt rounds >= 10, password minimum length enforced in DTO

### 2. Error Handling & Resilience
- **Global Exception Filter**: Check for a global exception filter that catches unhandled errors and returns consistent error responses (not stack traces)
- **Gemini API Failures**: Verify the fallback system works when AI is unavailable (rule-based fallback in `ai-analysis/`)
- **Database Connection**: Check for connection pool settings, reconnection handling
- **Graceful Shutdown**: Check if `app.enableShutdownHooks()` is called for clean Prisma disconnection
- **Validation Errors**: Ensure validation pipe returns user-friendly error messages, not internal details
- **404 Handling**: Unknown routes return proper 404, not framework defaults

### 3. Data Integrity
- **Required Constraints**: All required fields have proper `NOT NULL` in Prisma schema
- **Unique Constraints**: Email uniqueness, `[userId, assessmentId]` uniqueness on UserAssessment
- **Cascade Rules**: `onDelete` behavior is set correctly on relations (no orphaned records)
- **Data Sanitization**: User input is sanitized before storage (XSS prevention)

### 4. Observability & Logging
- **Structured Logging**: Winston logger is used consistently (not `console.log`)
- **Request Correlation**: Check for correlation ID middleware in `server/src/middleware/`
- **Error Logging**: All catch blocks log the error with context
- **Sensitive Data Redaction**: Passwords, tokens, and secrets are never logged
- **Log Levels**: Appropriate use of error/warn/info/debug levels

### 5. Frontend Production Checks
- **Environment Config**: `NEXT_PUBLIC_API_URL` is configurable (not hardcoded localhost)
- **Error Boundaries**: React error boundaries prevent white screen crashes
- **Loading States**: All async operations show loading indicators
- **SEO Basics**: Pages have proper `<title>`, meta descriptions, Open Graph tags
- **Responsive Design**: Key pages work on mobile viewports
- **Auth Token Handling**: Tokens stored securely, 401 interceptor refreshes properly

### 6. Operational Readiness
- **Health Check Endpoint**: Does `/api/v1/health` exist? Should return DB connection status
- **Build Reproducibility**: `package-lock.json` is committed, Node version is pinned in `.nvmrc` or `engines`
- **Database Backups**: Remind user to set up automated backups (Neon has built-in)
- **Deployment Config**: Check for `Dockerfile`, `docker-compose.yml`, or deployment platform config
- **Environment Parity**: Dev and production use same database engine (PostgreSQL)

## Output Format

```
## Production Readiness Report

### Score: X/10

### Critical (Must Fix)
These will cause problems in production:
1. **[Security]** Description — `file:line`
   Fix: ...

### Important (Should Fix)
These could cause issues under load or edge cases:
1. **[Reliability]** Description — `file:line`
   Fix: ...

### Recommended (Nice to Have)
Professional touches for a polished product:
1. **[Ops]** Description
   Suggestion: ...

### Checklist Summary
| Area           | Status | Issues |
|----------------|--------|--------|
| Security       | ...    | X      |
| Error Handling | ...    | X      |
| Data Integrity | ...    | X      |
| Logging        | ...    | X      |
| Frontend       | ...    | X      |
| Operations     | ...    | X      |
```
