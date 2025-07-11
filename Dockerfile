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

# Create directories for Let's Encrypt
RUN mkdir -p /etc/letsencrypt /var/www/certbot

# Create a default nginx configuration template
RUN echo 'server {\n\
    listen 80;\n\
    server_name ${DOMAIN_NAME};\n\
    \n\
    location /.well-known/acme-challenge/ {\n\
        root /var/www/certbot;\n\
    }\n\
    \n\
    location / {\n\
        return 301 https://$host$request_uri;\n\
    }\n\
}\n\
\n\
server {\n\
    listen 443 ssl;\n\
    server_name ${DOMAIN_NAME};\n\
    \n\
    ssl_certificate /etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem;\n\
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem;\n\
    \n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.template

# Create a script to replace environment variables in nginx config
RUN echo '#!/bin/sh\n\
envsubst < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf\n\
' > /docker-entrypoint.d/30-nginx-config.sh && \
chmod +x /docker-entrypoint.d/30-nginx-config.sh

# Create a script to obtain and renew SSL certificates
RUN echo '#!/bin/sh\n\
if [ -z "$DOMAIN_NAME" ]; then\n\
  echo "DOMAIN_NAME environment variable is not set. Using default configuration."\n\
  cp /etc/nginx/conf.d/default.template /etc/nginx/conf.d/default.conf\n\
  exit 0\n\
fi\n\
\n\
# Check if certificates already exist\n\
if [ ! -d "/etc/letsencrypt/live/$DOMAIN_NAME" ]; then\n\
  echo "Obtaining SSL certificate for $DOMAIN_NAME..."\n\
  certbot certonly --webroot -w /var/www/certbot \\\n\
    --email ${ADMIN_EMAIL:-admin@example.com} \\\n\
    -d $DOMAIN_NAME \\\n\
    --agree-tos --non-interactive \\\n\
    --deploy-hook "nginx -s reload"\n\
else\n\
  echo "SSL certificates for $DOMAIN_NAME already exist."\n\
fi\n\
\n\
# Set up certificate renewal cron job\n\
echo "0 12 * * * certbot renew --quiet --deploy-hook \"nginx -s reload\"" > /etc/crontabs/root\n\
crond\n\
' > /docker-entrypoint.d/20-ssl-setup.sh && \
chmod +x /docker-entrypoint.d/20-ssl-setup.sh

# Expose ports
EXPOSE 80 443

# Create a script to replace environment variables at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env-subst.sh && \
    echo 'envsubst < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/40-env-subst.sh && \
    chmod +x /docker-entrypoint.d/40-env-subst.sh

# Create a template file for environment variables
RUN echo 'window.ENV = {' > /usr/share/nginx/html/env-config.template.js && \
    echo '  VITE_SENTRY_DSN: "${VITE_SENTRY_DSN}",' >> /usr/share/nginx/html/env-config.template.js && \
    echo '  VITE_ENVIRONMENT: "${VITE_ENVIRONMENT}",' >> /usr/share/nginx/html/env-config.template.js && \
    echo '  VITE_SENTRY_AUTH_TOKEN: "${VITE_SENTRY_AUTH_TOKEN}",' >> /usr/share/nginx/html/env-config.template.js && \
    echo '  VITE_AUTH0_DOMAIN: "${VITE_AUTH0_DOMAIN}",' >> /usr/share/nginx/html/env-config.template.js && \
    echo '  VITE_AUTH0_CLIENTID: "${VITE_AUTH0_CLIENTID}",' >> /usr/share/nginx/html/env-config.template.js && \
    echo '  DOMAIN_NAME: "${DOMAIN_NAME}"' >> /usr/share/nginx/html/env-config.template.js && \
    echo '};' >> /usr/share/nginx/html/env-config.template.js

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
