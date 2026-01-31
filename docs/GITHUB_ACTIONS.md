# GitHub Actions CI/CD Setup

This document explains how to configure and use the GitHub Actions workflows for the Ultimate Trivia Championship project.

## Overview

The project uses two main workflows:

- **CI Workflow** (`.github/workflows/ci.yml`) - Continuous Integration
- **CD Workflow** (`.github/workflows/cd.yml`) - Continuous Deployment

## CI Workflow

### Triggers

- Push to `main` branch
- Pull requests targeting `main` branch

### Jobs

The CI workflow runs the following jobs in parallel for maximum efficiency:

1. **Setup Dependencies** - Caches `node_modules` for faster subsequent jobs
2. **Type Check** - Runs TypeScript type checking across all packages
3. **Lint** - Runs ESLint on all packages
4. **Format Check** - Validates code formatting with Prettier
5. **Test** - Runs all tests with coverage collection
6. **Build** - Builds all packages and caches artifacts
7. **Security Scan** - Runs Trivy security scanning
8. **CI Success** - Final status check that fails if any job fails

### Features

#### Turborepo Caching

- Each job caches Turbo's build artifacts (`.turbo` directory)
- Remote caching is enabled if `TURBO_TOKEN` and `TURBO_TEAM` secrets are configured
- Significantly reduces build times for unchanged packages

#### Node Modules Caching

- Uses `actions/cache` with `package-lock.json` hash
- Shared across all jobs via the `setup` job
- Falls back to partial matches if exact match not found

#### Test Coverage

- Coverage reports are uploaded to Codecov
- Multiple coverage files are combined (API, Web, Docs)
- Requires `CODECOV_TOKEN` secret to be configured

#### Security Scanning

- Trivy scans for vulnerabilities in dependencies and configuration
- Results uploaded to GitHub Security tab
- Scans for CRITICAL and HIGH severity issues

#### Concurrency Control

- Automatically cancels in-progress runs when new commits are pushed
- Saves compute resources and reduces queue times

### Build Time Optimization

The workflow is designed to complete in under 5 minutes:

- Jobs run in parallel where possible
- Dependencies are cached aggressively
- Turbo only rebuilds changed packages
- Concurrency groups prevent redundant runs

## CD Workflow

### CD Triggers

- Push to `main` branch (automatic deployment)
- Push of version tags (e.g., `v1.0.0`) for releases

### CD Jobs

1. **Build for Deployment** - Production build with artifact uploads
2. **Deploy API** - Deploys the NestJS API (Docker example)
3. **Deploy Web** - Deploys the web application (Vercel example)
4. **Deploy Docs** - Deploys the documentation site (Vercel example)
5. **Create Release** - Creates GitHub release (tags only)

### Deployment Strategies

The CD workflow includes example deployments for common platforms:

#### API Deployment (AWS ECR)

- Authenticates with AWS using IAM credentials
- Builds Docker image from NestJS API
- Pushes to AWS ECR (Elastic Container Registry) in ca-west-1 region
- Uses Docker layer caching via GitHub Actions cache for faster builds
- Automatically generates fresh ECR tokens on each deployment

#### Web/Docs Deployment (Vercel)

- Uses Vercel's deployment action
- Automatically generates preview URLs
- Production deployments only on `main` branch

### Customization

Modify the deployment jobs based on your infrastructure:

- AWS (ECS, Lambda, Amplify)
- Google Cloud (Cloud Run, App Engine)
- Azure (App Service, Container Instances)
- Railway, Render, Fly.io, etc.

## Required Secrets

Configure these secrets in your GitHub repository settings:

### CI Secrets

| Secret          | Required | Purpose                         |
| --------------- | -------- | ------------------------------- |
| `CODECOV_TOKEN` | Yes      | Upload test coverage to Codecov |
| `TURBO_TOKEN`   | No       | Enable Turborepo remote caching |
| `TURBO_TEAM`    | No       | Turborepo team/organization ID  |

### CD Secrets

#### AWS ECR Deployment (API)

| Secret                  | Required | Purpose                                   |
| ----------------------- | -------- | ----------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | Yes      | AWS IAM access key for ECR authentication |
| `AWS_SECRET_ACCESS_KEY` | Yes      | AWS IAM secret key for ECR authentication |

**Region:** Hardcoded to `ca-west-1` in workflow
**ECR Repository:** `741553940567.dkr.ecr.ca-west-1.amazonaws.com/ultimate-trivia-api`

#### Vercel Deployment (Web/Docs)

| Secret                   | Required | Purpose                     |
| ------------------------ | -------- | --------------------------- |
| `VERCEL_TOKEN`           | Yes      | Vercel authentication token |
| `VERCEL_ORG_ID`          | Yes      | Vercel organization ID      |
| `VERCEL_PROJECT_ID`      | Yes      | Vercel project ID (web app) |
| `VERCEL_DOCS_PROJECT_ID` | Yes      | Vercel project ID (docs)    |

### How to Add Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the secret name and value
5. Click **Add secret**

### How to Get AWS Credentials

To deploy to AWS ECR, you need to create an IAM user with ECR permissions:

#### Step 1: Create IAM User

1. Log in to [AWS Console](https://console.aws.amazon.com)
2. Navigate to **IAM** → **Users** → **Create user**
3. User name: `github-actions-ultimate-trivia`
4. Click **Next**

#### Step 2: Attach Permissions

Choose **"Attach policies directly"** and add:

- ✅ **AmazonEC2ContainerRegistryPowerUser** (for ECR push/pull)

Or create a custom policy with minimal permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    }
  ]
}
```

Click **Next** → **Create user**

#### Step 3: Create Access Key

1. Click on the newly created user
2. Go to **"Security credentials"** tab
3. Scroll to **"Access keys"** section
4. Click **"Create access key"**
5. Choose **"Application running outside AWS"**
6. Click **Next** → Add description (e.g., "GitHub Actions CD") → **Create**

#### Step 4: Save Credentials

**CRITICAL:** Copy these immediately (you won't see them again):

- **Access key ID** - starts with `AKIA...`
- **Secret access key** - long random string

Add these to your GitHub secrets as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

### How to Get Vercel Credentials

#### Vercel Token

1. Go to [vercel.com](https://vercel.com) and log in
2. Click your profile/avatar → **Settings**
3. In left sidebar, click **Tokens**
4. Click **Create Token** or **Create**
5. Name: "GitHub Actions Deployment"
6. Set scope and expiration (optional but recommended)
7. Click **Create Token**
8. **Copy immediately** - you won't see it again

#### Vercel Organization/Team ID

1. Go to **Settings** → **General**
2. Find **Team ID** or **Your User ID**
3. Copy this value

#### Vercel Project IDs

For each project (web, docs):

1. Go to the project in Vercel dashboard
2. Click **Settings** → **General**
3. Find **Project ID**
4. Copy this value
5. Add to GitHub as `VERCEL_PROJECT_ID` or `VERCEL_DOCS_PROJECT_ID`

## Branch Protection Rules

To ensure failed checks block PR merges, configure branch protection rules:

### Setup Instructions

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Branches**
3. Click **Add branch protection rule**
4. Configure the following:

#### Branch Name Pattern

```text
main
```

#### Required Settings

- ✅ **Require a pull request before merging**
  - Require approvals: 1
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ **Allow specified actors to bypass required pull requests**
    - Add yourself (repository admin) to the bypass list
    - This allows you to merge without approval while working solo

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - **Required status checks:**
    - `CI Success` (this is the critical check)
    - `Type Check`
    - `Lint`
    - `Format Check`
    - `Test`
    - `Build`
    - `Security Scan`

- ✅ **Require conversation resolution before merging**

- ✅ **Do not allow bypassing the above settings**

#### Optional But Recommended

- ✅ **Require linear history** - Prevents merge commits
- ✅ **Require deployments to succeed before merging** - If using environments

### Example Configuration

```yaml
Protection Rules for 'main':
  - Require pull request reviews before merging (1 approval)
    - Allow specified actors to bypass (add yourself)
  - Require status checks to pass:
    ✓ CI Success
    ✓ Type Check
    ✓ Lint
    ✓ Format Check
    ✓ Test
    ✓ Build
    ✓ Security Scan
  - Require conversation resolution
  - Require linear history
```

## Turborepo Remote Caching Setup (Optional)

To enable remote caching and share build artifacts across CI runs and developers:

### Option 1: Vercel Remote Cache (Free for open source)

1. Sign up at [vercel.com](https://vercel.com)
2. Create a team or use your personal account
3. Run locally: `npx turbo login`
4. Run locally: `npx turbo link`
5. Get your team ID: shown during linking
6. The `npx turbo login` command automatically handles authentication
   - If you need a manual token, the workflow uses the token from `turbo login`
   - For the `TURBO_TOKEN` secret, use the token shown after running `npx turbo login`
   - Alternatively, tokens can be created via the Vercel CLI or API
7. Add secrets to GitHub:
   - `TURBO_TOKEN`: Your Vercel token (from step 6)
   - `TURBO_TEAM`: Your team ID (from step 5)

**Note:** The `turbo login` command provides the authentication token. You don't need to manually create it in Vercel's web interface.

### Option 2: Self-Hosted Remote Cache

See [Turborepo Remote Cache](https://turbo.build/repo/docs/core-concepts/remote-caching) documentation.

## Codecov Setup

1. Sign up at [codecov.io](https://codecov.io)
2. Add your GitHub repository
3. Copy the repository upload token
4. Add `CODECOV_TOKEN` secret to GitHub
5. Coverage reports will appear at `https://codecov.io/gh/YOUR_ORG/YOUR_REPO`

## Testing the Workflows Locally

### Using Act (GitHub Actions locally)

```bash
# Install act
npm install -g act

# Run CI workflow
act pull_request

# Run specific job
act pull_request -j test

# Run with secrets
act pull_request --secret-file .secrets
```

### Manual Testing

```bash
# Run all CI checks locally
npm run check-all

# Individual checks
npm run type-check
npm run lint
npm run format:check
npm run test:coverage
npm run build
```

## Monitoring and Debugging

### Viewing Workflow Runs

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select a workflow run to view details
4. Click on individual jobs to see logs

### Common Issues

#### Cache Misses

- Check if `package-lock.json` has changed
- Verify cache key matches across jobs
- GitHub caches expire after 7 days of no access

#### Turbo Not Caching

- Ensure `TURBO_TOKEN` and `TURBO_TEAM` secrets are set
- Verify network connectivity to Vercel
- Check Turbo cache size limits

#### Test Coverage Upload Fails

- Verify `CODECOV_TOKEN` is correct
- Check coverage files are generated
- Review Codecov dashboard for errors

#### Security Scan Failures

- Review Trivy results in Security tab
- Update vulnerable dependencies
- Add exceptions for false positives if needed

## Performance Metrics

Expected build times (with warm cache):

- **Type Check**: 30-60 seconds
- **Lint**: 30-60 seconds
- **Format Check**: 10-20 seconds
- **Test**: 1-2 minutes
- **Build**: 1-2 minutes
- **Security Scan**: 30-60 seconds
- **Total**: < 5 minutes (jobs run in parallel)

First run (cold cache) may take 8-10 minutes.

## Workflow Badges

Add these badges to your README.md:

```markdown
[![CI](https://github.com/alvesgf16/ultimate-trivia-championship/actions/workflows/ci.yml/badge.svg)](https://github.com/alvesgf16/ultimate-trivia-championship/actions/workflows/ci.yml)
[![CD](https://github.com/alvesgf16/ultimate-trivia-championship/actions/workflows/cd.yml/badge.svg)](https://github.com/alvesgf16/ultimate-trivia-championship/actions/workflows/cd.yml)
[![codecov](https://codecov.io/gh/alvesgf16/ultimate-trivia-championship/branch/main/graph/badge.svg)](https://codecov.io/gh/alvesgf16/ultimate-trivia-championship)
```

## Next Steps

1. Add required secrets to GitHub repository
2. Configure branch protection rules
3. Set up Codecov account and token
4. (Optional) Set up Turborepo remote caching
5. Customize CD workflow for your infrastructure
6. Test by creating a pull request
7. Add workflow badges to README.md

## Support

For issues with the workflows:

1. Check the Actions tab for detailed error logs
2. Review this documentation
3. Check GitHub Actions documentation
4. Open an issue in the repository
