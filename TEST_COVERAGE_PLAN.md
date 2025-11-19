# Plan d'Action pour Augmenter la Couverture de Tests à 80%

## 📊 État Actuel
- **Couverture actuelle** : 43.11% (lignes)
- **Objectif** : 80%
- **Écart** : +36.89 points de pourcentage

## 🎯 Stratégie Globale

### Phase 1 : Fichiers Critiques avec 0% de Couverture (Priorité Haute)
Ces fichiers sont essentiels au fonctionnement de l'application et doivent être testés en priorité.

### Phase 2 : Fichiers Partiellement Couverts (Priorité Moyenne)
Améliorer la couverture des fichiers déjà partiellement testés.

### Phase 3 : Optimisation et Finition (Priorité Basse)
Atteindre et maintenir 80% de couverture avec des tests de bord.

---

## 📋 Plan d'Action Détaillé

### Phase 1 : Fichiers Critiques (0% → ~80%)

#### 1.1 Point d'Entrée CLI (`src/cli.ts`)
**Priorité** : ⭐⭐⭐⭐⭐ (Critique)
**Couverture actuelle** : 0%
**Impact** : Point d'entrée principal de l'application

**Actions** :
- [ ] Créer `src/cli.test.ts`
- [ ] Tester l'initialisation de Commander
- [ ] Tester chaque commande (commit, stats, hooks, ai-suggest)
- [ ] Tester la gestion des erreurs
- [ ] Tester les options globales

**Estimation** : 2-3 heures
**Gain de couverture** : ~+0.5%

#### 1.2 Module AI Principal (`src/ai/index.ts`)
**Priorité** : ⭐⭐⭐⭐⭐ (Critique)
**Couverture actuelle** : 0%
**Impact** : Fonctionnalité principale de génération IA

**Actions** :
- [ ] Créer `src/ai/index.test.ts`
- [ ] Tester `analyzeStagedChanges`
- [ ] Tester la gestion des erreurs
- [ ] Tester les cas limites (diff vide, pas de fichiers staged)

**Estimation** : 2-3 heures
**Gain de couverture** : ~+0.3%

#### 1.3 Prompts IA (`src/ai/prompts/generate-commit-message.ts`)
**Priorité** : ⭐⭐⭐⭐ (Haute)
**Couverture actuelle** : 0%
**Impact** : Qualité des commits générés

**Actions** :
- [ ] Créer `src/ai/prompts/generate-commit-message.test.ts`
- [ ] Tester la génération de prompts avec différents contextes
- [ ] Tester les variantes de prompts (Ollama, OpenAI, Mistral)
- [ ] Tester la gestion des contextes vides ou invalides

**Estimation** : 2-3 heures
**Gain de couverture** : ~+0.2%

#### 1.4 Commandes CLI (`src/commands/`)
**Priorité** : ⭐⭐⭐⭐⭐ (Critique)
**Couverture actuelle** : 0%
**Impact** : Toutes les fonctionnalités utilisateur

**Fichiers à tester** :
- [ ] `src/commands/commit.tsx` - Commande principale
- [ ] `src/commands/stats.tsx` - Statistiques
- [ ] `src/commands/hooks.tsx` - Installation des hooks
- [ ] `src/commands/ai-suggest.tsx` - Suggestion IA (dépréciée)

**Actions** :
- [ ] Créer des tests d'intégration pour chaque commande
- [ ] Mocker les dépendances (CompositionRoot, use cases)
- [ ] Tester les flux de succès
- [ ] Tester les cas d'erreur
- [ ] Tester les interactions utilisateur (mocks d'Ink)

**Estimation** : 6-8 heures
**Gain de couverture** : ~+2.5%

#### 1.5 Composants React/Ink (`src/components/`)
**Priorité** : ⭐⭐⭐⭐ (Haute)
**Couverture actuelle** : 0%
**Impact** : Interface utilisateur complète

**Composants prioritaires** :
- [ ] `src/components/CommitWorkflow.tsx` - Workflow principal
- [ ] `src/components/CommitTab.tsx` - Onglet commit
- [ ] `src/components/MessageBuilder.tsx` - Construction de message
- [ ] `src/components/AIGenerator.tsx` - Générateur IA
- [ ] `src/components/FileSelector.tsx` - Sélecteur de fichiers
- [ ] `src/components/TypeSelector.tsx` - Sélecteur de type
- [ ] `src/components/ScopeSelector.tsx` - Sélecteur de scope

**Actions** :
- [ ] Créer des tests pour chaque composant
- [ ] Utiliser `@testing-library/react` ou équivalent pour Ink
- [ ] Tester les interactions utilisateur
- [ ] Tester les props et états
- [ ] Tester les callbacks

**Estimation** : 10-12 heures
**Gain de couverture** : ~+4.0%

### Phase 2 : Fichiers Partiellement Couverts

#### 2.1 Providers IA (`src/ai/providers/`)
**Priorité** : ⭐⭐⭐ (Moyenne)
**Couverture actuelle** : 30.37%
**Objectif** : 80%

**Fichiers à améliorer** :
- [ ] `src/ai/providers/mistral.ts` (25% → 80%)
- [ ] `src/ai/providers/ollama.ts` (12% → 80%)
- [ ] `src/ai/providers/openai.ts` (28% → 80%)
- [ ] `src/ai/providers/base.ts` (33% → 80%)

**Actions** :
- [ ] Ajouter des tests pour les cas d'erreur réseau
- [ ] Tester les timeouts
- [ ] Tester les réponses invalides
- [ ] Tester la validation des configurations
- [ ] Tester les retries

**Estimation** : 4-5 heures
**Gain de couverture** : ~+1.5%

#### 2.2 Use Cases (`src/application/use-cases/`)
**Priorité** : ⭐⭐⭐ (Moyenne)
**Couverture actuelle** : 81.76%
**Objectif** : 85%+

**Fichiers à améliorer** :
- [ ] `src/application/use-cases/GenerateHistoryUseCase.ts` (62% → 85%)
- [ ] `src/application/use-cases/GenerateOptionsUseCase.ts` (81% → 85%)
- [ ] `src/application/use-cases/InstallHooksUseCase.ts` (80% → 85%)

**Actions** :
- [ ] Ajouter des tests pour les cas limites
- [ ] Tester les erreurs de validation
- [ ] Tester les cas d'échec

**Estimation** : 2-3 heures
**Gain de couverture** : ~+0.5%

#### 2.3 Mappers (`src/application/mappers/`)
**Priorité** : ⭐⭐ (Basse)
**Couverture actuelle** : 58.53%
**Objectif** : 80%

**Fichiers à améliorer** :
- [ ] `src/application/mappers/CommitMessageMapper.ts` (41% → 80%)

**Actions** :
- [ ] Tester toutes les méthodes non couvertes
- [ ] Tester les cas d'erreur de mapping
- [ ] Tester les validations

**Estimation** : 1-2 heures
**Gain de couverture** : ~+0.3%

#### 2.4 Repository Implementation (`src/infrastructure/repositories/`)
**Priorité** : ⭐⭐⭐ (Moyenne)
**Couverture actuelle** : 70.73%
**Objectif** : 85%

**Actions** :
- [ ] Tester les méthodes non couvertes dans `GitRepositoryImpl.ts`
- [ ] Tester les cas d'erreur Git
- [ ] Tester les cas limites (repository vide, pas de remote, etc.)

**Estimation** : 2-3 heures
**Gain de couverture** : ~+0.5%

#### 2.5 DI Container (`src/infrastructure/di/`)
**Priorité** : ⭐⭐ (Basse)
**Couverture actuelle** : 68.7%
**Objectif** : 80%

**Fichiers à améliorer** :
- [ ] `src/infrastructure/di/ServiceRegistry.ts` (79% → 85%)
- [ ] `src/infrastructure/di/DIContext.tsx` (0% → 80%)
- [ ] `src/infrastructure/di/hooks.ts` (0% → 80%)

**Actions** :
- [ ] Tester les hooks React pour DI
- [ ] Tester le contexte React
- [ ] Compléter les tests de ServiceRegistry

**Estimation** : 3-4 heures
**Gain de couverture** : ~+0.5%

### Phase 3 : Optimisation

#### 3.1 Fichiers Index (`src/**/index.ts`)
**Priorité** : ⭐ (Très Basse)
**Couverture actuelle** : 0%
**Note** : Ces fichiers sont principalement des exports. Peuvent être exclus de la couverture si nécessaire.

**Actions** :
- [ ] Vérifier si ces fichiers doivent être testés
- [ ] Si oui, créer des tests simples pour les exports

**Estimation** : 1-2 heures
**Gain de couverture** : ~+0.2%

#### 3.2 Fichiers de Configuration
**Priorité** : ⭐ (Très Basse)
**Couverture actuelle** : Variable

**Actions** :
- [ ] Vérifier la nécessité de tester les fichiers de configuration
- [ ] Ajouter des tests si logique métier présente

**Estimation** : 1 heure
**Gain de couverture** : ~+0.1%

---

## 📈 Estimation Totale

### Temps Total Estimé
- **Phase 1** : 22-28 heures
- **Phase 2** : 12-16 heures
- **Phase 3** : 2-3 heures
- **Total** : 36-47 heures

### Gain de Couverture Estimé
- **Phase 1** : ~+7.5%
- **Phase 2** : ~+3.3%
- **Phase 3** : ~+0.3%
- **Total** : ~+11.1%

**Couverture finale estimée** : 43.11% + 11.1% = **54.21%**

⚠️ **Note** : Pour atteindre 80%, il faudra probablement :
1. Tester plus en profondeur les composants UI
2. Ajouter des tests d'intégration end-to-end
3. Tester les cas limites et erreurs
4. Réduire les exclusions de couverture si possible

---

## 🎯 Plan d'Exécution Recommandé

### Semaine 1 : Fondations (Phase 1.1 - 1.3)
- Jour 1-2 : Tests pour `cli.ts`
- Jour 3-4 : Tests pour `ai/index.ts` et prompts
- Jour 5 : Revue et ajustements

### Semaine 2 : Commandes et Composants (Phase 1.4 - 1.5)
- Jour 1-3 : Tests pour les commandes CLI
- Jour 4-5 : Tests pour les composants prioritaires

### Semaine 3 : Amélioration (Phase 2)
- Jour 1-2 : Amélioration des providers IA
- Jour 3-4 : Amélioration des use cases et repositories
- Jour 5 : Tests des mappers et DI

### Semaine 4 : Finalisation (Phase 3)
- Jour 1-2 : Optimisation et finition
- Jour 3-4 : Tests d'intégration supplémentaires
- Jour 5 : Revue finale et documentation

---

## 🔧 Outils et Techniques

### Tests Unitaires
- Vitest (déjà configuré)
- Mocks avec `vi.mock()`
- Snapshots pour les composants

### Tests d'Intégration
- Tests end-to-end des commandes
- Tests avec mocks de Git
- Tests avec mocks d'API IA

### Tests de Composants React/Ink
- `@testing-library/react` (si compatible avec Ink)
- Tests d'interactions utilisateur
- Tests de rendu conditionnel

### Couverture
- Configuration Vitest déjà en place
- Seuil à 80% configuré
- Rapports HTML disponibles

---

## 📝 Notes Importantes

1. **Priorités** : Se concentrer d'abord sur Phase 1 pour avoir un impact maximal
2. **Qualité vs Quantité** : Mieux vaut des tests de qualité que beaucoup de tests superficiels
3. **Maintenabilité** : Écrire des tests maintenables et bien documentés
4. **CI/CD** : S'assurer que les tests passent dans CI avant de merger
5. **Exclusions** : Réviser les exclusions dans `vitest.config.ts` si nécessaire

---

## ✅ Checklist de Validation

Avant de considérer le plan comme terminé :

- [ ] Tous les fichiers de Phase 1 ont ≥ 80% de couverture
- [ ] Tous les fichiers de Phase 2 ont ≥ 80% de couverture
- [ ] La couverture globale est ≥ 80%
- [ ] Tous les tests passent
- [ ] Les tests sont maintenables et bien documentés
- [ ] La configuration de couverture est optimale
- [ ] Documentation mise à jour

---

**Dernière mise à jour** : 2025-01-XX
**Statut** : 📋 Plan créé - Prêt pour exécution

