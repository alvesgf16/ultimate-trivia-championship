# GitHub Actions Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Add Required Secrets

#### For CI (Required)

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add `CODECOV_TOKEN`:
   - Sign up at [codecov.io](https://codecov.io)
   - Add your repository
   - Copy the upload token
   - Add as secret

#### For CD - AWS ECR (Optional)

If deploying API to AWS:

1. Create IAM user in AWS (see full docs)
2. Add `AWS_ACCESS_KEY_ID`
3. Add `AWS_SECRET_ACCESS_KEY`

#### For CD - Vercel (Optional)

If deploying web/docs to Vercel:

1. Get token from Vercel settings
2. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_DOCS_PROJECT_ID`

### Step 2: Configure Branch Protection

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require pull request reviews (1 approval)
   - ✅ Require status checks: `CI Success`
   - ✅ Require conversation resolution
4. Save changes

### Step 3: Test It

1. Create a new branch: `git checkout -b test-ci`
2. Make a small change
3. Push and create a PR
4. Watch the CI checks run!

## 📋 What's Included

### CI Workflow (Runs on every PR)

- ✅ Type checking
- ✅ Linting
- ✅ Format checking
- ✅ Tests with coverage
- ✅ Build verification
- ✅ Security scanning
- ✅ Build time: < 5 minutes

### CD Workflow (Runs on main push)

- 🚀 Automated deployments
  - **API:** AWS ECR (Docker) in ca-west-1 region
  - **Web/Docs:** Vercel
- 📦 Build artifacts
- 🏷️ GitHub releases (on tags)

## 🎯 Acceptance Criteria Status

✅ GitHub Actions workflow runs on PR and push to main
✅ CI workflow runs: type-check, lint, format-check, tests
✅ Test coverage uploaded to Codecov
✅ Build artifacts cached between runs
✅ Security scanning with Trivy enabled
✅ Turbo cache working in CI
✅ Failed checks block PR merge (via branch protection)
✅ Build time < 5 minutes (parallel jobs + caching)

## 🔧 Optional Enhancements

### Turborepo Remote Caching (Faster Builds)

```bash
# Run locally - this will authenticate and provide your token
npx turbo login

# Link your project
npx turbo link

# The login command gives you the TURBO_TOKEN
# Add these secrets to GitHub:
# - TURBO_TOKEN (from turbo login output)
# - TURBO_TEAM (from turbo link output)
```

### Customize Deployment

The CD workflow is configured for:

- **API:** AWS ECR (ca-west-1) → Ready for ECS/EKS deployment
- **Web/Docs:** Vercel

To modify, edit [.github/workflows/cd.yml](.github/workflows/cd.yml):

- Change AWS region
- Add ECS/EKS deployment steps
- Switch to other platforms (Railway, Render, Fly.io)
- Add environment-specific configurations
- Vercel/Netlify
- AWS/GCP/Azure
- Railway/Render/Fly.io

## 📚 Full Documentation

See [docs/GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) for:

- Detailed workflow explanations
- All available secrets
- Troubleshooting guide
- Performance optimization tips
- Monitoring and debugging

## 🏃 Run Checks Locally

```bash
# All checks
npm run check-all

# Individual checks
npm run type-check
npm run lint
npm run format:check
npm run test:coverage
npm run build
```

## ✨ Workflow Features

- **Parallel Execution**: Jobs run simultaneously for speed
- **Smart Caching**: Node modules and Turbo cache preserved
- **Concurrency Control**: Auto-cancels outdated runs
- **Security First**: Trivy scans on every build
- **Coverage Tracking**: Automatic Codecov integration
- **Artifact Storage**: Build outputs saved for deployment

## 🎭 Workflow Badges

```markdown
[![CI](https://github.com/alvesgf16/ultimate-trivia-championship/actions/workflows/ci.yml/badge.svg)](https://github.com/alvesgf16/ultimate-trivia-championship/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/alvesgf16/ultimate-trivia-championship/branch/main/graph/badge.svg)](https://codecov.io/gh/alvesgf16/ultimate-trivia-championship)
```

## 🤝 Need Help?

- Check workflow logs in the **Actions** tab
- Review [docs/GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md)
- Open an issue if something's not working
