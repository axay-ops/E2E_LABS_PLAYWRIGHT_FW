# Docker Setup Guide

This guide explains how to build, run, publish, and use your Playwright testing framework as a Docker image, both locally and in CI/CD pipelines like GitHub Actions.

## Prerequisites

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
2. Docker Hub account (sign up at [hub.docker.com](https://hub.docker.com))
3. GitHub repository with Actions enabled (for CI/CD integration)

## Building the Docker Image

### 1. Build locally

```bash
# Build the image
docker build -t e2e-playwright-tests .

# Or with a specific tag version
docker build -t e2e-playwright-tests:1.0.0 .
```

### 2. Test the image locally

**Important:** Since `.env.keys` is excluded from the image for security, pass the decryption key as an environment variable.

```bash
# Get your decryption key from .env.keys file
# For ENV=qa, use DOTENV_PRIVATE_KEY_QA value

# Run specific test file
docker run --rm \
  -e ENV=qa \
  -e DOTENV_PRIVATE_KEY_QA=XXX \
  e2e-playwright-tests npx playwright test ./tests/loginpage.spec.ts

# Run specific test suite
docker run --rm \
  -e ENV=qa \
  -e DOTENV_PRIVATE_KEY_QA=XXX \
  e2e-playwright-tests npm run test:qa

# Run and mount results directory to view reports
docker run --rm \
  -e ENV=qa \
  -e DOTENV_PRIVATE_KEY_QA=XXX \
  -v "$(pwd)/test-results:/app/test-results" \
  e2e-playwright-tests
```

**For different environments:**
- `ENV=qa` → Use `DOTENV_PRIVATE_KEY_QA` from `.env.keys`
- `ENV=stage` → Use `DOTENV_PRIVATE_KEY_STAGE` from `.env.keys`
- `ENV=prod` → Use `DOTENV_PRIVATE_KEY_PROD` from `.env.keys`

**Why pass as environment variable?**
- `.env.qa`, `.env.prod`, etc. contain encrypted data using dotenvx
- `.env.keys` is excluded from the Docker image (for security)
- Passing key via `-e` flag allows decryption without embedding keys in the image
- Same approach works in CI/CD with secrets managers

### 3. Using Docker Compose (Recommended for local development)

```bash
# Build and run
docker-compose up

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop and remove containers
docker-compose down
```

## Publishing to Docker Hub

### Automated Publishing (Recommended)

The project includes a GitHub Actions workflow ([`.github/workflows/docker-build-push.yml`](.github/workflows/docker-build-push.yml)) that **automatically builds and pushes** your Docker image whenever you push code changes.

📖 **See [CI_CD_PIPELINE.md](CI_CD_PIPELINE.md) for complete automation workflow guide with diagrams, timing, and troubleshooting.**

#### Setup (One-time):

1. **Add Docker Hub credentials to GitHub Secrets:**
   - Go to your repository → **Settings** → **Secrets and variables** → **Actions**
   - Add these secrets:
     - `DOCKER_HUB_USERNAME` = your Docker Hub username
     - `DOCKER_HUB_TOKEN` = your Docker Hub access token (get from [Docker Hub](https://hub.docker.com) → Account Settings → Security → New Access Token)

2. **Update Docker image name in workflow:**
   - Edit [`.github/workflows/docker-build-push.yml`](.github/workflows/docker-build-push.yml) line 31:
   ```yaml
   DOCKER_IMAGE: yourusername/e2e-playwright-tests  # ← Change this
   ```

#### How it works:

**Automatic Triggers:**
- ✅ Pushes to `main` branch (when Dockerfile, tests, or dependencies change)
- ✅ Manual workflow dispatch with optional custom tag

**Tags created automatically:**
- `latest` - Always points to the most recent build
- `<commit-sha>` - Specific commit for rollback (e.g., `abc123def`)
- `<custom-tag>` - Optional tag when manually triggered

**After pushing code:**
```bash
git add .
git commit -m "Update tests"
git push origin main

# GitHub Actions automatically:
# 1. Builds Docker image
# 2. Pushes to Docker Hub with tags: latest, commit-sha
# 3. Optionally triggers test workflow
```

### Manual Publishing (Alternative)

If you prefer to build and push manually:

#### 1. Login to Docker Hub

```bash
docker login
# Enter your Docker Hub username and password
```

#### 2. Build and tag your image

```bash
# Build with latest tag
docker build -t yourusername/e2e-playwright-tests:latest .

# Optionally tag with version
docker tag yourusername/e2e-playwright-tests:latest yourusername/e2e-playwright-tests:v1.0.0
```

#### 3. Push to Docker Hub

```bash
# Push latest
docker push yourusername/e2e-playwright-tests:latest

# Push specific version
docker push yourusername/e2e-playwright-tests:v1.0.0
```

#### 4. Pull and run from Docker Hub (on any machine)

```bash
# Pull the image
docker pull yourusername/e2e-playwright-tests:latest

# Run it
docker run --rm yourusername/e2e-playwright-tests:latest
```

## Advanced Usage

### Running with different environments

```bash
# QA environment
docker run --rm \
  -e ENV=qa \
  -e DOTENV_PRIVATE_KEY_QA=<your_qa_key> \
  e2e-playwright-tests npm run test:qa

# Production environment
docker run --rm \
  -e ENV=prod \
  -e DOTENV_PRIVATE_KEY_PROD=<your_prod_key> \
  e2e-playwright-tests npm run test
```

### Interactive mode (for debugging)

```bash
docker run -it --entrypoint /bin/bash e2e-playwright-tests
```

### Viewing test reports

```bash
# Run tests and mount report directories
docker run --rm \
  -e ENV=qa \
  -e DOTENV_PRIVATE_KEY_QA=<your_qa_key> \
  -v "$(pwd)/playwright-report:/app/playwright-report" \
  -v "$(pwd)/allure-results:/app/allure-results" \
  e2e-playwright-tests npm run test:qa

# Then open reports locally
npm run allure:open
```

### Security Best Practices

**Local Development & CI/CD (Unified Approach):**
- ✅ `.env.keys` excluded from Docker image (in `.dockerignore`)
- ✅ Pass decryption keys as environment variables (`-e DOTENV_PRIVATE_KEY_QA=...`)
- ✅ Keys never embedded in image layers
- ✅ Safe to push image to Docker Hub
- ✅ Same approach works locally and in CI/CD

**CI/CD-specific:**
- ✅ Store keys in secrets manager (GitHub Secrets, Jenkins Credentials, etc.)
- ✅ Never hardcode keys in CI/CD pipeline files
- ✅ Use different keys per environment (QA, Stage, Prod)
- ✅ Rotate keys periodically

**What NOT to do:**
- ❌ Remove `.env.keys` from `.dockerignore` (embeds keys in image)
- ❌ Commit `.env.keys` to git
- ❌ Hardcode keys in Dockerfile or docker-compose.yml
- ❌ Share Docker images with embedded keys publicly
- ❌ Use the same key across all environments

## CI/CD Integration

For CI/CD, pass decryption keys as environment variables instead of mounting files.

### GitHub Actions Setup

This project includes a pre-configured workflow at [`.github/workflows/docker-tests.yml`](.github/workflows/docker-tests.yml).

#### Step 1: Update Docker Image Name

Edit the workflow file line 51:

```yaml
env:
  DOCKER_IMAGE: yourusername/e2e-playwright-tests  # ← Change to your Docker Hub username
```

#### Step 2: Set Up GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

**Required Secrets (for encrypted .env files):**

| Secret Name | Value | Where to find |
|------------|-------|---------------|
| `DOTENV_PRIVATE_KEY_QA` | Copy from `.env.keys` | Line 11 in `.env.keys` |
| `DOTENV_PRIVATE_KEY_STAGE` | Copy from `.env.keys` | Line 14 in `.env.keys` |
| `DOTENV_PRIVATE_KEY_PROD` | Copy from `.env.keys` | Line 20 in `.env.keys` |
| `DOTENV_PRIVATE_KEY_DEV` | Copy from `.env.keys` | Line 17 in `.env.keys` |

**Optional Secrets (for private Docker images):**

| Secret Name | Value | Purpose |
|------------|-------|---------|
| `DOCKER_HUB_USERNAME` | Your Docker Hub username | To pull private images |
| `DOCKER_HUB_TOKEN` | Your Docker Hub access token | Authentication |

To get Docker Hub token: Docker Hub → Account Settings → Security → New Access Token

**Optional Secrets (for Slack notifications):**
- `SLACK_WEBHOOK_URL` - Get from [Slack Apps](https://api.slack.com/messaging/webhooks)

**Optional Secrets (for Email notifications):**
- `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, `NOTIFICATION_EMAILS`

#### Step 3: Run the Workflow

**Manual Trigger:**
1. Go to **Actions** tab → **Docker Tests** workflow → **Run workflow**
2. Select parameters:
   - **Environment**: qa, stage, prod, dev
   - **Test Suite**: smoke, regression, all, specific
   - **Docker Image Tag**: latest (or specific version)
   - **Test File**: (only if "specific" selected)

**Automatic Triggers:**
- On push to `main` branch (when `tests/` or workflow file changes)
- On pull request to `main`
- Scheduled daily at 3 AM UTC

#### Step 4: View Reports

Enable GitHub Pages: **Settings** → **Pages** → Source: **gh-pages** branch

Access reports at:
```
https://[YOUR-USERNAME].github.io/[REPO-NAME]/playwright-report/
https://[YOUR-USERNAME].github.io/[REPO-NAME]/allure-report/
```

#### Workflow Features

**Benefits vs. regular GitHub Actions:**

| Feature | Regular Actions | Docker-Based |
|---------|----------------|--------------|
| **Setup time** | 2-3 minutes (install deps) | 10-20 seconds (pull image) |
| **Consistency** | May vary per runner | Identical to local |
| **Debugging** | Hard to reproduce | Run same image locally |
| **Caching** | Manual cache management | Built into image |

#### Updating Docker Image for CI/CD

```bash
# 1. Rebuild locally
docker build -t yourusername/e2e-playwright-tests:latest .

# 2. Test locally
docker-compose up --build

# 3. Push to Docker Hub
docker push yourusername/e2e-playwright-tests:latest

# 4. GitHub Actions automatically uses the new image on next run
```

**Versioning Strategy:**
```bash
# Tag with version number
docker build -t yourusername/e2e-playwright-tests:v1.2.0 .
docker push yourusername/e2e-playwright-tests:v1.2.0

# Also tag as latest
docker tag yourusername/e2e-playwright-tests:v1.2.0 yourusername/e2e-playwright-tests:latest
docker push yourusername/e2e-playwright-tests:latest
```

### Jenkins Example

```groovy
stage('Run E2E Tests') {
    steps {
        script {
            // Store keys in Jenkins Credentials
            withCredentials([
                string(credentialsId: 'dotenv-key-qa', variable: 'DOTENV_PRIVATE_KEY_QA')
            ]) {
                docker.image('yourusername/e2e-playwright-tests:latest').inside(
                    "-e ENV=qa -e DOTENV_PRIVATE_KEY_QA=${DOTENV_PRIVATE_KEY_QA}"
                ) {
                    sh 'npm run test:qa:smoke'
                }
            }
        }
    }
}
```

### GitLab CI Example

```yaml
e2e-tests:
  image: docker:latest
  services:
    - docker:dind
  variables:
    ENV: "qa"
  script:
    - docker pull yourusername/e2e-playwright-tests:latest
    - docker run --rm 
        -e ENV=$ENV 
        -e DOTENV_PRIVATE_KEY_QA=$DOTENV_PRIVATE_KEY_QA 
        yourusername/e2e-playwright-tests:latest
  # Store DOTENV_PRIVATE_KEY_QA in GitLab CI/CD Variables (Settings → CI/CD → Variables)
```

## Troubleshooting

### Build issues
- Ensure Docker daemon is running
- Check Docker has enough disk space
- Try cleaning Docker cache: `docker system prune -a`

### Permission issues on Linux
```bash
# Run with user permissions
docker run --rm --user $(id -u):$(id -g) e2e-playwright-tests
```

### Browser download issues
- The base image includes browsers, but if you face issues:
- Ensure you're using the correct Playwright image version matching your package.json

### GitHub Actions Issues

**Issue: "Pull access denied"**
- Solution: Image is private. Add `DOCKER_HUB_USERNAME` and `DOCKER_HUB_TOKEN` secrets

**Issue: "could not decrypt ADMIN_PASSWORD"**
- Solution: Missing decryption key. Add `DOTENV_PRIVATE_KEY_QA` (or appropriate environment) to GitHub Secrets

**Issue: "Reports not found"**
- Solution: Check volume mounts, verify tests ran (check logs), ensure GitHub Pages is enabled

**Issue: "No notification received"**
- Solution: Verify `SLACK_WEBHOOK_URL` or email secrets (`MAIL_SERVER`, `MAIL_PORT`, etc.) are set correctly

## Image Size Optimization (Optional)

To reduce image size:

1. Use multi-stage builds
2. Remove unnecessary dependencies
3. Use `.dockerignore` to exclude files (already configured)

Current image is based on `mcr.microsoft.com/playwright` which includes all necessary browser dependencies.


