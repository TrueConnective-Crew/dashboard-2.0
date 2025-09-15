# TC Dashboard 2.0

A modern dashboard application built with React, TypeScript, and MUI Joy.

## Overview

TC Dashboard 2.0 is a redesigned dashboard application, currently in early development. The application aims to provide a clean, intuitive interface for data visualization and management. This README consolidates the key information to set up, run, and contribute to the project.

## Stack Detection

- Language: TypeScript
- Runtime: Node.js (LTS recommended; exact version not pinned) — TODO: Specify exact Node version in .nvmrc or engines
- Frontend Framework: React 19
- UI Library: MUI Joy
- Router: React Router 7
- Build Tool/Bundler: Vite 7
- Styling: SASS
- Error Tracking: Sentry
- Auth: Auth0
- Package Manager: Yarn (yarn.lock present)

### Entry Points
- Application entry: src/main.tsx
- HTML template: index.html
- Dev server: Vite (vite config in vite.config.ts)

## Requirements

- Node.js (LTS recommended)
- Yarn package manager (classic)
- For Docker deployment: Docker and Docker Compose, a resolvable domain, and open ports 80/443

## Setup

1) Clone the repository

   git clone https://github.com/TrueConnective-Crew/tc-dashboard-2.0.git
   cd tc-dashboard-2.0

2) Install dependencies

   yarn install

3) Environment variables
- A sample .env is committed. Copy .env.example to .env and adjust values.

4) Run in development

   yarn dev

5) Open the app
- http://localhost:5173

## Scripts

From package.json:
- yarn dev — Start Vite dev server
- yarn build — Type-check (tsc -b) and build with Vite
- yarn lint — Run ESLint
- yarn preview — Preview the production build

## Environment Variables
The app reads the following variables via import.meta.env (Vite):

Application/Sentry
- VITE_SENTRY_DSN — Sentry DSN
- VITE_ENVIRONMENT — dev | prod (used to tune Sentry configuration)
- VITE_SENTRY_AUTH_TOKEN — Used by Sentry tooling during build/upload (not read at runtime in browser)

Auth0
- VITE_AUTH0_DOMAIN — Auth0 tenant domain
- VITE_AUTH0_CLIENTID — Auth0 application Client ID

Docker/SSL (used by deployment setup)
- DOMAIN_NAME — Public domain for the app
- ADMIN_EMAIL — Email for Let's Encrypt registration

Note: keep secrets out of version control. Use separate .env files per environment. They are not committed to the repo and are ignored by .gitignore.

## Running and Building

- Development: yarn dev
- Lint: yarn lint
- Production build: yarn build (artifacts in dist/)
- Preview build locally: yarn preview

## Tests

Currently there is no test setup in the repository. TODO: Add unit/integration/E2E testing and document commands here.

## Project Structure

Root files and directories of this repository:

tc-dashboard-2.0/
├── src/                # Source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── main.tsx        # Application entry point
│   └── index.sass      # Global styles
├── index.html          # Vite HTML entry
├── vite.config.ts      # Vite configuration
├── eslint.config.js    # ESLint configuration
├── tsconfig.json       # TypeScript configuration
├── tsconfig.app.json   # TS app config
├── tsconfig.node.json  # TS node config
├── Dockerfile          # Multi-stage build to Nginx
├── docker-compose.yml  # Nginx + nginx-proxy + acme-companion
├── nginx.conf          # Nginx conf for SPA
├── .env                # Local env vars (not committed typically)
├── README.md
├── DOCKER.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSES.md
├── TODO.md
└── yarn.lock

## Docker Deployment

See DOCKER.md for full instructions. Summary:
- Create a .env with app and deployment variables
- docker-compose up -d
- Access via https://your-domain after certificates are provisioned

## License

Project status: proprietary (no root LICENSE file present). TODO: Add a top-level LICENSE or clarify licensing.

Dependency licenses are listed in LICENSES.md.

## Changelog

See CHANGELOG.md. This project follows Semantic Versioning and Keep a Changelog.

## Contributing

See CONTRIBUTING.md for guidelines, coding standards, and workflow.
