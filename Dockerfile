FROM node:20-alpine AS builder

WORKDIR /app

ENV NPM_CONFIG_CACHE=/tmp/.npm
ENV HOME=/tmp

COPY package.json package-lock.json .npmrc ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=80

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 80

CMD ["node", "server.js"]
