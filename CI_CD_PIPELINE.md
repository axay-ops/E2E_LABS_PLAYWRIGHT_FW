# GitHub Actions CI/CD Pipeline

Complete guide to the automated Docker build and test workflows.

## 📋 Quick Setup Checklist

**Before using the automated pipeline:**

- [ ] Add GitHub Secrets: `DOCKER_HUB_USERNAME` and `DOCKER_HUB_TOKEN`
  - Get token: [Docker Hub](https://hub.docker.com) → Account Settings → Security → New Access Token
- [ ] Update `DOCKER_IMAGE` name in `.github/workflows/docker-build-push.yml` (line 31)
- [ ] Add dotenv secrets: `DOTENV_PRIVATE_KEY_QA`, `DOTENV_PRIVATE_KEY_STAGE`, etc.
- [ ] (Optional) Add `SLACK_WEBHOOK_URL` for notifications
- [ ] Push changes and watch the workflows run!

**That's it! Now every push automatically builds, tests, and reports.**

---

## 🎯 What You Get

- ✅ **Zero manual builds** - Push code, image builds automatically
- ✅ **Automatic testing** - Tests run with new image immediately  
- ✅ **Fast builds** - Layer caching reduces build time by 60%
- ✅ **Multiple tags** - `latest`, commit SHA, custom versions
- ✅ **Test reports** - Published to GitHub Pages automatically
- ✅ **Notifications** - Slack & Email alerts on completion

---

## 🔄 Complete Automation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DEVELOPER WORKFLOW                           │
└─────────────────────────────────────────────────────────────────────┘

  1. Developer makes code changes
  2. git commit -m "Update tests"
  3. git push origin main
                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│          GITHUB ACTIONS: docker-build-push.yml (2-3 min)            │
├─────────────────────────────────────────────────────────────────────┤
│  ✅ Checkout code                                                    │
│  ✅ Setup Docker Buildx                                              │
│  ✅ Login to Docker Hub                                              │
│  ✅ Build Docker image (with Java, Playwright, deps)                │
│  ✅ Push to Docker Hub:                                              │
│     • axayhub/e2e-labs-playwright-fw-hubrepo:latest                 │
│     • axayhub/e2e-labs-playwright-fw-hubrepo:<commit-sha>           │
└─────────────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│          GITHUB ACTIONS: docker-tests.yml (5-10 min)                │
├─────────────────────────────────────────────────────────────────────┤
│  ✅ Pull latest Docker image from Docker Hub                         │
│  ✅ Run Playwright tests inside container                            │
│     • Environment: QA                                                │
│     • Test Suite: Smoke                                              │
│     • Browsers: Chromium, Chrome                                     │
│  ✅ Generate reports:                                                │
│     • Playwright HTML Report                                         │
│     • Playwright Built-in Report                                     │
│     • Allure Report                                                  │
│  ✅ Upload artifacts to GitHub                                       │
│  ✅ Publish reports to GitHub Pages                                  │
│  ✅ Send Slack notification                                          │
│  ✅ Send Email notification                                          │
└─────────────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         RESULTS PUBLISHED                            │
├─────────────────────────────────────────────────────────────────────┤
│  📊 Reports: https://username.github.io/repo/allure-report/         │
│  💬 Slack: Test results posted to team channel                      │
│  📧 Email: Test summary sent to stakeholders                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Workflow Triggers

### docker-build-push.yml

**Automatic Triggers:**
```yaml
on:
  push:
    branches: [main]
    paths:
      - Dockerfile
      - package*.json
      - playwright.config.ts
      - tests/**
      - lib/**, pages/**
```

**Manual Trigger:**
- Go to Actions → Docker Build & Push → Run workflow
- Options: Custom tag, trigger tests, test env, test suite

### docker-tests.yml

**Automatic Trigger:**
- ✅ Triggered by `docker-build-push.yml` after successful build
- ✅ Ensures tests always use the newly built Docker image

**Manual Trigger:**
- Go to Actions → Docker Tests → Run workflow
- Options: Environment, test suite, image tag, test file

**Scheduled Trigger:**
```yaml
schedule:
  - cron: '0 3 * * *'  # Daily at 3 AM UTC
```

**⚠️ Important: Push Trigger Commented Out**

The `push` trigger is **commented out** in `docker-tests.yml` to avoid conflicts:
- ❌ **Don't enable** if using the automated build pipeline
- ✅ Tests are automatically triggered by `docker-build-push.yml` after building
- If enabled, tests would run **twice**: once with old image, once with new image
- Only uncomment if you want to run tests WITHOUT rebuilding the Docker image first

---

## 🔀 Workflow Relationships

```
┌─────────────────────────────────┐
│   docker-build-push.yml         │
│   (Builds Docker Image)         │
└────────────┬────────────────────┘
             │
             │ triggers (workflow_dispatch)
             │
             ↓
┌─────────────────────────────────┐
│   docker-tests.yml              │
│   (Runs Tests)                  │
└─────────────────────────────────┘
```

**Trigger Mechanism:**
- Uses GitHub Actions API (`actions/github-script`)
- Calls `createWorkflowDispatch()` on `docker-tests.yml`
- Passes inputs: environment, test_suite, docker_image_tag

---

## 📊 Timing Breakdown

### Total Time: ~7-13 minutes

| Step | Time | Description |
|------|------|-------------|
| **Build Workflow** | 2-3 min | With Docker layer caching |
| Checkout & Setup | 10s | Get code, setup tools |
| Docker Build | 1-2 min | Cached layers speed this up |
| Push to Hub | 30s | Upload image |
| Trigger Tests | 5s | API call to start tests |
| **Test Workflow** | 5-10 min | Depends on test suite |
| Pull Image | 20s | Download from Docker Hub |
| Run Tests | 3-8 min | Smoke: ~3 min, Regression: ~8 min |
| Generate Reports | 1 min | Allure, Playwright HTML |
| Publish to Pages | 30s | Upload to gh-pages branch |
| Notifications | 10s | Slack + Email |

---

## 🎛️ Configuration Options

### Build Workflow

**File:** `.github/workflows/docker-build-push.yml`

**Key Variables:**
```yaml
env:
  DOCKER_IMAGE: axayhub/e2e-labs-playwright-fw-hubrepo  # Your Docker Hub repo
```

**Customize Defaults:**
```yaml
# Lines 175-179
const environment = 'qa';      # Default test environment
const testSuite = 'smoke';     # Default test suite
const imageTag = 'latest';     # Default image tag
```

### Test Workflow

**File:** `.github/workflows/docker-tests.yml`

**Key Variables:**
```yaml
env:
  DOCKER_IMAGE: axayhub/e2e-labs-playwright-fw-hubrepo
  NODE_VERSION: '20'
```

**Report URLs:**
```yaml
# Lines 408, 493-494
# Update with your GitHub username/repo
https://axay-ops.github.io/E2E_LABS_PLAYWRIGHT_FW/allure-report/
```

---

## 🔐 Required Secrets

### For docker-build-push.yml

| Secret | Purpose |
|--------|---------|
| `DOCKER_HUB_USERNAME` | Docker Hub login |
| `DOCKER_HUB_TOKEN` | Docker Hub authentication |

### For docker-tests.yml

| Secret | Purpose | Required |
|--------|---------|----------|
| `DOTENV_PRIVATE_KEY_QA` | Decrypt QA environment vars | ✅ Yes |
| `DOTENV_PRIVATE_KEY_STAGE` | Decrypt Stage environment vars | Optional |
| `DOTENV_PRIVATE_KEY_PROD` | Decrypt Prod environment vars | Optional |
| `DOTENV_PRIVATE_KEY_DEV` | Decrypt Dev environment vars | Optional |
| `SLACK_WEBHOOK_URL` | Slack notifications | Optional |
| `MAIL_SERVER`, `MAIL_PORT`, etc. | Email notifications | Optional |

---

## 🚦 Workflow Status Indicators

### In GitHub

**Actions Tab:**
- 🟢 Green checkmark = All passed
- 🔴 Red X = Failed
- 🟡 Yellow dot = In progress
- ⚪ Gray circle = Queued

**Branch Protection:**
- Can require workflows to pass before merging PRs
- Can require status checks from `docker-tests.yml`

### Notifications

**Slack:**
- ✅ Green message = Tests passed
- ❌ Red message = Tests failed
- ⚠️ Yellow message = Partial completion

**Email:**
- Color-coded HTML emails
- Links to reports and workflow runs

---

## 🔧 Debugging Workflows

### View Logs

1. Go to **Actions** tab
2. Click on workflow run
3. Click on job name
4. Expand steps to see logs

### Common Issues

**Build fails:**
- Check Docker Hub credentials
- Verify Dockerfile syntax
- Check disk space on runner

**Tests fail:**
- Check if image pulled successfully
- Verify environment secrets are set
- Check test logs for actual failures

**Tests not triggered:**
- Check trigger conditions (line 114)
- Verify `docker-tests.yml` exists
- Check GitHub token permissions

---

## 📈 Optimization Tips

### Speed Up Builds

1. **Docker Layer Caching** (✅ Already enabled)
   - Reuses unchanged layers
   - Reduces build time by ~60%

2. **Optimize Dockerfile**
   - Put rarely-changing commands first
   - Copy `package.json` before other files
   - Multi-stage builds for smaller images

3. **Parallel Test Execution**
   - Already configured: `workers: 1` in CI
   - Can increase for faster test runs

### Reduce Costs

1. **Conditional Triggers**
   - Only build when relevant files change (✅ Done)
   - Skip tests on documentation changes

2. **Cache Management**
   - Automatically cleans old layers
   - Uses registry cache (Docker Hub)

3. **Scheduled Runs**
   - Run regression tests nightly, not on every push

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `.github/workflows/docker-build-push.yml` | Build & push Docker image |
| `.github/workflows/docker-tests.yml` | Run tests with Docker |
| `.github/workflows/manual-run.yml` | Manual test runs (no Docker) |
| `.github/workflows/cron-schedule.yml` | Scheduled test runs |
| `Dockerfile` | Docker image definition |
| `docker-compose.yml` | Local Docker testing |
| `playwright.config.ts` | Playwright configuration |
| `.dockerignore` | Files excluded from image |

---

## ✅ Quick Reference

### Trigger Build Manually

```bash
# Via web UI
Actions → Docker Build & Push → Run workflow

# Or push code
git push origin main  # Auto-triggers
```

### Trigger Tests Manually

```bash
# Via web UI
Actions → Docker Tests → Run workflow

# Or wait for automatic trigger after build
```

### View Reports

```
https://[username].github.io/[repo]/allure-report/
https://[username].github.io/[repo]/playwright-report/
```

### Pull Latest Image

```bash
docker pull axayhub/e2e-labs-playwright-fw-hubrepo:latest
```

---

## 🐛 Troubleshooting

### Build Workflow Issues

**"Login to Docker Hub failed"**
- Check GitHub Secrets: `DOCKER_HUB_USERNAME` and `DOCKER_HUB_TOKEN`
- Verify token has Read & Write permissions

**"Build failed - permission denied"**
- Ensure Docker Hub token has correct permissions
- Regenerate token if needed

**"Workflow not triggering"**
- Check if changed files match `paths` filter in workflow
- Non-matching files won't trigger the build

### Test Workflow Issues

**"Pull access denied"**
- Add Docker Hub credentials as GitHub Secrets (even for public images to avoid rate limits)

**"Could not decrypt ADMIN_PASSWORD"**
- Missing `DOTENV_PRIVATE_KEY_QA` (or appropriate env) secret
- Verify secret value matches `.env.keys` file

**"Tests not triggered after build"**
- Check trigger conditions in `docker-build-push.yml` line 114
- Verify `docker-tests.yml` exists and is valid
- Check Actions tab for any error messages

**"Reports not found"**
- Check volume mounts are working
- Verify tests actually ran (check logs)
- Ensure GitHub Pages is enabled

**"Tests running twice on push"**
- The `push` trigger in `docker-tests.yml` should be commented out
- Only `docker-build-push.yml` should have push trigger
- Tests are automatically triggered by build workflow

**"Tests using old Docker image"**
- Make sure push trigger is commented out in `docker-tests.yml`
- Tests should only run AFTER `docker-build-push.yml` completes
- Check that image tag in test run matches the newly built SHA

---

## 💡 Pro Tips

1. **Use commit SHAs for rollback:**
   ```bash
   # If latest build is broken, rollback
   docker pull axayhub/e2e-labs-playwright-fw-hubrepo:<previous-commit-sha>
   ```

2. **Test locally before pushing:**
   ```bash
   docker build -t test-build .
   docker run --rm -e ENV=qa -e DOTENV_PRIVATE_KEY_QA=xxx test-build
   ```

3. **Monitor build times:**
   - First build: ~5-10 minutes
   - Cached builds: ~1-2 minutes
   - If builds slow down, check cache efficiency

4. **Version tagging strategy:**
   ```bash
   # For releases, manually trigger with custom tag
   Actions → Docker Build & Push → Run workflow → tag: v1.2.0
   ```

5. **Parallel testing:**
   - Increase `workers` in `playwright.config.ts` for faster tests
   - Currently set to `1` in CI for stability

---

**🎉 Your automated CI/CD pipeline is ready!**

Push code → Build image → Run tests → Get results → All automatic! 🚀
