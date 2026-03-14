---
name: api-doc
description: Generate API documentation from NestJS controllers
disable-model-invocation: true
---

# API Documentation Generator

Auto-generate comprehensive API documentation by reading your NestJS controllers, DTOs, and guards.

## Usage

```
/api-doc              # Generate docs for all endpoints
/api-doc auth         # Generate docs for auth module only
/api-doc assessments  # Generate docs for assessments module only
```

## Steps

### 1. Discover Endpoints
- Read all `*.controller.ts` files in `server/src/`
- Extract route decorators: `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`
- Note the controller-level `@Controller('path')` prefix
- All routes are prefixed with `/api/v1` (set in `main.ts`)

### 2. Extract Details Per Endpoint
For each endpoint, document:
- **Method + Path**: e.g. `POST /api/v1/auth/login`
- **Auth**: Check for `@UseGuards(JwtAuthGuard)`, `@Roles()`, `@Public()` decorators
- **Request Body**: Read the corresponding DTO class, list all fields with their `class-validator` decorators (required/optional, type, constraints)
- **Query/Params**: Check for `@Param()`, `@Query()` decorators
- **Response**: Infer from return type and service method

### 3. Organize by Module
Group endpoints by NestJS module:
- **Auth** (`/api/v1/auth/*`) — login, register, refresh, profile
- **Assessments** (`/api/v1/assessments/*`) — CRUD, start, progress, submit, results
- **Reports** (`/api/v1/reports/*`) — download PDF
- **Users** (`/api/v1/users/*`) — user management
- **Careers** — career library endpoints

### 4. Output Format

Write the documentation to `API.md` in the project root:

```markdown
# Pragya API Documentation

Base URL: `http://localhost:4000/api/v1`

## Authentication
All protected endpoints require `Authorization: Bearer <access_token>` header.

---

## Auth

### POST /api/v1/auth/register
Create a new user account.

**Auth**: Public
**Body**:
| Field    | Type   | Required | Constraints      |
|----------|--------|----------|------------------|
| email    | string | Yes      | Valid email      |
| password | string | Yes      | Min 8 characters |
| ...      | ...    | ...      | ...              |

**Response**: `201 Created`
```json
{ "accessToken": "...", "refreshToken": "..." }
```

---
```

### 5. Final Check
- Verify every controller file was processed
- Count total endpoints documented
- Report summary: "Documented X endpoints across Y modules"
