# ⛏ Base image
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# 🔧 Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 🔨 Build app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# 🚀 Final image
FROM base AS runner
WORKDIR /app

# Add user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "server.js"]