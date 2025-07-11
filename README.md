# TC Dashboard 2.0

A modern dashboard application built with React, TypeScript, and MUI Joy.

## Overview

TC Dashboard 2.0 is a redesigned version of a dashboard application, currently in early development. The application aims to provide a clean, intuitive interface for data visualization and management.

## Features

- Modern React (v19) with TypeScript
- Material UI Joy components for a consistent and beautiful UI
- Responsive design that works on all devices
- Dark/light mode with system preference detection
- Fast development and build process with Vite
- Authentication with Auth0
- Error tracking and monitoring with Sentry
- Cookie consent banner for GDPR compliance

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- Yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/TrueConnective-Crew/tc-dashboard-2.0.git
   cd tc-dashboard-2.0
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Then edit the `.env` file to add your actual values.

4. Start the development server:

   ```bash
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `yarn dev` - Starts the development server
- `yarn build` - Builds the app for production
- `yarn lint` - Runs ESLint to check for code quality issues
- `yarn preview` - Previews the production build locally

## Docker Deployment

The application can be deployed using Docker. For detailed instructions, see [DOCKER.md](DOCKER.md).

### Quick Start with Docker

1. Build the Docker image:

   ```bash
   docker build -t tc-dashboard .
   ```

2. Run the container:

   ```bash
   docker run -d -p 80:80 -p 443:443 \
     -e VITE_ENVIRONMENT=prod \
     -e VITE_SENTRY_DSN=your_sentry_dsn \
     -e VITE_SENTRY_AUTH_TOKEN=your_sentry_auth_token \
     -e VITE_AUTH0_DOMAIN=your_auth0_domain \
     -e VITE_AUTH0_CLIENTID=your_auth0_clientid \
     -e DOMAIN_NAME=your_domain_name \
     -e ADMIN_EMAIL=your_email@example.com \
     -v $(pwd)/letsencrypt:/etc/letsencrypt \
     -v $(pwd)/certbot:/var/www/certbot \
     --name tc-dashboard tc-dashboard
   ```

3. Access the application at `https://your_domain_name` (or `http://localhost` for local testing)

### SSL Support with Let's Encrypt

The Docker container is configured to automatically obtain and renew SSL certificates from Let's Encrypt. For this to work:

- Your server must be publicly accessible on ports 80 and 443
- The `DOMAIN_NAME` environment variable must be set to a domain that points to your server
- The `ADMIN_EMAIL` environment variable should be set to a valid email address

### Using Docker Compose

You can use Docker Compose for easier deployment:

```bash
# Copy the example environment file
cp .env.docker.example .env

# Edit the .env file with your actual values
nano .env

# Start the container
docker-compose up -d
```

## Project Structure

```
tc-dashboard-2.0/
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── main.tsx        # Application entry point
│   └── index.sass      # Global styles
├── dist/               # Production build output
├── .env                # Environment variables (not committed to git)
├── .env.example        # Example environment variables template
├── .env.docker.example # Example environment variables for Docker
├── Dockerfile          # Docker configuration for production deployment
├── docker-compose.yml  # Docker Compose configuration
├── DOCKER.md           # Docker deployment documentation
├── eslint.config.js    # ESLint configuration
├── tsconfig.json       # TypeScript configuration
├── tsconfig.app.json   # TypeScript application configuration
├── tsconfig.node.json  # TypeScript Node configuration
└── vite.config.ts      # Vite configuration
```

## Technologies

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [MUI Joy](https://mui.com/joy-ui/getting-started/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [SASS](https://sass-lang.com/)
- [Auth0](https://auth0.com/) - Authentication and authorization
- [Sentry](https://sentry.io/) - Error tracking and monitoring
- [React Cookie Consent](https://www.npmjs.com/package/react-cookie-consent) - Cookie consent banner

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is proprietary. All rights reserved.

For information about the licenses of dependencies used in this project, please see [LICENSES.md](LICENSES.md).

## Roadmap

For a list of planned features and improvements, see [TODO.md](TODO.md).

## Changelog

For a detailed history of changes to this project, see [CHANGELOG.md](CHANGELOG.md). This project follows [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/) principles.
