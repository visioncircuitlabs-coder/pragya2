# ---- Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root files
COPY package.json package-lock.json ./
COPY patches/ ./patches/

# Copy workspace package.json files
COPY shared/package.json ./shared/
COPY server/package.json ./server/
# Client not needed but npm workspaces requires it
COPY client/package.json ./client/

# Install all dependencies (needed for workspace resolution + build)
RUN npm ci

# Copy shared source and build it
COPY shared/ ./shared/
RUN npm run build --workspace=shared

# Copy server source
COPY server/ ./server/

# Generate Prisma client
RUN cd server && npx prisma generate

# Build NestJS
RUN npm run build --workspace=server

# ---- Runner ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install OpenSSL (required by Prisma on Alpine)
RUN apk add --no-cache openssl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy workspace root files for production install
COPY package.json package-lock.json ./
COPY patches/ ./patches/
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/

# Copy Prisma schema (needed for generate + runtime migrations)
COPY --from=builder /app/server/prisma ./server/prisma

# Install production dependencies only + generate Prisma client
RUN npm ci --omit=dev && \
    cd server && npx prisma generate && \
    npm cache clean --force

# Copy built shared library
COPY --from=builder /app/shared/dist ./shared/dist

# Copy built server
COPY --from=builder /app/server/dist ./server/dist

# Copy font assets for PDF generation
COPY --from=builder /app/server/src/reports/fonts ./server/dist/reports/fonts

# Create reports directories (service uses process.cwd()/reports = /app/reports)
RUN mkdir -p /app/reports /app/server/reports && \
    chown nestjs:nodejs /app/reports /app/server/reports

# Create logs directories (logger uses process.cwd()/logs = /app/logs)
RUN mkdir -p /app/logs /app/server/logs && \
    chown nestjs:nodejs /app/logs /app/server/logs

USER nestjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "server/dist/main.js"]
