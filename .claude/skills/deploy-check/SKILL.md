---
name: deploy-check
description: Pre-deployment checklist to catch common issues before shipping to production
disable-model-invocation: true
---

# Deploy Check

Run a comprehensive pre-deployment checklist before pushing to production.

## Usage

```
/deploy-check
```

## Checklist

Perform each check below. Report a pass/fail summary table at the end.

### 1. Build Check
- Run `cd server && npm run build` — must complete with zero errors
- Run `cd client && npm run build` — must complete with zero errors
- Report any TypeScript compilation errors

### 2. Environment Variables
- Read `server/.env.example` and compare against `server/.env`
- Flag any missing variables that exist in `.env.example` but not in `.env`
- Verify critical vars are set: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GEMINI_API_KEY`, `FRONTEND_URL`
- **Never print actual secret values** — only confirm they are set (non-empty)

### 3. Database Migrations
- Run `cd server && npx prisma migrate status` to check for pending migrations
- Flag any unapplied migrations
- Verify `prisma generate` is up to date with schema

### 4. Debug Code Cleanup
- Search `server/src/` for `console.log`, `console.debug`, `console.warn` statements (Winston logger should be used instead)
- Search `client/src/` for `console.log` statements in non-development code
- Search for `TODO`, `FIXME`, `HACK`, `XXX` comments that might indicate incomplete work
- Search for hardcoded `localhost` URLs in production code paths

### 5. Security Quick Check
- Verify `helmet` is imported and used in `main.ts`
- Verify CORS is configured (not wildcard `*` in production)
- Verify rate limiting is active (`@nestjs/throttler`)
- Check that no `.env` files are in `.gitignore`

### 6. Lint Check
- Run `cd server && npm run lint` — report any errors
- Run `cd client && npm run lint` — report any errors

## Output Format

```
## Deploy Check Results

| Check                  | Status | Notes           |
|------------------------|--------|-----------------|
| Server build           | PASS   |                 |
| Client build           | PASS   |                 |
| Env vars               | WARN   | Missing X       |
| Migrations             | PASS   |                 |
| Debug code             | FAIL   | 3 console.logs  |
| Security               | PASS   |                 |
| Lint                   | PASS   |                 |

### Issues to Fix Before Deploy
1. ...
2. ...
```
