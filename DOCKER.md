# Docker Deployment Guide

This document explains how to deploy the TC Dashboard application using Docker.

## Building the Docker Image

To build the Docker image, run the following command from the project root directory:

```bash
docker build -t tc-dashboard .
```

## Running the Container

To run the container, use the following command:

```bash
docker run -d -p 80:80 -p 443:443 \
  -e VITE_SENTRY_DSN=your_sentry_dsn \
  -e VITE_ENVIRONMENT=prod \
  -e VITE_SENTRY_AUTH_TOKEN=your_sentry_auth_token \
  -e VITE_AUTH0_DOMAIN=your_auth0_tenant_domain \
  -e VITE_AUTH0_CLIENTID=your_auth0_clientId \
  -e DOMAIN_NAME=your_domain_name \
  -e ADMIN_EMAIL=your_email@example.com \
  -v $(pwd)/letsencrypt:/etc/letsencrypt \
  -v $(pwd)/certbot:/var/www/certbot \
  --name tc-dashboard tc-dashboard
```

Replace the environment variable values with your actual values.

## Environment Variables

The application requires the following environment variables:

### Application Configuration
- `VITE_SENTRY_DSN`: Your Sentry DSN for error tracking
- `VITE_ENVIRONMENT`: The environment (should be "prod" for production)
- `VITE_SENTRY_AUTH_TOKEN`: Your Sentry authentication token
- `VITE_AUTH0_DOMAIN`: Your Auth0 tenant domain
- `VITE_AUTH0_CLIENTID`: Your Auth0 client ID

### SSL and Domain Configuration
- `DOMAIN_NAME`: Your domain name (e.g., example.com)
- `ADMIN_EMAIL`: Your email address for Let's Encrypt registration and notifications

## SSL Configuration with Let's Encrypt

The Docker container is configured to automatically obtain and renew SSL certificates from Let's Encrypt. Here's how it works:

1. When the container starts, it checks if SSL certificates for your domain already exist
2. If certificates don't exist, it uses certbot to obtain them from Let's Encrypt
3. Nginx is configured to serve the application over HTTPS and redirect HTTP to HTTPS
4. A cron job is set up to automatically renew the certificates before they expire

For this to work properly:

- Your server must be publicly accessible on ports 80 and 443
- The `DOMAIN_NAME` environment variable must be set to a domain that points to your server
- The `ADMIN_EMAIL` environment variable should be set to a valid email address

## Using Docker Compose

A `docker-compose.yml` file is provided in the repository. You can use it to deploy the application.

### Option 1: Setting environment variables directly

You can set the environment variables directly when running Docker Compose:

```bash
VITE_SENTRY_DSN=your_sentry_dsn \
VITE_ENVIRONMENT=prod \
VITE_SENTRY_AUTH_TOKEN=your_sentry_auth_token \
VITE_AUTH0_DOMAIN=your_auth0_tenant_domain \
VITE_AUTH0_CLIENTID=your_auth0_clientId \
DOMAIN_NAME=your_domain_name \
ADMIN_EMAIL=your_email@example.com \
docker-compose up -d
```

### Option 2: Using a .env file

Alternatively, you can create a `.env` file in the project root with your environment variables. A template file `.env.docker.example` is provided in the repository that you can copy and modify:

```bash
# Copy the example file
cp .env.docker.example .env

# Edit the .env file with your actual values
nano .env  # or use your preferred text editor
```

Your `.env` file should contain:

```
VITE_SENTRY_DSN=your_sentry_dsn
VITE_ENVIRONMENT=prod
VITE_SENTRY_AUTH_TOKEN=your_sentry_auth_token
VITE_AUTH0_DOMAIN=your_auth0_tenant_domain
VITE_AUTH0_CLIENTID=your_auth0_clientId
DOMAIN_NAME=your_domain_name
ADMIN_EMAIL=your_email@example.com
```

Then simply run:

```bash
docker-compose up -d
```

Docker Compose will automatically load the environment variables from the `.env` file.

## How It Works

The Dockerfile uses a multi-stage build process:

1. The first stage builds the application using Node.js
2. The second stage serves the built files using Nginx with SSL support

At runtime:

1. Environment variables are injected into the application using a script that creates a JavaScript file with the environment configuration
2. Nginx is configured with the specified domain name
3. Let's Encrypt certificates are obtained or renewed if needed
4. The application is served over HTTPS with automatic HTTP to HTTPS redirection

## Persistent Volumes

The Docker Compose configuration creates two volumes to persist data:

- `./letsencrypt:/etc/letsencrypt`: Stores the SSL certificates
- `./certbot:/var/www/certbot`: Used by certbot for domain verification

These directories will be created in your project root if they don't exist. They should be backed up regularly to avoid losing your SSL certificates.
