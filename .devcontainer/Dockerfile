FROM node:20

# PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Playwright Dependencies
RUN pnpm dlx playwright install-deps chromium
