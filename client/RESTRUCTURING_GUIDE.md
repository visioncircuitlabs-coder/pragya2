# Phase 1 Restructuring - Manual Steps Required

## Overview
I've created the monorepo configuration files and shared TypeScript types. Due to workspace restrictions, you'll need to manually reorganize the folder structure.

## What's Been Created

### Root Level Files (in Pragya2/)
- ✅ `package.json` - Workspace configuration
- ✅ `docker-compose.yml` - PostgreSQL & Redis
- ✅ `README.md` - Project documentation
- ✅ `.gitignore` - Git ignore rules

### Shared Types (in webb/)
The following TypeScript files have been created and need to be moved:
- ✅ `user-types.ts` - User, profiles, auth types
- ✅ `assessment-types.ts` - Assessment system types
- ✅ `job-types.ts` - Job portal types
- ✅ `payment-types.ts` - Payment integration types
- ✅ `common-types.ts` - API responses, errors, constants
- ✅ `shared-package.json` - Package config for shared workspace
- ✅ `shared-tsconfig.json` - TypeScript config for shared workspace

## Manual Steps Required

### Step 1: Stop the Development Server
```powershell
# Press Ctrl+C in the terminal running npm run start
```

### Step 2: Create Folder Structure
```powershell
cd "c:\Users\lenovo\Desktop\Vision Circuit LAbs\Pragya\Pragya2"

# Create new folders
mkdir client
mkdir server
mkdir shared
mkdir shared\src
mkdir shared\src\types
mkdir shared\src\constants
mkdir docs
```

### Step 3: Move Frontend to Client
```powershell
# Copy all webb contents to client (excluding node_modules and .next)
robocopy webb client /E /XD node_modules .next
```

### Step 4: Set Up Shared Workspace
```powershell
# Move the shared files
move webb\user-types.ts shared\src\types\user.types.ts
move webb\assessment-types.ts shared\src\types\assessment.types.ts
move webb\job-types.ts shared\src\types\job.types.ts
move webb\payment-types.ts shared\src\types\payment.types.ts
move webb\common-types.ts shared\src\types\common.types.ts

# Move configuration files
move webb\shared-package.json shared\package.json
move webb\shared-tsconfig.json shared\tsconfig.json
```

### Step 5: Create shared/src/index.ts
Create `shared/src/index.ts` with:
```typescript
// Export all types
export * from './types/user.types';
export * from './types/assessment.types';
export * from './types/job.types';
export * from './types/payment.types';
export * from './types/common.types';
```

### Step 6: Clean Up Old webb Folder
```powershell
# After verifying everything is copied correctly
rmdir /s /q webb
```

### Step 7: Install Dependencies
```powershell
# From Pragya2 root
npm install
```

### Step 8: Test the Setup
```powershell
# Start Docker services
npm run docker:up

# In a new terminal, start the client
npm run dev:client
```

## Expected Final Structure
```
Pragya2/
├── client/              # Your Next.js app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
├── server/             # Will be created in Phase 2
├── shared/
│   ├── src/
│   │   ├── types/
│   │   │   ├── user.types.ts
│   │   │   ├── assessment.types.ts
│   │   │   ├── job.types.ts
│   │   │   ├── payment.types.ts
│   │   │   └── common.types.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/
├── package.json
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Next Steps (Phase 2)
Once the restructuring is complete:
1. Set up the NestJS backend in `server/`
2. Configure client to use shared types
3. Set up database with Prisma
4. Implement authentication system

## Rollback
If you need to revert:
1. Keep using the `webb` folder as is
2. Delete the new files created
3. Continue with `npm run start` from webb directory

---
**Status**: Awaiting manual folder reorganization before proceeding to Phase 2.
