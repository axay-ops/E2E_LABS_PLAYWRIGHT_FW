# Docker Setup Guide

This guide explains how to build, run, and publish your Playwright testing framework as a Docker image.

## Prerequisites

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
2. Docker Hub account (sign up at [hub.docker.com](https://hub.docker.com))

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
  -e DOTENV_PRIVATE_KEY_QA=75a68e4da6759940be169532f3e2f956db52dd5c1799625064655a2bab617e39 \
  e2e-playwright-tests npx playwright test ./tests/loginpage.spec.ts

# Run specific test suite
docker run --rm \
  -e ENV=qa \
  -e DOTENV_PRIVATE_KEY_QA=75a68e4da6759940be169532f3e2f956db52dd5c1799625064655a2bab617e39 \
  e2e-playwright-tests npm run test:qa

# Run and mount results directory to view reports
docker run --rm \
  -e ENV=qa \
  -e DOTENV_PRIVATE_KEY_QA=75a68e4da6759940be169532f3e2f956db52dd5c1799625064655a2bab617e39 \
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

### 1. Login to Docker Hub

```bash
docker login
# Enter your Docker Hub username and password
```

### 2. Tag your image

```bash
# Replace 'yourusername' with your Docker Hub username
docker tag e2e-playwright-tests yourusername/e2e-playwright-tests:latest
docker tag e2e-playwright-tests yourusername/e2e-playwright-tests:1.0.0
```

### 3. Push to Docker Hub

```bash
# Push latest
docker push yourusername/e2e-playwright-tests:latest

# Push specific version
docker push yourusername/e2e-playwright-tests:1.0.0
```

### 4. Pull and run from Docker Hub (on any machine)

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

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Pull and run tests
        env:
          # Store these in GitHub Secrets
          DOTENV_PRIVATE_KEY_QA: ${{ secrets.DOTENV_PRIVATE_KEY_QA }}
          DOTENV_PRIVATE_KEY_PROD: ${{ secrets.DOTENV_PRIVATE_KEY_PROD }}
        run: |
          docker pull yourusername/e2e-playwright-tests:latest
          docker run --rm \
            -e ENV=qa \
            -e DOTENV_PRIVATE_KEY_QA \
            yourusername/e2e-playwright-tests:latest
```

**Setting up GitHub Secrets:**
1. Go to your repo → Settings → Secrets and variables → Actions
2. Add secrets:
   - `DOTENV_PRIVATE_KEY_QA` = `75a68e4da6759940be169532f3e2f956db52dd5c1799625064655a2bab617e39`
   - `DOTENV_PRIVATE_KEY_PROD` = (value from .env.keys)
   - etc. for each environment

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

## Image Size Optimization (Optional)

To reduce image size:

1. Use multi-stage builds
2. Remove unnecessary dependencies
3. Use `.dockerignore` to exclude files (already configured)

Current image is based on `mcr.microsoft.com/playwright` which includes all necessary browser dependencies.
