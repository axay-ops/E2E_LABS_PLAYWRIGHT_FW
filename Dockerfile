# Use official Playwright image with Node.js
FROM mcr.microsoft.com/playwright:v1.58.0-noble

# Install Java (required for Allure report generation)
RUN apt-get update && \
    apt-get install -y default-jre && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Install Playwright browsers (already included in the base image, but ensures they're up to date)
# RUN npx playwright install --with-deps

# Set environment variable
ENV CI=true

# Default command - can be overridden when running the container
CMD ["npm", "run", "test"]
