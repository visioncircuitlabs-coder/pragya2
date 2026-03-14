---
name: db-migrate
description: Guided Prisma migration creation with safety checks and rollback awareness
disable-model-invocation: true
---

# Database Migration Guide

Safely create and apply Prisma migrations with validation checks.

## Usage

```
/db-migrate                    # Check migration status and guide next steps
/db-migrate add-field          # Help add a new field to an existing model
/db-migrate add-model          # Help add a new model to the schema
/db-migrate status             # Show current migration status
```

## Steps

### 1. Assess Current State
- Run `cd server && npx prisma migrate status` to check for pending/failed migrations
- Read `server/prisma/schema.prisma` to understand current schema
- If there are pending migrations, resolve those first before creating new ones

### 2. Schema Change (if making changes)

Before editing `schema.prisma`:
- **Confirm the change** with the user — describe what will be added/modified
- **Check for breaking changes**:
  - Removing a field? Data will be lost — warn the user
  - Making a field required on existing model? Existing rows need defaults — add `@default()` or make it optional first
  - Renaming a field? Prisma treats this as drop + create — warn about data loss
  - Adding a unique constraint? Existing duplicates will cause migration failure

### 3. Create Migration
- Edit `server/prisma/schema.prisma` with the changes
- Run `cd server && npx prisma migrate dev --name <descriptive-name>`
- Use descriptive names: `add-user-phone-field`, `create-notifications-table`, `make-email-unique`
- Run `cd server && npx prisma generate` to update the Prisma client

### 4. Post-Migration Checks
- Verify the migration SQL in `server/prisma/migrations/<timestamp>_<name>/migration.sql`
- Check that no data-destructive statements exist unless explicitly intended
- Run `cd server && npx prisma migrate status` to confirm clean state
- If seed data needs updating, flag which seed files need changes

### 5. Safety Rules

**NEVER do these without explicit user confirmation:**
- Drop a table or column
- Change a column type (may cause data loss)
- Remove a `@default()` on a required field
- Run `prisma migrate reset` (wipes entire database)

**ALWAYS do these:**
- Back up the migration SQL for review
- Confirm the user has a database backup for production changes
- Test the migration on dev database before production
- Update seed files if the schema change affects seeded data

## Common Patterns for This Project

### Adding a field to User
```prisma
model User {
  // ... existing fields
  newField  String?  // Start optional, backfill later, then make required
}
```

### Adding a relation
```prisma
model NewModel {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```
Remember to add the reverse relation in the User model too.
