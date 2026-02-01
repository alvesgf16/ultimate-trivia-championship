# CI Failure Resolution Guide

This guide helps you understand and resolve common CI failures in GitHub Actions.

## Quick Reference

| Check      | Command to Run Locally | Fix Command                    |
| ---------- | ---------------------- | ------------------------------ |
| Type Check | `npm run type-check`   | Fix TypeScript errors manually |
| Lint       | `npm run lint`         | `npm run lint:fix`             |
| Format     | `npm run format:check` | `npm run format`               |
| Test       | `npm run test`         | Fix failing tests              |
| Build      | `npm run build`        | Fix compilation errors         |

## Understanding CI Workflow

The CI workflow runs these jobs in parallel:

1. **Setup** - Installs dependencies
2. **Type Check** - Validates TypeScript
3. **Lint** - Checks code quality
4. **Format Check** - Validates formatting
5. **Test** - Runs tests with coverage
6. **Build** - Builds all packages
7. **Security** - Scans for vulnerabilities

All must pass for the **CI Success** check to pass.

## Common Failures and Solutions

### 1. Type Check Failure

**Symptom:** `Type Check` job fails

**How to diagnose:**

```bash
npm run type-check
```

**Common causes:**

- Missing type definitions
- Incorrect type annotations
- Breaking changes in dependencies

**How to fix:**

1. Review TypeScript errors in the output
2. Fix type errors in reported files
3. Add missing type imports
4. Update type definitions if needed

**Example error:**

```text
src/app.ts:10:5 - error TS2322: Type 'string' is not assignable to type 'number'.
```

**Fix:** Correct the type annotation or value

### 2. Lint Failure

**Symptom:** `Lint` job fails

**How to diagnose:**

```bash
npm run lint
```

**Common causes:**

- Unused variables
- Missing semicolons
- Incorrect import order
- Code complexity issues

**How to fix:**

```bash
# Auto-fix most issues
npm run lint:fix

# Review remaining issues
npm run lint
```

**Manual fixes:**

- Remove unused imports/variables
- Fix code complexity (extract functions)
- Follow ESLint error suggestions

### 3. Format Check Failure

**Symptom:** `Format Check` job fails

**How to diagnose:**

```bash
npm run format:check
```

**How to fix:**

```bash
# Auto-format all files
npm run format
```

**Note:** This is the easiest to fix - just run the format command!

### 4. Test Failure

**Symptom:** `Test` job fails

**How to diagnose:**

```bash
npm run test

# Or with coverage
npm run test:coverage
```

**Common causes:**

- Broken tests due to code changes
- Missing test updates
- Async timing issues
- Environment-specific issues

**How to fix:**

1. Read the test failure output carefully
2. Identify which test is failing
3. Run the specific test locally
4. Fix the test or the code causing failure
5. Ensure coverage hasn't decreased

**Example:**

```bash
# Run specific test file
npm test -- app.controller.spec.ts

# Run in watch mode
npm run test:watch
```

### 5. Build Failure

**Symptom:** `Build` job fails

**How to diagnose:**

```bash
npm run build
```

**Common causes:**

- Compilation errors
- Missing dependencies
- Import path issues
- Configuration errors

**How to fix:**

1. Review build errors in output
2. Fix syntax/compilation errors
3. Verify all imports are correct
4. Check tsconfig.json settings
5. Ensure all dependencies are installed

**Turbo-specific issues:**

```bash
# Clear Turbo cache
rm -rf .turbo

# Rebuild
npm run build
```

### 6. Security Scan Issues

**Symptom:** Security scan completes but reports vulnerabilities

**How to diagnose:**

```bash
# Locally (if Trivy installed)
trivy fs . --severity HIGH,CRITICAL

# Or check GitHub Security tab
```

**Common causes:**

- Vulnerable dependencies
- Outdated packages

**How to fix:**

1. Review vulnerabilities in Security tab
2. Update affected packages:

   ```bash
   npm update [package-name]
   ```

3. Or update to specific version:

   ```bash
   npm install [package]@[version]
   ```

4. Run `npm audit` for additional info
5. Rerun security scan to verify

**Note:** Security scans don't fail the build by default, but should be addressed.

### 7. Cache Issues

**Symptom:** Jobs are slow or showing unexpected behavior

**How to fix:**

1. Go to **Settings → Actions → Caches**
2. Delete old caches
3. Re-run the workflow

Local Turbo cache issues:

```bash
# Clear local cache
rm -rf .turbo
npm run build
```

## Debugging in CI

### View Detailed Logs

1. Go to **Actions** tab
2. Click the failing workflow run
3. Click the failing job
4. Expand the failing step
5. Read the error output

### Re-run Failed Jobs

1. Go to the workflow run
2. Click **Re-run failed jobs**
3. Or **Re-run all jobs** to start fresh

### Run Locally First

**Always run checks locally before pushing:**

```bash
# Run all checks
npm run check-all

# Or individual checks
npm run type-check
npm run lint
npm run format:check
npm run test:coverage
npm run build
```

## Workflow-Specific Issues

### Concurrency Issues

If a workflow is cancelled due to newer commits:

- This is normal (saves resources)
- The latest workflow run is what matters

### Permission Issues

If seeing "Permission denied" errors:

- Check the workflow has required permissions
- Verify secrets are configured correctly

### Dependency Issues

If seeing "module not found" errors:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. Commit updated `package-lock.json`

## Getting Help

### Check Documentation

- [GitHub Actions Setup](./GITHUB_ACTIONS.md)
- [Quick Start Guide](./GITHUB_ACTIONS_QUICK_START.md)

### Review Logs

- Actions tab → Workflow run → Job → Step

### Local Testing

```bash
# Run all CI checks locally
npm run check-all
```

### Common Commands

```bash
# Fix formatting
npm run format

# Fix auto-fixable lint issues
npm run lint:fix

# Clear all caches
rm -rf node_modules .turbo apps/*/node_modules packages/*/node_modules
npm install

# Full clean build
npm run build
```

## Prevention

### Before Pushing

1. Run `npm run check-all` locally
2. Ensure all checks pass
3. Review your changes
4. Write/update tests as needed

### Pre-commit Hooks

The project uses Husky for pre-commit hooks that run:

- Linting on staged files
- Formatting checks
- Type checking (optional)

This catches issues before they reach CI.

### VS Code Integration

Install recommended extensions:

- ESLint
- Prettier
- TypeScript

Enable format on save in VS Code settings.

## CI Badge Status

Add to your README to show CI status:

```markdown
[![CI](https://github.com/alvesgf16/ultimate-trivia-championship/actions/workflows/ci.yml/badge.svg)](https://github.com/alvesgf16/ultimate-trivia-championship/actions/workflows/ci.yml)
```

## Summary

Most CI failures can be prevented by:

1. ✅ Running `npm run check-all` before pushing
2. ✅ Fixing issues locally first
3. ✅ Keeping dependencies updated
4. ✅ Writing tests for new features
5. ✅ Following code style guidelines

When failures occur:

1. 📖 Read the error message carefully
2. 🔍 Run the failing check locally
3. 🛠️ Fix the issue
4. ✅ Verify locally before pushing again
