# Docker Deployment Guide

This document explains how to deploy the TC Dashboard application using Docker.

## Overview

The TC Dashboard application is deployed using Docker Compose with three main services:

1. **nginx** - The main application container that serves the React application
2. **nginx-proxy** - A reverse proxy that handles routing and SSL termination
3. **acme-companion** - A companion container for nginx-proxy that automatically obtains and renews SSL certificates from Let's Encrypt

This setup provides automatic SSL certificate management and easy deployment with minimal configuration.

## Prerequisites

- Docker and Docker Compose installed on your server
- A domain name pointing to your server's IP address
- Ports 80 and 443 open on your server's firewall

## Building and Deploying

### Step 1: Prepare Environment Variables

Create a `.env` file in the project root with your environment variables. A template file `.env.docker.example` is provided in the repository that you can copy and modify:

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

### Step 2: Build and Start the Containers

Run the following command to build and start all the containers:

```bash
docker-compose up -d
```

This command will:

1. Build the application container using the Dockerfile
2. Start all three services defined in docker-compose.yml
3. Set up the network and volumes

### Step 3: Verify Deployment

After a few minutes (to allow time for SSL certificate issuance), your application should be accessible at:

```
https://your_domain_name
```

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

## How It Works

### Multi-Stage Docker Build

The Dockerfile uses a multi-stage build process:

1. The first stage builds the application using Node.js 18 Alpine
2. The second stage uses nginx:stable-alpine to serve the built files
3. The custom nginx.conf is copied to configure the web server

### Docker Compose Services

#### nginx (Application Container)

This container serves the React application. It:

- Uses the image built from the Dockerfile
- Is configured with environment variables for the domain name and SSL
- Mounts the built application files to the nginx html directory
- Connects to the webproxy network

#### nginx-proxy (Reverse Proxy)

This container handles routing and SSL termination. It:

- Uses the nginxproxy/nginx-proxy image
- Exposes ports 80 and 443
- Mounts Docker socket and volumes for certificates and configuration
- Connects to the webproxy network

#### acme-companion (SSL Certificate Manager)

This container manages SSL certificates. It:

- Uses the nginxproxy/acme-companion image
- Automatically obtains and renews Let's Encrypt certificates
- Shares volumes with nginx-proxy for certificate storage
- Uses the ADMIN_EMAIL for Let's Encrypt registration

### Persistent Volumes

The Docker Compose configuration creates three volumes to persist data:

- `nginx_certs`: Stores the SSL certificates
- `nginx_vhost`: Stores virtual host configurations
- `nginx_html`: Used for ACME challenges

These volumes ensure that your SSL certificates and configurations are preserved even if containers are recreated.

## Maintenance

### Updating the Application

To update the application:

1. Pull the latest code changes
2. Rebuild the Docker image:

```bash
docker-compose build
```

3. Restart the containers:

```bash
docker-compose up -d
```

### Viewing Logs

To view logs from the containers:

```bash
# View logs from all containers
docker-compose logs

# View logs from a specific container
docker-compose logs nginx

# Follow logs in real-time
docker-compose logs -f
```

### Stopping the Application

To stop all containers:

```bash
docker-compose down
```

To stop and remove volumes (will delete SSL certificates):

```bash
docker-compose down -v
```
