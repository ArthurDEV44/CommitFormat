#!/bin/bash

# Script de développement intelligent

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

echo "🚀 Lancement en mode développement avec $PM..."

case $PM in
  pnpm)
    pnpm run dev
    ;;
  bun)
    bun run dev
    ;;
  yarn)
    yarn dev
    ;;
  npm)
    npm run dev
    ;;
esac
