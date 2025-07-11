# Stage 1: Build the application
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Serve the application with SSL support
FROM nginx:alpine

# Install certbot and dependencies
RUN apk add --no-cache certbot openssl bash

# Copy the built files from the build stage to the nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Create directories for Let's Encrypt and entrypoint scripts
RUN mkdir -p /etc/letsencrypt /var/www/certbot /docker-entrypoint.d

# Create a default nginx configuration template
RUN cat > /etc/nginx/conf.d/default.template << 'EOF'
server {
    listen 80;
    server_name ${DOMAIN_NAME};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name ${DOMAIN_NAME};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Create a script to replace environment variables in nginx config
RUN echo '#!/bin/sh' > /docker-entrypoint.d/30-nginx-config.sh && \
    echo 'envsubst < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.d/30-nginx-config.sh && \
    chmod +x /docker-entrypoint.d/30-nginx-config.sh

# Create a script to obtain and renew SSL certificates
RUN echo '#!/bin/sh' > /docker-entrypoint.d/20-ssl-setup.sh && \
    echo 'if [ -z "$DOMAIN_NAME" ]; then' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '  echo "DOMAIN_NAME environment variable is not set. Using default configuration."' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '  cp /etc/nginx/conf.d/default.template /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '  exit 0' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo 'fi' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '# Check if certificates already exist' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo 'if [ ! -d "/etc/letsencrypt/live/$DOMAIN_NAME" ]; then' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '  echo "Obtaining SSL certificate for $DOMAIN_NAME..."' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '  certbot certonly --webroot -w /var/www/certbot \\' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '    --email ${ADMIN_EMAIL:-admin@example.com} \\' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '    -d $DOMAIN_NAME \\' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '    --agree-tos --non-interactive \\' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '    --deploy-hook "nginx -s reload"' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo 'else' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '  echo "SSL certificates for $DOMAIN_NAME already exist."' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo 'fi' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo '# Set up certificate renewal cron job' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo 'echo "0 12 * * * certbot renew --quiet --deploy-hook \"nginx -s reload\"" > /etc/crontabs/root' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    echo 'crond' >> /docker-entrypoint.d/20-ssl-setup.sh && \
    chmod +x /docker-entrypoint.d/20-ssl-setup.sh

# Expose ports
EXPOSE 80 443

# Create a script to replace environment variables at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env-subst.sh && \
    echo 'envsubst < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/40-env-subst.sh && \
    chmod +x /docker-entrypoint.d/40-env-subst.sh

# Create a template file for environment variables
RUN cat > /usr/share/nginx/html/env-config.template.js << 'EOF'
window.ENV = {
  VITE_SENTRY_DSN: "${VITE_SENTRY_DSN}",
  VITE_ENVIRONMENT: "${VITE_ENVIRONMENT}",
  VITE_SENTRY_AUTH_TOKEN: "${VITE_SENTRY_AUTH_TOKEN}",
  VITE_AUTH0_DOMAIN: "${VITE_AUTH0_DOMAIN}",
  VITE_AUTH0_CLIENTID: "${VITE_AUTH0_CLIENTID}",
  DOMAIN_NAME: "${DOMAIN_NAME}"
};
EOF

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
