#!/bin/bash

# Used for DevContainer postCreateCommand
pnpm install
pnpm exec playwright install chromium
