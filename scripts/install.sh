#!/bin/bash

# Script d'installation intelligent qui détecte le package manager

set -e

echo "🔍 Détection du gestionnaire de paquets..."

# Fonction pour détecter le package manager
detect_package_manager() {
  # Vérifier si un lock file existe
  if [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm"
  elif [ -f "bun.lockb" ]; then
    echo "bun"
  elif [ -f "yarn.lock" ]; then
    echo "yarn"
  elif [ -f "package-lock.json" ]; then
    echo "npm"
  # Vérifier les commandes disponibles
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

echo "📦 Utilisation de $PM"

# Installation selon le package manager
case $PM in
  pnpm)
    echo "⚡ Installation avec pnpm..."
    pnpm install
    ;;
  bun)
    echo "🥟 Installation avec Bun..."
    bun install
    ;;
  yarn)
    echo "🧶 Installation avec Yarn..."
    yarn install
    ;;
  npm)
    echo "📦 Installation avec npm..."
    npm install
    ;;
esac

echo "✅ Installation terminée !"
