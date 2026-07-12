# -------------------------------------------------------------------
# 1단계: 의존성 설치
# -------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# lockfile 기반으로 재현 가능한 설치
COPY package.json package-lock.json ./
RUN npm ci

# -------------------------------------------------------------------
# 2단계: Next.js 빌드 (standalone 산출물 생성)
# -------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# -------------------------------------------------------------------
# 3단계: 실행 (최소 이미지)
# -------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# server.js가 바라보는 포트/호스트 (SSH 배포와 동일하게 17000 사용)
ENV PORT=17000
ENV HOSTNAME=0.0.0.0

# 보안을 위해 비루트 사용자로 실행
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# standalone 산출물: server.js + 최소 node_modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 17000

CMD ["node", "server.js"]
