#!/bin/bash

# Script de build intelligent

set -e

# Fonction pour détecter le package manager
detect_package_manager() {
  if [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm"
  elif [ -f "bun.lockb" ]; then
    echo "bun"
  elif [ -f "yarn.lock" ]; then
    echo "yarn"
  elif [ -f "package-lock.json" ]; then
    echo "npm"
  elif command -v pnpm &> /dev/null; then
    echo "pnpm"
  elif command -v bun &> /dev/null; then
    echo "bun"
  elif command -v yarn &> /dev/null; then
    echo "yarn"
  else
    echo "npm"
  fi
}

PM=$(detect_package_manager)

echo "🏗️  Build avec $PM..."

case $PM in
  pnpm)
    pnpm run build
    ;;
  bun)
    bun run build
    ;;
  yarn)
    yarn build
    ;;
  npm)
    npm run build
    ;;
esac

echo "✅ Build terminé !"
