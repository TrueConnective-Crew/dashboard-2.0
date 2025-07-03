# Contributing to TC Dashboard 2.0

Thank you for your interest in contributing to TC Dashboard 2.0! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details (browser, OS, etc.)

### Suggesting Enhancements

We welcome suggestions for enhancements! Please create an issue with:

1. A clear, descriptive title
2. A detailed description of the proposed enhancement
3. Any relevant mockups or examples
4. Why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

#### Pull Request Guidelines

- Follow the existing code style
- Update documentation as needed
- Include tests for new features
- Keep pull requests focused on a single concern
- Reference any relevant issues

## Development Setup

1. Fork and clone the repository
2. Install dependencies with `yarn install`
3. Start the development server with `yarn dev`

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Ensure proper typing for all variables, functions, and components
- Avoid using `any` type when possible

### React

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use proper prop types

### Styling

- Use MUI Joy components when possible
- For custom styling, use the provided styling system
- Ensure responsive design works on all screen sizes

## Testing

- Write tests for all new features
- Ensure all tests pass before submitting a pull request
- Test across different browsers and devices when possible

## Git Workflow

1. Create a branch for your work
2. Make small, focused commits with clear messages
3. Keep your branch updated with the main repository
4. Squash commits before merging if necessary
5. Use GitMoji in commit messages to categorize changes (see below)

### GitMoji

We use GitMoji to add visual cues to our commit messages. This helps to quickly identify the purpose of a commit. Please prefix your commit messages with the appropriate emoji:

- 🎨 `:art:` - Improve structure/format of the code
- ✨ `:sparkles:` - Introduce new features
- 🐛 `:bug:` - Fix a bug
- 📝 `:memo:` - Add or update documentation
- ♻️ `:recycle:` - Refactor code
- 🔧 `:wrench:` - Add or update configuration files
- 🚀 `:rocket:` - Deploy stuff
- 🔒 `:lock:` - Fix security issues
- ⬆️ `:arrow_up:` - Upgrade dependencies
- ⬇️ `:arrow_down:` - Downgrade dependencies
- 🚨 `:rotating_light:` - Fix linter warnings

Example: `🐛 fix: resolve issue with authentication timeout`

## Versioning

This project follows [Semantic Versioning](https://semver.org/) (SemVer). Version numbers are in the format MAJOR.MINOR.PATCH:

1. MAJOR version for incompatible API changes
2. MINOR version for backwards-compatible functionality additions
3. PATCH version for backwards-compatible bug fixes

When contributing, be mindful of how your changes might affect the version number:
- Bug fixes will increment the PATCH version
- New features that don't break existing functionality will increment the MINOR version
- Breaking changes will increment the MAJOR version

## Changelog

We follow the [Keep a Changelog](https://keepachangelog.com/) principles for maintaining our CHANGELOG.md file. All notable changes to the project should be documented in this file.

When submitting a pull request, please include relevant changes to the CHANGELOG.md file under the "Unreleased" section, organized by type of change:

- Added - for new features
- Changed - for changes in existing functionality
- Deprecated - for soon-to-be removed features
- Removed - for now removed features
- Fixed - for any bug fixes
- Security - for security vulnerabilities

Example changelog entry:
```
## [Unreleased]
### Added
- New feature X that does Y
### Fixed
- Issue with component Z not rendering properly
```

## Code Review Process

All submissions require review. We use GitHub pull requests for this purpose.

## License

By contributing to TC Dashboard 2.0, you agree that your contributions will be licensed under the project's license.

Thank you for contributing to TC Dashboard 2.0!
