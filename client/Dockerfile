# ---- Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Build arg for API URL (baked into client at build time)
ARG NEXT_PUBLIC_API_URL=https://pragyacareer.com/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy workspace root files
COPY package.json package-lock.json ./
COPY patches/ ./patches/

# Copy workspace package.json files
COPY shared/package.json ./shared/
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install all dependencies + lightningcss native binary for Alpine (musl)
RUN npm ci && npm install --no-save lightningcss-linux-x64-musl

# Copy shared source and build it
COPY shared/ ./shared/
RUN npm run build --workspace=shared

# Copy client source
COPY client/ ./client/

# Build Next.js (standalone output)
RUN npm run build --workspace=client

# ---- Runner ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/client/.next/standalone ./
# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/client/.next/static ./client/.next/static
# Copy public directory
COPY --from=builder --chown=nextjs:nodejs /app/client/public ./client/public

USER nextjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001 || exit 1

CMD ["node", "client/server.js"]
