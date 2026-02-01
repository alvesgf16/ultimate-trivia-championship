# SonarCloud Setup Guide

This guide walks you through setting up SonarCloud for continuous code quality and security analysis.

## Prerequisites

- GitHub repository with admin access
- SonarCloud account (sign up at <https://sonarcloud.io>)

## Setup Steps

### 1. Create SonarCloud Project

1. Go to <https://sonarcloud.io>
2. Sign in with your GitHub account
3. Click on the **+** icon in the top-right corner and select **Analyze new project**
4. Select your repository: `alvesgf16/ultimate-trivia-championship`
5. Click **Set Up** to create the project
6. Choose **With GitHub Actions** as the analysis method

### 2. Configure GitHub Secrets

1. In SonarCloud, go to **My Account** → **Security** → **Generate Tokens**
2. Create a new token with a descriptive name (e.g., "ultimate-trivia-championship-ci")
3. Copy the generated token
4. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
5. Click **New repository secret**
6. Name: `SONAR_TOKEN`
7. Value: Paste the token you copied
8. Click **Add secret**

### 3. Configure Quality Gate (SonarCloud Dashboard)

1. In SonarCloud, navigate to your project
2. Go to **Project Settings** → **Quality Gates**
3. Create a new quality gate or edit the existing one with these settings:
   - **Coverage on New Code**: 80% minimum
   - **Critical Issues**: 0 (blocks merge if any critical issues found)
   - **Complexity per Function**: 10 maximum
4. Set this quality gate as the default for your project

### 4. Configure Branch Protection Rules (Optional but Recommended)

To enforce that PRs pass the quality gate before merging:

1. Go to your GitHub repository → **Settings** → **Branches**
2. Under **Branch protection rules**, click **Add rule** (or edit existing rule for `main`)
3. Branch name pattern: `main`
4. Enable **Require status checks to pass before merging**
5. Search for and select: `SonarCloud Analysis` and `Check SonarCloud Quality Gate`
6. Enable **Require branches to be up to date before merging**
7. Click **Create** or **Save changes**

This ensures that:

- All PRs must pass SonarCloud analysis
- Quality gate must pass before merge
- Branch must be up to date with base branch

### 5. Verify the Setup

1. Push a commit to a feature branch
2. Create a pull request
3. Wait for the CI/CD pipeline to run
4. Verify that:
   - SonarCloud analysis runs successfully
   - Coverage reports are uploaded
   - Quality gate status is displayed in the PR
   - Quality gate badges appear in the README

## Configuration Files

The following files have been configured for SonarCloud:

### `sonar-project.properties`

This file contains the SonarCloud project configuration:

- Project identification (key, organization, name)
- Source code and test patterns
- Coverage report paths
- Exclusions (node_modules, build artifacts, etc.)
- Duplication exclusions for test files
- Complexity thresholds (set to 10)

### `.github/workflows/ci.yml`

The CI workflow has been updated with:

- **SonarCloud job**: Runs after tests complete
  - Checks out code with full git history (required for better analysis)
  - Restores coverage reports from cache
  - Runs SonarCloud scan
  - Checks quality gate status
- **Coverage caching**: Test coverage is cached for SonarCloud to use
- **CI success job**: Updated to include SonarCloud job status

## Quality Gate Configuration

The quality gate is configured with the following criteria:

| Metric          | Threshold | Description                                |
| --------------- | --------- | ------------------------------------------ |
| Coverage        | 80%       | Minimum test coverage required             |
| Critical Issues | 0         | No critical issues allowed                 |
| Complexity      | 10        | Maximum cyclomatic complexity per function |

## Exclusions

The following are excluded from SonarCloud analysis:

### General Exclusions

- `node_modules/**`
- `dist/**`, `build/**`, `.next/**`
- `coverage/**`
- Configuration files (`*.config.js`, `*.config.mjs`, `*.config.ts`)

### Duplication Check Exclusions

- Test files (`*.spec.ts`, `*.test.ts`, `*.e2e-spec.ts`)
- Test directories (`test/**`)

### Coverage Exclusions

- Test files
- Configuration files

## Badges

The following SonarCloud badges have been added to the README:

- **Quality Gate Status**: Overall pass/fail status
- **Coverage**: Test coverage percentage
- **Security Rating**: Security vulnerability rating
- **Maintainability Rating**: Code maintainability score

## Troubleshooting

### Issue: SonarCloud analysis fails with "No coverage report found"

**Solution**: Ensure tests are running before the SonarCloud job and coverage reports are cached:

```yaml
- name: Cache coverage for SonarCloud
  uses: actions/cache@v4
  with:
    path: ./apps/api/coverage
    key: ${{ runner.os }}-coverage-${{ github.sha }}
```

### Issue: Quality gate fails on first run

**Solution**: This is normal. SonarCloud needs at least one successful scan to establish a baseline. The quality gate will be evaluated on subsequent runs.

### Issue: "SONAR_TOKEN not found" error

**Solution**:

1. Verify that `SONAR_TOKEN` is set in GitHub repository secrets
2. Ensure the token has not expired
3. Check that the token has the correct permissions

### Issue: High duplication detection in test files

**Solution**: Test files are already excluded from duplication checks via `sonar.cpd.exclusions` in `sonar-project.properties`.

## Next Steps

1. Monitor code quality metrics in the SonarCloud dashboard
2. Review and fix any issues identified by SonarCloud
3. Adjust quality gate thresholds as needed for your project
4. Consider adding additional metrics to the quality gate (e.g., code smells, technical debt)

## Resources

- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [SonarCloud GitHub Action](https://github.com/SonarSource/sonarcloud-github-action)
- [Quality Gate Documentation](https://docs.sonarcloud.io/improving/quality-gates/)
