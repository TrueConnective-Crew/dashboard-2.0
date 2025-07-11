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
RUN mkdir -p /docker-entrypoint.d && \
    cat > /docker-entrypoint.d/30-nginx-config.sh << 'EOF' && \
    chmod +x /docker-entrypoint.d/30-nginx-config.sh
#!/bin/sh
envsubst < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf
EOF

# Create a script to obtain and renew SSL certificates
RUN cat > /docker-entrypoint.d/20-ssl-setup.sh << 'EOF' && \
    chmod +x /docker-entrypoint.d/20-ssl-setup.sh
#!/bin/sh
if [ -z "$DOMAIN_NAME" ]; then
  echo "DOMAIN_NAME environment variable is not set. Using default configuration."
  cp /etc/nginx/conf.d/default.template /etc/nginx/conf.d/default.conf
  exit 0
fi

# Check if certificates already exist
if [ ! -d "/etc/letsencrypt/live/$DOMAIN_NAME" ]; then
  echo "Obtaining SSL certificate for $DOMAIN_NAME..."
  certbot certonly --webroot -w /var/www/certbot \
    --email ${ADMIN_EMAIL:-admin@example.com} \
    -d $DOMAIN_NAME \
    --agree-tos --non-interactive \
    --deploy-hook "nginx -s reload"
else
  echo "SSL certificates for $DOMAIN_NAME already exist."
fi

# Set up certificate renewal cron job
echo "0 12 * * * certbot renew --quiet --deploy-hook \"nginx -s reload\"" > /etc/crontabs/root
crond
EOF

# Expose ports
EXPOSE 80 443

# Create a script to replace environment variables at runtime
RUN cat > /docker-entrypoint.d/40-env-subst.sh << 'EOF' && \
    chmod +x /docker-entrypoint.d/40-env-subst.sh
#!/bin/sh
envsubst < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js
EOF

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
