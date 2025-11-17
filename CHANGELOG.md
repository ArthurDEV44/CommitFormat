# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2024-11-17

### Ajouté

#### Fonctionnalités principales
- CLI interactif pour créer des commits conventionnels
- Support complet du format [Conventional Commits](https://www.conventionalcommits.org/)
- Prompts guidés avec validation en temps réel
- Commit automatique avec staging des fichiers

#### Git Hooks
- Installation automatique de hooks Git `commit-msg`
- Validation du format des commits
- Désinstallation facile des hooks
- Messages d'erreur clairs et instructifs

#### Statistiques
- Analyse de l'historique Git
- Calcul du taux de conformité aux conventions
- Répartition par type de commit avec émojis
- Barres de progression visuelles
- Support de l'analyse d'un nombre personnalisé de commits

#### Configuration
- Système de configuration flexible avec cosmiconfig
- Support de multiples formats : `.commitformatrc`, `.commitformatrc.json`, `.commitformatrc.js`, etc.
- Types de commits personnalisables
- Scopes prédéfinis ou libres
- Limites de longueur configurables
- Configuration par défaut complète avec émojis

#### Support Multi-Package Managers
- Support complet de npm, pnpm, yarn et bun
- Scripts intelligents de détection automatique
- Fichiers de configuration pour chaque gestionnaire
- Documentation détaillée pour chaque outil

#### Documentation
- README complet en français
- Guide de démarrage pas-à-pas
- Guide détaillé des package managers
- Exemples d'utilisation
- Fichier de configuration d'exemple

#### Interface utilisateur
- Couleurs avec chalk pour une meilleure lisibilité
- Émojis pour identifier rapidement les types de commits
- Messages clairs et en français
- Aide détaillée sur le format conventionnel

### Détails techniques

- **TypeScript** pour la sûreté des types
- **Commander** pour le parsing CLI
- **Inquirer** pour les prompts interactifs
- **simple-git** pour les opérations Git
- **cosmiconfig** pour la configuration flexible
- **tsup** pour le build rapide

### Notes de version

Cette première version stable inclut toutes les fonctionnalités essentielles pour :
- Créer des commits conventionnels facilement
- Valider automatiquement le format
- Analyser la qualité de l'historique
- S'adapter à tous les workflows de développement

---

## Versions futures

### [1.1.0] - Prévu

#### Prévu
- Tests unitaires avec Vitest
- CI/CD avec GitHub Actions
- Génération automatique de CHANGELOG
- Support des templates de commits
- Mode non-interactif pour CI/CD

### [1.2.0] - Idées

#### En réflexion
- Intégration JIRA/Linear pour les tickets
- Support multi-langues (anglais, espagnol)
- Plugin pour éditeurs (VSCode, etc.)
- API pour intégrations customs

---

## Comment contribuer

Les suggestions de fonctionnalités sont les bienvenues ! Ouvrez une issue pour discuter de ce que vous aimeriez voir dans les prochaines versions.

## Format du Changelog

- **Ajouté** : Nouvelles fonctionnalités
- **Modifié** : Changements dans les fonctionnalités existantes
- **Déprécié** : Fonctionnalités qui seront supprimées
- **Supprimé** : Fonctionnalités supprimées
- **Corrigé** : Corrections de bugs
- **Sécurité** : Vulnérabilités corrigées

[1.0.0]: https://github.com/username/commitformat/releases/tag/v1.0.0
