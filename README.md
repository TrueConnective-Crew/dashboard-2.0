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

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- Yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tc-dashboard-2.0.git
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

## Project Structure

```
tc-dashboard-2.0/
├── public/             # Static assets
├── src/                # Source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── main.tsx        # Application entry point
│   └── index.sass      # Global styles
├── .env                # Environment variables (not committed to git)
├── .env.example        # Example environment variables template
├── .eslintrc.js        # ESLint configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Technologies

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [MUI Joy](https://mui.com/joy-ui/getting-started/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [SASS](https://sass-lang.com/)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is proprietary. All rights reserved.

For information about the licenses of dependencies used in this project, please see [LICENSES.md](LICENSES.md).

## Roadmap

For a list of planned features and improvements, see [TODO.md](TODO.md).

## Changelog

For a detailed history of changes to this project, see [CHANGELOG.md](CHANGELOG.md). This project follows [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/) principles.
