#!/bin/bash

# Used for DevContainer postCreateCommand
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
