# E2E_LABS_PLAYWRIGHT_FW

Welcome to the **E2E_LABS_PLAYWRIGHT_FW** automation project. Below you can find the latest test results and HTML reports.

---

## Workflow Status

[![Docker Build & Push](https://github.com/axay-ops/E2E_LABS_PLAYWRIGHT_FW/actions/workflows/docker-build-push.yml/badge.svg?branch=main)](https://github.com/axay-ops/E2E_LABS_PLAYWRIGHT_FW/actions/workflows/docker-build-push.yml)

[![Docker Tests](https://github.com/axay-ops/E2E_LABS_PLAYWRIGHT_FW/actions/workflows/docker-tests.yml/badge.svg?branch=main)](https://github.com/axay-ops/E2E_LABS_PLAYWRIGHT_FW/actions/workflows/docker-tests.yml)

[![Nightly Build](https://github.com/axay-ops/E2E_LABS_PLAYWRIGHT_FW/actions/workflows/cron-schedule.yml/badge.svg?branch=main&event=schedule)](https://github.com/axay-ops/E2E_LABS_PLAYWRIGHT_FW/actions/workflows/cron-schedule.yml)

[![Manual Run](https://github.com/axay-ops/E2E_LABS_PLAYWRIGHT_FW/actions/workflows/manual-run.yml/badge.svg?branch=main)](https://github.com/axay-ops/E2E_LABS_PLAYWRIGHT_FW/actions/workflows/manual-run.yml)

---

## HTML Reports

Click the badges below to view the latest reports published via GitHub Pages:

[![ESLint-Report](https://img.shields.io/badge/ESLint-Report-yellow)](https://axay-ops.github.io/E2E_LABS_PLAYWRIGHT_FW/eslint-report/index.html)

[![Playwright-Report](https://img.shields.io/badge/Playwright-Report-blue)](https://axay-ops.github.io/E2E_LABS_PLAYWRIGHT_FW/playwright-report/index.html)

[![Playwright-HTML-Reporter](https://img.shields.io/badge/Playwright_HTML-Report-green)](https://axay-ops.github.io/E2E_LABS_PLAYWRIGHT_FW/playwright-html-report/index.html)

[![Allure-Report](https://img.shields.io/badge/Allure-Report-red)](https://axay-ops.github.io/E2E_LABS_PLAYWRIGHT_FW/allure-report/index.html)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[CI_CD_PIPELINE.md](CI_CD_PIPELINE.md)** | Complete CI/CD automation guide with workflow diagrams, timing, and troubleshooting |
| **[DOCKER.md](DOCKER.md)** | Docker setup, build, and deployment guide |
| **[.github/workflows/](. github/workflows/)** | GitHub Actions workflow files |

## 🚀 Quick Start

### Automated CI/CD (Recommended)

Every push to `main` automatically:
1. Builds Docker image with all dependencies
2. Pushes to Docker Hub
3. Runs automated tests
4. Publishes reports to GitHub Pages
5. Sends notifications

See **[CI_CD_PIPELINE.md](CI_CD_PIPELINE.md)** for complete setup.

### Local Development

```bash
# Install dependencies
npm install

# Run tests
npm run test:qa

# View reports
npm run allure:open
```

### Docker

```bash
# Build image
docker build -t e2e-tests .

# Run tests
docker run --rm -e ENV=qa -e DOTENV_PRIVATE_KEY_QA=xxx e2e-tests
```

See **[DOCKER.md](DOCKER.md)** for complete guide.

---

## Notes

- Playwright HTML report is generated automatically from `npx playwright test`
- Allure report is generated from the `allure-results` folder
- All reports are published to `gh-pages` branch and updated on each workflow run
- Docker image automatically built and pushed on code changes
