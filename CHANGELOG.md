- # Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Cookie Consent Banner
  - Added Library for Cookie Consent. 
  - Added a Banner for Cookie Consent
- Sentry integration for error tracking and monitoring
  - Added Sentry React SDK for error tracking
  - Configured session replay and browser tracing
  - Added environment-specific configuration
  - Enabled sourcemap generation for accurate error reporting
- Environment variable support
  - Added .env.example template
  - Updated .gitignore to exclude .env files
  - Added Sentry-specific environment variables
- Documentation updates
  - Added GitMoji usage guidelines to CONTRIBUTING.md
  - Added Semantic Versioning and Keep a Changelog principles to CONTRIBUTING.md
  - Created comprehensive CHANGELOG.md (this file)
  - Updated README.md with reference to CHANGELOG.md
  - Updated README.md with environment variable setup instructions

### Changed

- Enhanced TODO.md with additional tasks for security and monitoring integration
- Updated README.md with correct repository URL and project structure
- Updated TODO.md to mark Sentry integration task as completed

## [0.1.0] - 2023-06-28

### Added

- Initial project setup with React 19, TypeScript, and MUI Joy
- Project configuration
  - Vite 7 as build tool
  - ESLint for code quality
  - TypeScript configuration
  - SASS for styling
- Basic application structure
  - Component-based architecture
  - Placeholder page with "Coming Soon" message
  - Responsive layout using MUI Joy components
- UI Features
  - Dark/light mode with system preference detection using MUI Joy CssVarsProvider
  - Basic routing setup with React Router
- Documentation
  - Created README.md with project overview, setup instructions, and features
  - Added CONTRIBUTING.md with guidelines for contributors
  - Created LICENSES.md with list of dependencies and their licenses
  - Added TODO.md with prioritized task list

## [0.0.0] - 2023-06-26

### Added

- Initial repository setup
- Basic project scaffolding with Vite
- Added essential dependencies
  - React 19
  - TypeScript
  - MUI Joy
  - React Router
