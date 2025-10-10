FROM node:20-alpine AS builder
WORKDIR /app

# Build-Args für Vite (bei Bedarf ergänzen/umbenennen)
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENTID
ARG VITE_SENTRY_DSN
ARG VITE_SENTRY_AUTH_TOKEN
ARG VITE_ENVIRONMENT

# Nur Manifest kopieren, damit Layer-Caching greift
COPY package.json package-lock.json* ./

# Wenn lockfile da ist -> npm ci, sonst npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Rest einpacken
COPY . .

# ENV für Vite setzen (Build-Time)
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
    VITE_AUTH0_CLIENTID=$VITE_AUTH0_CLIENTID \
    VITE_SENTRY_DSN=$VITE_SENTRY_DSN \
    VITE_SENTRY_AUTH_TOKEN=$VITE_SENTRY_AUTH_TOKEN \
    VITE_ENVIRONMENT=$VITE_ENVIRONMENT

# Vite-Build
RUN npm run build

# Optional: - falls du SSG/SPA baust, dev-deps sind nicht mehr nötig
# RUN npm prune --omit=dev

# ---- runtime ----
FROM nginx:stable-alpine AS runtime
# Use custom nginx.conf shipped with the repository for SPA routing fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Standard-Location für statische Seiten
COPY --from=builder /app/dist /usr/share/nginx/html

# Healthcheck (einfach)
HEALTHCHECK CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

EXPOSE 80