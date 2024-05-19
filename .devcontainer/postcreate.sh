#!/bin/bash

# Used for DevContainer postCreateCommand

# Install pnpm version specified in package.json files.
corepack install

# Install Packages
pnpm install --frozen-lockfile

# Install Chromium Browser to Project
pnpm exec playwright install chromium
