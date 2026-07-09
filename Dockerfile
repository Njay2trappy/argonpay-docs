FROM node:22-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_MAIN_SITE_URL=https://argonpay.app
ENV NEXT_PUBLIC_MAIN_SITE_URL=$NEXT_PUBLIC_MAIN_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3002

RUN apk add --no-cache curl

COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/styles ./styles

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://127.0.0.1:3002/ || exit 1

CMD ["npm", "start"]
