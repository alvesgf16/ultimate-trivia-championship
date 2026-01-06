# Contributing to Ultimate Trivia Championship

Thank you for your interest in contributing! This guide will help you get started with the development workflow and code quality standards.

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

```bash
npm install
```

This will install dependencies and set up Husky git hooks automatically.

## Development Workflow

### Available Scripts

From the root of the monorepo:

```bash
# Development
npm run dev              # Start all apps in development mode

# Code Quality
npm run lint             # Run ESLint across all packages
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format all files with Prettier
npm run format:check     # Check if files are formatted
npm run type-check       # Run TypeScript type checking
npm run check-all        # Run all checks (format, lint, type-check, test)

# Testing
npm run test             # Run tests in all packages
npm run test:coverage    # Run tests with coverage

# Build
npm run build            # Build all packages
```

## Code Quality Standards

### ESLint

We use ESLint with TypeScript support and strict rules:

- **Import Ordering**: Imports are automatically organized and sorted alphabetically
- **Complexity Analysis**: Maximum cognitive complexity of 15 (via SonarJS)
- **Unused Code**: Unused imports and variables are flagged as errors
- **TypeScript**: Strict type checking with floating promises detection

### Prettier

All code is formatted with Prettier using these settings:

- Single quotes for strings
- Semicolons enabled
- Trailing commas everywhere
- 80 character line width
- 2 space indentation

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

**Format**: `type(scope): subject`

**Valid types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (dependencies, etc.)
- `revert`: Revert a previous commit

**Examples:**

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify error handling logic"
```

**Invalid commits will be rejected:**

- Missing type prefix
- Uppercase type
- Subject ending with period
- Empty subject

## Git Hooks

### Pre-commit Hook

Automatically runs on every commit:

1. **Prettier**: Formats all staged TypeScript files
2. **ESLint**: Lints and auto-fixes staged files
3. **Type Check**: Runs TypeScript compiler across entire project

If any step fails, the commit is blocked until issues are resolved.

### Commit-msg Hook

Validates commit messages follow Conventional Commits format. Invalid messages are rejected with helpful error messages.

## VSCode Setup

### Recommended Extensions

When you open the project, VSCode will suggest installing recommended extensions:

- **Prettier**: Auto-formatting
- **ESLint**: Linting and auto-fix
- **TypeScript**: Enhanced TypeScript support
- **Error Lens**: Inline error display
- **Code Spell Checker**: Catch typos

### Editor Settings

The workspace is configured to:

- Format on save with Prettier
- Auto-fix ESLint issues on save
- Use workspace TypeScript version
- Trim trailing whitespace
- Insert final newline

## Monorepo Structure

```plaintext
├── apps/
│   ├── api/          # NestJS backend
│   ├── web/          # Next.js frontend
│   └── docs/         # Documentation site
├── packages/
│   ├── config/       # Shared ESLint configs
│   ├── types/        # Shared TypeScript types
│   └── ui/           # Shared UI components
```

### Working in the Monorepo

Each app/package has its own:

- `package.json` with local scripts
- ESLint configuration (inherits from shared configs)
- TypeScript configuration

Changes to shared packages are automatically picked up by dependent apps.

## Code Review Guidelines

Before submitting a PR:

1. ✅ Run `npm run check-all` - all checks must pass
2. ✅ Write meaningful commit messages following Conventional Commits
3. ✅ Add tests for new features
4. ✅ Update documentation if needed
5. ✅ Ensure no console.log statements (use console.warn/error if needed)

## Troubleshooting

### ESLint Issues

```bash
# Clear ESLint cache
rm -rf .eslintcache apps/*/.eslintcache

# Re-run lint
npm run lint
```

### TypeScript Errors

```bash
# Clean build artifacts
npm run clean  # if available
rm -rf apps/*/dist packages/*/dist

# Re-run type check
npm run type-check
```

### Git Hooks Not Running

```bash
# Reinstall Husky
npm run prepare
```

### Format Check Failing

```bash
# Auto-format all files
npm run format

# Verify formatting
npm run format:check
```

## Getting Help

- Check existing issues on GitHub
- Review the documentation in `/apps/docs`
- Ask questions in discussions

## License

By contributing, you agree that your contributions will be licensed under the project's license.
