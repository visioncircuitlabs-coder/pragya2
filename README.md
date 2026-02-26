# Pragya Career Ecosystem

> India's Pioneer Youth-Developed Career Ecosystem

## Project Structure

This is a monorepo containing the complete Pragya platform:

```
pragya/
├── client/          # Next.js frontend application
├── server/          # NestJS backend API
├── shared/          # Shared types and utilities
├── docs/            # Documentation
└── docker-compose.yml  # Local development environment
```

## Prerequisites

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0
- **Docker**: (optional, for local database)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspaces (client, server, shared).

### 2. Start Development Environment

#### Option A: With Docker (Recommended)

```bash
# Start PostgreSQL and Redis
npm run docker:up

# Start both frontend and backend
npm run dev
```

#### Option B: Without Docker

You'll need to set up PostgreSQL and Redis manually and update the `.env` files.

```bash
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:4000/api/v1
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Development

### Run Frontend Only

```bash
npm run dev:client
```

### Run Backend Only

```bash
npm run dev:server
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
# All workspaces
npm run test

# Specific workspace
npm run test:client
npm run test:server
```

## Project Workspaces

### Client (`/client`)
Next.js 16 frontend with React 19, TypeScript, and Tailwind CSS.
- Job Seeker Portal
- Employer Portal
- Career Library
- Assessment Interface

### Server (`/server`)
NestJS backend with TypeScript, PostgreSQL, and Redis.
- RESTful API
- Authentication & Authorization
- Assessment Engine
- Payment Integration (Razorpay)
- Job Portal

### Shared (`/shared`)
Shared TypeScript types, constants, and utilities used by both client and server.

## Environment Variables

Create `.env` files in both `client/` and `server/` directories:

### Client `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Server `.env`
```env
DATABASE_URL="postgresql://pragya_user:pragya_pass@localhost:5432/pragya_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
FRONTEND_URL="http://localhost:3000"
```

## Docker Commands

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs
```

## Documentation

- [Architecture Documentation](./docs/architecture.md)
- [API Documentation](./docs/api/)
- [Deployment Guide](./docs/deployment/)

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React (Icons)

### Backend
- Node.js 20
- NestJS 10
- TypeScript
- PostgreSQL 16
- Redis 7
- Prisma ORM
- JWT Authentication
- Razorpay Integration

## Contributing

This is a youth-led initiative. For contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Proprietary - Vision Circuit Labs

---

**Built with ❤️ by Youth, for Youth**
