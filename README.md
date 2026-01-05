# Ultimate Trivia Championship

A modern full-stack trivia application built with a monorepo architecture using Turborepo.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

```sh
node --version
npm --version
```

## 🚀 Quick Start

### 1. Clone the Repository

```sh
git clone https://github.com/alvesgf16/ultimate-trivia-championship.git
cd ultimate-trivia-championship
```

> **Note**: Replace `YOUR-USERNAME` with your actual GitHub username once you create the repository.

### 2. Install Dependencies

Install all dependencies for all apps and packages:

```sh
npm install
```

This will install dependencies for all workspaces in the monorepo.

### 3. Set Up Git Hooks (Optional)

The project uses Husky for git hooks. If you want to enable commit linting and pre-commit checks:

```sh
npm run prepare
```

### 4. Start Development

To start all applications in development mode:

```sh
npm run dev
```

This will start:

- **API** (NestJS): Running on `http://localhost:3333`
- **Web App** (Next.js): Running on `http://localhost:3000`
- **Docs** (Next.js): Running on `http://localhost:3001`

## 📦 What's Inside?

This Turborepo includes the following packages and apps:

### Apps

- **`api`**: A [NestJS](https://nestjs.com/) backend API server
- **`web`**: The main [Next.js](https://nextjs.org/) web application (port 3000)
- **`docs`**: A [Next.js](https://nextjs.org/) documentation site (port 3001)

### Packages

- **`@repo/ui`**: A shared React component library used by both Next.js applications
- **`@repo/config`**: Shared ESLint configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- **`@repo/types`**: Shared TypeScript configurations (`tsconfig.json`) used throughout the monorepo

All packages and apps are written in [TypeScript](https://www.typescriptlang.org/).

## 🛠️ Tech Stack

- **[Turborepo](https://turbo.build/repo)** - High-performance build system for monorepos
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking
- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework for the API
- **[Next.js](https://nextjs.org/)** - React framework for web applications
- **[React 19](https://react.dev/)** - UI library
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io)** - Code formatting
- **[Jest](https://jestjs.io/)** - Testing framework
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Commitlint](https://commitlint.js.org/)** - Commit message linting

## 📖 Available Scripts

### Development

```sh
# Start all apps in development mode
npm run dev

# Start a specific app
npx turbo dev --filter=web
npx turbo dev --filter=api
npx turbo dev --filter=docs
```

### Building

```sh
# Build all apps and packages
npm run build

# Build a specific app
npx turbo build --filter=web
npx turbo build --filter=api
```

### Testing

```sh
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests for the API
cd apps/api
npm run test:e2e
```

### Code Quality

```sh
# Run all checks (format, lint, type-check, test)
npm run check-all

# Lint all code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Check code formatting
npm run format:check

# Format all code
npm run format

# Type check all TypeScript code
npm run type-check

# Find unused dependencies and exports
npm run unused
```

## 🏗️ Project Structure

```plaintext
ultimate-trivia-championship/
├── apps/
│   ├── api/          # NestJS backend API
│   ├── docs/         # Documentation Next.js app
│   └── web/          # Main Next.js web app
├── packages/
│   ├── config/       # Shared ESLint configurations
│   ├── types/        # Shared TypeScript configurations
│   └── ui/           # Shared React UI components
├── package.json      # Root package.json with workspace scripts
├── turbo.json        # Turborepo configuration
└── README.md         # This file
```

## 🔧 Working with Individual Apps

### API (NestJS)

```sh
cd apps/api

# Development
npm run dev

# Build
npm run build

# Start production server
npm run start:prod

# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

### Web/Docs (Next.js)

```sh
cd apps/web  # or apps/docs

# Development
npm run dev

# Build
npm run build

# Start production server
npm run start

# Type check
npm run type-check
```

## 🎯 Development Workflow

1. **Create a new branch** for your feature or bug fix

   ```sh
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and ensure they pass all checks

   ```sh
   npm run check-all
   ```

3. **Commit your changes** (Commitlint will enforce conventional commit format)

   ```sh
   git add .
   git commit -m "feat: add new trivia feature"
   ```

4. **Push your changes** and create a pull request

   ```sh
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semi-colons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 🚀 Deployment

### Building for Production

```sh
# Build all apps
npm run build

# Or build specific apps
npx turbo build --filter=api
npx turbo build --filter=web
npx turbo build --filter=docs
```

### Running in Production

**API:**

```sh
cd apps/api
npm run start:prod
```

**Next.js Apps:**

```sh
cd apps/web  # or apps/docs
npm run start
```

## 🔍 Troubleshooting

### Dependency Issues

If you encounter dependency-related errors:

```sh
# Clean all node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

### Build Cache Issues

If builds are failing unexpectedly:

```sh
# Clear Turborepo cache
npx turbo clean

# Rebuild everything
npm run build
```

### Port Already in Use

If a port is already in use, you can either:

1. Stop the process using that port
2. Change the port in the respective app's `package.json` dev script

## 📚 Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)

## � Remote Caching (Optional)

Turborepo can use a Remote Cache to share build outputs across machines and CI/CD pipelines. To enable this with Vercel:

1. **Authenticate with Vercel**:

   ```sh
   npx turbo login
   ```

2. **Link your repository**:

   ```sh
   npx turbo link
   ```

This will speed up builds by sharing cache between team members and CI environments.

## 📝 License

MIT License - Feel free to use this project for learning and portfolio purposes.

## 🔗 Useful Links

Learn more about the technologies used:

- [Turborepo Documentation](https://turbo.build/repo/docs)
  - [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
  - [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
  - [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
  - [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
